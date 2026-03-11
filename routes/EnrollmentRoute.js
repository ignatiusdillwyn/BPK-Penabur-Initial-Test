const { EnrollmentController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const enrollmentRouter = require("express").Router();

enrollmentRouter.post(
    "/enrollment-requests",
    authentication,
    EnrollmentController.addStudent
);
enrollmentRouter.post(
    "/enrollments/:id/cancel",
    authentication,
    EnrollmentController.getStudentById
);

module.exports = enrollmentRouter;