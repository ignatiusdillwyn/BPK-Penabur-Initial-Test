const { EnrollmentController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const enrollmentRouter = require("express").Router();

enrollmentRouter.post(
    "/enrollment-requests",
    authentication,
    EnrollmentController.addEnrollmentRequest
);
enrollmentRouter.post(
    "/enrollments/:id/cancel",
    authentication,
    EnrollmentController.cancelEnrollment
);

module.exports = enrollmentRouter;