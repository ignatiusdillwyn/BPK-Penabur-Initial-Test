const { Class } = require("../models");
const { Op } = require("sequelize");

class ClassController {
    static async getAllClasses(req, res) {
        const t = await Student.sequelize.transaction();
        try {
            console.log('get all students');

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

            const data = await Student.findAll(options);

            await t.commit();

            res.status(200).json({
                message: "Get all students successfully",
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
        const t = await Student.sequelize.transaction();
        try {
            console.log('add student');

            const data = await Student.create({
                student_number: req.body.student_number,
                name: req.body.name,
                grade_level: req.body.grade_level,
                priority_level: req.body.priority_level,
                status: req.body.status,
            }, { transaction: t });

            await t.commit();

            res.status(201).json({
                message: "Student added successfully",
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
        const t = await Student.sequelize.transaction();
        try {
            console.log('get student by id ', req.params.id);

            let studentId = req.params.id;

            const data = await Student.findByPk(studentId, {
                transaction: t
            });

            if (!data) {
                await t.rollback();
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            await t.commit();

            res.status(200).json({
                message: `Get student ID ${studentId} successfully`,
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

module.exports = ClassController;