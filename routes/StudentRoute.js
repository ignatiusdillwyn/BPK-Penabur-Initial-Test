const { StudentController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const studentRouter = require("express").Router();

studentRouter.get("/students",
    authentication,
    StudentController.getAllStudents
);
studentRouter.post(
    "/students",
    authentication,
    StudentController.addStudent
);
studentRouter.get(
    "/students/:id",
    authentication,
    StudentController.getStudentById
);

studentRouter.get(
    "/students/:id/enrollments",
    authentication,
    StudentController.getAllStudentEnrollments
);

module.exports = studentRouter;