const { Audit_Log } = require("../models");
const { Op } = require("sequelize");

class DashboardController {
    static async getAllAuditLog(req, res) {
        const t = await Audit_Log.sequelize.transaction();
        try {
            let { limit, offset } = req.query;

            let options = {
                transaction: t
            };

            // jika ada limit
            if (limit) {
                options.limit = parseInt(limit);
            }

            // jika ada offset
            if (offset) {
                options.offset = parseInt(offset);
            }

            const dataAuditLog = await Audit_Log.findAll(options);

            await t.commit();

            res.status(200).json({
                message: "Get all audit logs successfully",
                data: dataAuditLog
            });
        } catch (error) {
            await t.rollback();

            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = DashboardController;