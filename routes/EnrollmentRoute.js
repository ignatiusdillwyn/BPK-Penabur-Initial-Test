const { EnrollmentController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const enrollmentRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment management API
 */

/**
 * @swagger
 * /api/enrollment-requests:
 *   post:
 *     summary: Create enrollment request
 *     tags: [Enrollments]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: header
 *         name: idempotency-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique key to prevent duplicate enrollment requests
 *         example: 8f3a2d0b-4f21-4c1a-bb7d-1d4a92cbb123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_code:
 *                 type: string
 *                 example: "REQ-001"
 *               student_id:
 *                 type: integer
 *                 example: 1
 *               class_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Enrollment request created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
enrollmentRouter.post(
    "/enrollment-requests",
    authentication,
    EnrollmentController.addEnrollmentRequest
);

/**
 * @swagger
 * /api/enrollments/{id}/cancel:
 *   post:
 *     summary: Cancel enrollment
 *     tags: [Enrollments]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment cancelled successfully
 *       404:
 *         description: Enrollment not found
 *       401:
 *         description: Unauthorized
 */
enrollmentRouter.post(
    "/enrollments/:id/cancel",
    authentication,
    EnrollmentController.cancelEnrollment
);

module.exports = enrollmentRouter;