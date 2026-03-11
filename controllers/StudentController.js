const { Student } = require("../models");
const { Op } = require("sequelize");

class StudentController {
    static async getAllStudents(req, res) {
        try {
            console.log('get all students')
            // let userId = req.userData.id;
            // const data = await Product.findAll({
            //     where: { UserId: userId }
            // });
            // res.status(201).json({
            //     message: "Product created successfully",
            //     data: data
            // });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async addStudent(req, res) {
        try {
            console.log('add student ')
            // let userId = req.userData.id;

            const data = await Student.create({
                student_number: req.body.student_number,
                name: req.body.name,
                grade_level: req.body.grade_level,
                priority_level: req.body.priority_level,
                status: req.body.status,
            });
            
            res.status(201).json({
                message: "Student added successfully",
                data: data
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getStudentById(req, res) {
        try {
            console.log('get student by id ')
            // let userId = req.userData.id;
            // const data = await Employee.findByPk(req.params.id);
            // if (!data) return res.status(404).json({ message: "Employee not found" });
            // res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = StudentController;