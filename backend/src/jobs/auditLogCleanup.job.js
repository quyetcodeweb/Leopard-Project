import cron from "node-cron";
import db from "../config/db.js";

const KEEP_DAYS = 90;

export const startAuditLogCleanupJob = () => {
  cron.schedule("0 2 * * *", () => {
    console.log("🧹 Auto cleanup audit logs...");

    const sql = `
      DELETE FROM audit_logs
      WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;

    db.query(sql, [KEEP_DAYS], (err, result) => {
      if (err) {
        console.error("❌ Auto cleanup failed:", err);
      } else {
        console.log(`✅ Deleted ${result.affectedRows} audit logs`);
      }
    });
  });
};
