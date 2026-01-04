import db from "../config/db.js";
import { createAuditLog } from "../services/auditLog.service.js";

// 📋 Lấy danh sách category (KHÔNG log)
export const getCategories = (req, res) => {
  db.query("SELECT * FROM Category", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ➕ Thêm category mới (CÓ LOG)
export const addCategory = (req, res) => {
  const { CategoryName } = req.body;

  if (!CategoryName || CategoryName.trim() === "")
    return res.status(400).json({ error: "Tên danh mục không được để trống" });

  const sqlCheck = "SELECT * FROM Category WHERE CategoryName = ?";
  db.query(sqlCheck, [CategoryName], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0)
      return res.status(400).json({ error: "Danh mục đã tồn tại" });

    const sqlInsert = "INSERT INTO Category (CategoryName) VALUES (?)";
    db.query(sqlInsert, [CategoryName], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // ✅ GHI AUDIT LOG
      createAuditLog({
        userId: req.user?.id || null,          // lấy từ middleware JWT
        username: req.user?.username || null,
        role: req.user?.role || null,
        action: "CREATE",
        entity: "category",
        entityId: result.insertId,
        oldValue: null,
        newValue: { CategoryName },
        req
      });

      res.json({
        CategoryID: result.insertId,
        CategoryName
      });
    });
  });
};
