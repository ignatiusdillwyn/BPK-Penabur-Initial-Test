const { DashboardController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const dashboardRouter = require("express").Router();

dashboardRouter.get("/summary",
    authentication,
    DashboardController.getAllStudents
);

module.exports = dashboardRouter;