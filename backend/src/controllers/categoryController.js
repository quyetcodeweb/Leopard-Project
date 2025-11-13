import db from "../config/db.js";

// 📋 Lấy danh sách category
export const getCategories = (req, res) => {
  db.query("SELECT * FROM Category", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ➕ Thêm category mới
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
      res.json({ CategoryID: result.insertId, CategoryName });
    });
  });
};
