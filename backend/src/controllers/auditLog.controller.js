import db from "../config/db.js";

/**
 * GET /api/audit-logs
 * Filter + Pagination
 */
export const getAuditLogs = (req, res) => {
  const {
    page = 1,
    limit = 10,
    action = "",
    entity = "",
    username = "",
    fromDate = "",
    toDate = ""
  } = req.query;

  const offset = (page - 1) * limit;

  let where = "WHERE 1=1";
  const params = [];

  if (action && action !== "all") {
    where += " AND action = ?";
    params.push(action);
  }

  if (entity && entity !== "all") {
    where += " AND entity = ?";
    params.push(entity);
  }

  if (username) {
    where += " AND username LIKE ?";
    params.push(`%${username}%`);
  }

  if (fromDate) {
    where += " AND created_at >= ?";
    params.push(fromDate + " 00:00:00");
  }

  if (toDate) {
    where += " AND created_at <= ?";
    params.push(toDate + " 23:59:59");
  }

  // 🔢 Đếm tổng
  const countSql = `SELECT COUNT(*) AS total FROM audit_logs ${where}`;

  db.query(countSql, params, (err, countRes) => {
    if (err) return res.status(500).json(err);

    const total = countRes[0].total;

    // 📄 Lấy dữ liệu
    const dataSql = `
      SELECT *
      FROM audit_logs
      ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(
      dataSql,
      [...params, Number(limit), Number(offset)],
      (err2, rows) => {
        if (err2) return res.status(500).json(err2);

        res.json({
          data: rows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      }
    );
  });
};

/**
 * POST /api/audit-logs/cleanup
 * Auto delete old logs
 */
export const cleanupAuditLogs = (req, res) => {
  const days = Number(req.body.days);

  if (!days) {
    return res.status(400).json({ message: "Days is required" });
  }

  db.query(
    `DELETE FROM audit_logs 
     WHERE created_at < NOW() - INTERVAL ? DAY`,
    [days],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        deletedRows: result.affectedRows
      });
    }
  );
};


