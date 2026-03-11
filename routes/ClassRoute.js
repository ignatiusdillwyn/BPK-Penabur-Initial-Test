const { ClassController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const ClassRouter = require("express").Router();

ClassRouter.get("/classes",
    authentication,
    ClassController.getAllClasses
);
ClassRouter.post(
    "/classes",
    authentication,
    ClassController.addClass
);
ClassRouter.get(
    "/classes/:id",
    authentication,
    ClassController.getClassById
);
ClassRouter.get(
    "/classes/:id/waitlist",
    authentication,
    ClassController.getClassWaitlistById
);

module.exports = ClassRouter;