const { Enrollment, EnrollmentRequest, Class, Waitlist, Student, Subject, IdempotencyKey, Audit_Log } = require("../models");
const { Op, where } = require("sequelize");
const { all } = require("../routes");

class EnrollmentController {

    static async addEnrollmentRequest(req, res) {
        const t = await EnrollmentRequest.sequelize.transaction();
        try {
            //Check idempotency key
            const idempotencyKey = req.headers["idempotency-key"];

            if (!idempotencyKey) {
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
                return res.status(409).json({
                    message: 'idempotency key has been used',
                    key: existingKey.key
                });
            }

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

            //Get Student by Id
            let studentId = req.body.student_id;
            const dataStudent = await Student.findByPk(studentId, {
                transaction: t
            });

            let subject = dataClass.Subject;
            let studentCredit = dataStudent.credit
            let subjectCredit = subject.dataValues.credit

            //Cek Credit Siswa
            if (studentCredit + subjectCredit > 24) {
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

                //Store idempotency key
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
                        rejected_reason: "Schedule clash",
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
                    //Kalau kelas masih ada kapasitas dan jadwal tidak bertabarakan
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
                    status: "cancelled",
                    allow_waitlist: false,
                },
                { transaction: t }
            );

            let dataWaitlist = await Waitlist.findAll({
                where: {
                    request_id: enrollmentReqId,
                },
                transaction: t
            })

            //Hapus Data dari Waitlist
            if (dataWaitlist.length > 0) {
                
                await Waitlist.destroy({
                    where: {
                        request_id: enrollmentReqId,
                    },
                    transaction: t
                });
            }

            //Catat di Audit Log
            await Audit_Log.create({
                entity: "EnrollmentRequest",
                entity_id: enrollmentReqId,
                action: "cancelled",
                old_value: JSON.stringify(data.dataValues),
                new_value: JSON.stringify({ ...data.dataValues, status: "cancelled", allow_waitlist: false}),
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