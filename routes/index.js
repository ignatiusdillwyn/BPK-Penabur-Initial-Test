const router = require("express").Router();
const base = "api";

router.get(`/${base}`, (req, res) => {
  res.json({ message: "WEB API" });
});


const userRouters = require("./UserRoute");
const studentRouters = require("./StudentRoute");
const classRouters = require("./ClassRoute");
const enrrollmentRouters = require("./EnrollmentRoute");
const dashboardRouters = require("./DashboardRoute");

router.use(`/${base}/auth`, userRouters);
router.use(`/${base}`, studentRouters);
router.use(`/${base}`, classRouters);
router.use(`/${base}`, enrrollmentRouters);
router.use(`/${base}/dashboard`, dashboardRouters);

module.exports = router;




