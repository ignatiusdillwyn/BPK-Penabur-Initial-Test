const { UserController } = require("../controllers");
const userRouter = require("express").Router();

// // CRUD Basic
// userRouter.get("/", UserController.getUsers);
// userRouter.post("/register", UserController.register);
// userRouter.delete("/delete/:id", UserController.delete);
// userRouter.put("/edit/:id", UserController.edit);

// // More Routes
// userRouter.get("/search", UserController.search);
// userRouter.get("/details/:id", UserController.getUserById);

// Login (Authentication) dan Register
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
userRouter.post("/login", UserController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ignatius@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
userRouter.post("/register", UserController.add);
module.exports = userRouter;
