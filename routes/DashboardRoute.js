const { DashboardController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const dashboardRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and audit logs
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get all audit logs
 *     description: Retrieve all audit logs for system activities
 *     tags: [Dashboard]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Limit number of audit logs returned
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer

 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Get all audit logs successfully
 *       401:
 *         description: Unauthorized
 */
dashboardRouter.get(
    "/summary",
    authentication,
    DashboardController.getAllAuditLog
);

module.exports = dashboardRouter;