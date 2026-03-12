const { ClassController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const ClassRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management API
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of classes
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *       401:
 *         description: Unauthorized
 */
ClassRouter.get(
    "/classes",
    authentication,
    ClassController.getAllClasses
);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_id:
 *                 type: integer
 *                 example: 1
 *               teacher_id:
 *                 type: integer
 *                 example: 1
 *               max_capacity:
 *                 type: integer
 *                 example: 30
 *               schedule_day:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-12"
 *               schedule_start:
 *                 type: string
 *                 format: time
 *                 example: "07:00:00"
 *               schedule_end:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               room:
 *                 type: string
 *                 example: "A101"
 *               status:
 *                 type: string
 *                 example: "open"
 *     responses:
 *       201:
 *         description: Class added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
ClassRouter.post(
    "/classes",
    authentication,
    ClassController.addClass
);

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class retrieved successfully
 *       404:
 *         description: Class not found
 *       401:
 *         description: Unauthorized
 */
ClassRouter.get(
    "/classes/:id",
    authentication,
    ClassController.getClassById
);

/**
 * @swagger
 * /api/classes/{id}/waitlist:
 *   get:
 *     summary: Get waitlist for a class
 *     tags: [Classes]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Waitlist retrieved successfully
 *       404:
 *         description: Waitlist not found
 *       401:
 *         description: Unauthorized
 */
ClassRouter.get(
    "/classes/:id/waitlist",
    authentication,
    ClassController.getClassWaitlistById
);

module.exports = ClassRouter;