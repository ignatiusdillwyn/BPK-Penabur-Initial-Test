const { UserController } = require("../controllers");
const userRouter = require("express").Router();

// CRUD Basic
userRouter.get("/", UserController.getUsers);
userRouter.post("/create", UserController.add);
userRouter.delete("/delete/:id", UserController.delete);
userRouter.put("/edit/:id", UserController.edit);

// More Routes
userRouter.get("/search", UserController.search);
userRouter.get("/details/:id", UserController.getUserById);

// Login (Authentication) dan Register
userRouter.post("/login", UserController.login);
userRouter.post("/register", UserController.register);
module.exports = userRouter;
