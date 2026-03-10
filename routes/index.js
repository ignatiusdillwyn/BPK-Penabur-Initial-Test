const router = require("express").Router();
const base = "api";

router.get(`/${base}`, (req, res) => {
  res.json({ message: "WEB API" });
});

const productRouters = require("./ProductRoute");
const userRouters = require("./UserRoute");

router.use(`/${base}/products`, productRouters);
router.use(`/${base}/auth`, userRouters);

module.exports = router;

# final-project-backend-coursenet
npx sequelize-cli model:generate --name Product --attributes name:string,description:string,qty:integer,price:integer,image:string,UserId:integer

Cara menjalankan project:
1. npm install
2. npx sequelize-cli db:migrate
3. npx nodemon app.js


