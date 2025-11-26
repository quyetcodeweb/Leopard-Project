import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 1️⃣ Lấy danh sách tất cả sản phẩm
router.get("/", (req, res) => {
  const sql = `
    SELECT ProductID, ProductName, Price, Description, Image, CategoryID, Stock
    FROM Product
    WHERE IsActive = 1
    ORDER BY ProductName ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      return res.status(500).json({ message: "Lấy danh sách sản phẩm thất bại" });
    }
    res.json(results);
  });
});

// 2️⃣ Lấy chi tiết một sản phẩm (tùy chọn)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT ProductID, ProductName, Price, Description, Image, CategoryID, Stock
    FROM Product
    WHERE ProductID = ? AND IsActive = 1
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      return res.status(500).json({ message: "Lấy sản phẩm thất bại" });
    }
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(results[0]);
  });
});

export default router;
