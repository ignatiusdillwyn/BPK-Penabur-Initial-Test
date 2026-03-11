const { Enrollment, EnrollmentRequest, Class, Waitlist, Student, Subject } = require("../models");
const { Op } = require("sequelize");

class EnrollmentController {
    
    static async addEnrollmentRequest(req, res) {
        const t = await EnrollmentRequest.sequelize.transaction();
        try {
            console.log('add enrollment request');
            let dataEnrollmentRequest = null
            //Get Class by Id
            let classId = req.body.class_id;

            let dataClass = await Class.findByPk(classId, {
                include: [
                    {
                        model: Subject,
                        as: "Subject",
                    }
                ],
                transaction: t
            });

            console.log('data classsss ', dataClass);

            //Cek Credit Siswa
            let studentId = req.body.student_id;

            const dataStudent = await Student.findByPk(studentId, {
                transaction: t
            });

            console.log('data student ', dataStudent);
            let subject = dataClass.Subject;
            let studentCredit = dataStudent.credit
            let subjectCredit = subject.dataValues.credit

            if (studentCredit + subjectCredit > 24) {
                console.log('Tidak bisa ambil kelas ini karena melebihi batas maksimal kredit')
                dataEnrollmentRequest = await EnrollmentRequest.create({
                    request_code: req.body.request_code,
                    student_id: req.body.student_id,
                    class_id: req.body.class_id,
                    requested_at: new Date(),
                    status: "rejected",
                    allow_waitlist: false,
                }, { transaction: t });
                await t.commit();
                return res.status(201).json({
                    message: "Enrollment Request added successfully",
                    data: dataEnrollmentRequest
                });
            }

            let class_max_capacity = dataClass.max_capacity;
            let class_current_capacity = dataClass.current_capacity;

            let dataWaitlist = null
            //Kalau Kelas Penuh
            if (class_current_capacity + 1 > class_max_capacity) {
                console.log('Kelas penuh, masuk waiting list')
                //Insert ke enrollment request
                dataEnrollmentRequest = await EnrollmentRequest.create({
                    request_code: req.body.request_code,
                    student_id: req.body.student_id,
                    class_id: req.body.class_id,
                    requested_at: new Date(),
                    status: "waitlisted",
                    allow_waitlist: true,
                }, { transaction: t });

                //Insert ke waitlist
                dataWaitlist = await Waitlist.create({
                    request_id: dataEnrollmentRequest.id,
                    position: "student",
                }, { transaction: t });
                await t.commit();
                return res.status(201).json({
                    message: "Enrollment Request added successfully",
                    data: dataEnrollmentRequest
                });
            } else {
                //Cek Apakah Jadwal Bertabarakan
                //Get Data Enrollment Request by Student Id
                let isSchedule_Clash = false
                let dataEnrollmentRequestByStudentId = await EnrollmentRequest.findAll({
                    where: {
                        student_id: req.body.student_id,
                    },
                    include: [
                        {
                            model: Class,
                            as: "Class",
                        }
                    ],
                    transaction: t
                });
                console.log('data enrollment request by student id ', dataEnrollmentRequestByStudentId);

                for (const data of dataEnrollmentRequestByStudentId) {

                    let classFromDB = data.Class;

                    let dayDB = classFromDB.dataValues.schedule_day;
                    let startDB = classFromDB.dataValues.schedule_start;
                    let endDB = classFromDB.dataValues.schedule_end;

                    let dayReq = dataClass.schedule_day;
                    let startReq = dataClass.schedule_start;
                    let endReq = dataClass.schedule_end;

                    if (dayDB.toString() === dayReq.toString()) {

                        if (startReq < endDB && endReq > startDB) {
                            console.log("JADWAL BENTROK");
                            isSchedule_Clash = true;
                            break; // 🚀 stop loop
                        }

                    }
                }

                //Kalau Jadwal Tabrakan
                if (isSchedule_Clash) {
                    console.log('gak bisa ambil kelas ini karena jadwal bentrok')
                    dataEnrollmentRequest = await EnrollmentRequest.create({
                        request_code: req.body.request_code,
                        student_id: req.body.student_id,
                        class_id: req.body.class_id,
                        requested_at: new Date(),
                        status: "rejected",
                        allow_waitlist: false,
                    }, { transaction: t });
                    await t.commit();
                    return res.status(201).json({
                        message: "Enrollment Request added successfully",
                        data: dataEnrollmentRequest
                    });
                } else {
                    console.log('Kelas masih ada kapasitas dan jadwal tidak bertabarakan, langsung enroll')
                    dataEnrollmentRequest = await EnrollmentRequest.create({
                        request_code: req.body.request_code,
                        student_id: req.body.student_id,
                        class_id: req.body.class_id,
                        requested_at: new Date(),
                        status: "pending",
                        allow_waitlist: false,
                    }, { transaction: t });
                    await t.commit();
                    return res.status(201).json({
                        message: "Enrollment Request added successfully",
                        data: dataEnrollmentRequest
                    });

                    //Update current capacity di class
                }

            }

            await t.commit();

            res.status(201).json({
                message: "Enrollment Request added successfully",
                data: dataEnrollmentRequest
            });
        } catch (error) {
            await t.rollback();
            res.status(400).json({
                message: error.message
            });
        }
    }

    static async cancelEnrollment(req, res) {
        const t = await Enrollment.sequelize.transaction();
        try {
            console.log('cancel enrollment by id ', req.params.id);

            let enrollmentId = req.params.id;

            const data = await Enrollment.findByPk(enrollmentId);
            if (!data) {
                await t.rollback();
                return res.status(404).json({
                    message: "Enrollment not found"
                });
            }

            await data.destroy();

            await t.commit();

            res.status(200).json({
                message: `Enrollment ID ${enrollmentId} deleted successfully`,
                data: data
            });
        } catch (error) {

            await t.rollback();

            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = EnrollmentController;