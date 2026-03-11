const router = require("express").Router();
const base = "api";

router.get(`/${base}`, (req, res) => {
  res.json({ message: "WEB API" });
});

const studentRouters = require("./StudentRoute");
const userRouters = require("./UserRoute");

router.use(`/${base}`, studentRouters);
router.use(`/${base}/auth`, userRouters);

module.exports = router;




