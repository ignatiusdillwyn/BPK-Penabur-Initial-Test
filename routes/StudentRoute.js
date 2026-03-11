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

module.exports = studentRouter;