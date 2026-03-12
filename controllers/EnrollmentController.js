const { Enrollment, EnrollmentRequest, Class, Waitlist, Student, Subject, IdempotencyKey, Audit_Log } = require("../models");
const { Op } = require("sequelize");

class EnrollmentController {

    static async addEnrollmentRequest(req, res) {
        const t = await EnrollmentRequest.sequelize.transaction();
        try {
            //Check idempotency key
            const idempotencyKey = req.headers["idempotency-key"];

            if (!idempotencyKey) {
                await t.rollback();
                return res.status(400).json({
                    message: "Idempotency-Key header is required"
                });
            }

            // cek apakah request sudah pernah diproses
            const existingKey = await IdempotencyKey.findOne({
                where: { key: idempotencyKey },
                transaction: t
            });

            if (existingKey) {
                await t.rollback();
                return res.status(200).json(existingKey.response);
            }

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


            let studentId = req.body.student_id;

            //Get Student by Id
            const dataStudent = await Student.findByPk(studentId, {
                transaction: t
            });

            console.log('data student ', dataStudent);
            let subject = dataClass.Subject;
            let studentCredit = dataStudent.credit
            let subjectCredit = subject.dataValues.credit

            //Cek Credit Siswa
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

                const response = {
                    message: "Enrollment Request added successfully",
                    rejected_reason: "exceed credit limit",
                    data: dataEnrollmentRequest
                }

                //Create idempotency key
                await IdempotencyKey.create({
                    key: idempotencyKey,
                    response: response
                }, { transaction: t });

                await t.commit();

                return res.status(201).json(response);
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
                console.log('sudentd iddddd ', req.body.student_id);
                dataWaitlist = await Waitlist.create({
                    request_id: dataEnrollmentRequest.id,
                    class_id: req.body.class_id,
                    student_id: req.body.student_id,
                    position: "student",
                }, { transaction: t });

                const response = {
                    message: "Enrollment Request added successfully",
                    data: dataEnrollmentRequest
                }

                //Create idempotency key
                await IdempotencyKey.create({
                    key: idempotencyKey,
                    response: response
                }, { transaction: t });

                await t.commit();

                return res.status(201).json(response);
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
                            console.log("schedule clash");
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

                    const response = {
                        message: "Enrollment Request added successfully",
                        data: dataEnrollmentRequest
                    }

                    //Create idempotency key
                    await IdempotencyKey.create({
                        key: idempotencyKey,
                        response: response
                    }, { transaction: t });

                    await t.commit();

                    return res.status(201).json(response);
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

                    const response = {
                        message: "Enrollment Request added successfully",
                        data: dataEnrollmentRequest
                    }

                    //Create idempotency key
                    await IdempotencyKey.create({
                        key: idempotencyKey,
                        response: response
                    }, { transaction: t });

                    await t.commit();

                    return res.status(201).json(response);
                }
            }
        } catch (error) {
            await t.rollback();
            res.status(400).json({
                message: error.message
            });
        }
    }

    static async cancelEnrollment(req, res) {
        const t = await EnrollmentRequest.sequelize.transaction();
        try {
            console.log('cancel enrollment by id ', req.params.id);

            let enrollmentReqId = req.params.id;

            const data = await EnrollmentRequest.findByPk(enrollmentReqId);
            if (!data) {
                await t.rollback();
                return res.status(404).json({
                    message: "Enrollment Request not found"
                });
            }

            //Update status menjadi cancelled
            await data.update(
                {
                    status: "cancelled"
                },
                { transaction: t }
            );

            //Hapus Data dari Waitlist
            await Waitlist.destroy({
                where: {
                    request_id: enrollmentReqId,
                },
                transaction: t
            });

            //Catat di Audit Log

            await Audit_Log.create({
                entity: "EnrollmentRequest",
                entity_id: enrollmentReqId,
                action: "cancelled",
                old_value: JSON.stringify(data.dataValues),
                new_value: JSON.stringify({ ...data.dataValues, status: "cancelled" }),
            }, {
                transaction: t
            })

            await t.commit();

            res.status(200).json({
                message: `Enrollment ID ${enrollmentReqId} has been canceled`,
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