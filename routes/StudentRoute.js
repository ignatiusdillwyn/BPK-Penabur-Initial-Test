const { StudentController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const productRouter = require("express").Router();

productRouter.get("/students",
    authentication,
    StudentController.getAllStudents
);
productRouter.post(
    "/students",
    authentication,
    StudentController.addStudent
);
productRouter.get(
    "/students/:id",
    authentication,
    StudentController.getStudentById
);

module.exports = productRouter;