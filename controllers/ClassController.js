const { Class, Waitlist, Student } = require("../models");
const { Op } = require("sequelize");

class ClassController {
    static async getAllClasses(req, res) {
        const t = await Class.sequelize.transaction();
        try {
            console.log('get all classes');

            let { limit, offset } = req.query;

            let options = {
                transaction: t
            };

            // jika ada limit
            if (limit) {
                options.limit = parseInt(limit);
            }

            // jika ada offset
            if (offset) {
                options.offset = parseInt(offset);
            }

            const data = await Class.findAll(options);

            await t.commit();

            res.status(200).json({
                message: "Get all classes successfully",
                data: data
            });
        } catch (error) {
            await t.rollback();

            res.status(500).json({
                message: error.message
            });
        }
    }

    static async addClass(req, res) {
        const t = await Class.sequelize.transaction();
        try {
            console.log('add class');

            const data = await Class.create({
                subject_id: req.body.subject_id,
                teacher_id: req.body.teacher_id,
                max_capacity: req.body.max_capacity,
                schedule_day: req.body.schedule_day,
                schedule_start: req.body.schedule_start,
                schedule_end: req.body.schedule_end,
                room: req.body.room,
                status: req.body.status,
            }, { transaction: t });

            await t.commit();

            res.status(201).json({
                message: "Class added successfully",
                data: data
            });
        } catch (error) {
            await t.rollback();
            res.status(400).json({
                message: error.message
            });
        }
    }

    static async getClassById(req, res) {
        const t = await Class.sequelize.transaction();
        try {
            console.log('get class by id ', req.params.id);

            let classId = req.params.id;

            const data = await Class.findByPk(classId, {
                transaction: t
            });

            if (!data) {
                await t.rollback();
                return res.status(404).json({
                    message: "Class not found"
                });
            }

            await t.commit();

            res.status(200).json({
                message: `Get class ID ${classId} successfully`,
                data: data
            });
        } catch (error) {

            await t.rollback();

            res.status(500).json({
                message: error.message
            });
        }
    }

    static async getClassWaitlistById(req, res) {
        const t = await Waitlist.sequelize.transaction();
        try {
            console.log('get class waitlist by id ', req.params.id);

            let classId = req.params.id;
            let { limit, offset } = req.query;

            let options = {
                where: {
                    class_id: classId
                },
                include: [
                    {
                        model: Student,
                        as: "Student",
                    }
                ],
                transaction: t
            };

            // jika ada limit
            if (limit) {
                options.limit = parseInt(limit);
            }

            // jika ada offset
            if (offset) {
                options.offset = parseInt(offset);
            }

            const datasWaitlist = await Waitlist.findAll(options);


            if (datasWaitlist.length === 0) {
                await t.rollback();
                return res.status(404).json({
                    message: "Class Waitlist not found"
                });
            }

            await t.commit();

            //Sort data waitlist priority
            console.log("Data waitlist before sorting: ", datasWaitlist);

            // datasWaitlist.forEach(data => {
            //     let dataStudent = data.dataValues.Student;

            //     console.log("Data student: ", dataStudent.dataValues.priority_level);
            // });

            const priorityOrder = {
                special_program: 1,
                scholarship: 2,
                regular: 3
            };
            
            datasWaitlist.sort((a, b) => {
            
                let priorityA = priorityOrder[a.dataValues.Student.dataValues.priority_level];
                let priorityB = priorityOrder[b.dataValues.Student.dataValues.priority_level];
            
                return priorityA - priorityB;
            
            });

            datasWaitlist.forEach(data => {

                let dataStudent = data.dataValues.Student;
            
                console.log("Student name:", dataStudent.dataValues.name);
                console.log("Priority level:", dataStudent.dataValues.priority_level);
            
            });

            res.status(200).json({
                message: `Get class waitlist id ${classId} successfully`,
                data: datasWaitlist
            });
        } catch (error) {

            await t.rollback();

            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = ClassController;