const { StudentController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const studentRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management API
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of students
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *       401:
 *         description: Unauthorized
 */
studentRouter.get(
    "/students",
    authentication,
    StudentController.getAllStudents
);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_number:
 *                 type: string
 *                 example: "5"
 *               name:
 *                 type: string
 *                 example: "Puji"
 *               grade_level:
 *                 type: string
 *                 example: "3"
 *               priority_level:
 *                 type: string
 *                 example: "special_program"
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
studentRouter.post(
    "/students",
    authentication,
    StudentController.addStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *       404:
 *         description: Student not found
 *       401:
 *         description: Unauthorized
 */
studentRouter.get(
    "/students/:id",
    authentication,
    StudentController.getStudentById
);

/**
 * @swagger
 * /api/students/{id}/enrollments:
 *   get:
 *     summary: Get all enrollments of a student
 *     tags: [Students]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student enrollments retrieved successfully
 *       404:
 *         description: Student not found
 *       401:
 *         description: Unauthorized
 */
studentRouter.get(
    "/students/:id/enrollments",
    authentication,
    StudentController.getAllStudentEnrollments
);

module.exports = studentRouter;