import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// Chuyển đơn hàng từ 'Đang xử lý' sang 'Đã giao'
router.put("/:orderID/complete", (req, res) => {
  const { orderID } = req.params;

  const sqlUpdate = `
    UPDATE \`Order\` 
    SET Status='Đã giao' 
    WHERE OrderID=? AND Status='Đang xử lý'
  `;

  db.query(sqlUpdate, [orderID], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Đơn hàng không ở trạng thái 'Đang xử lý'" });
    }

    res.json({ message: "Đơn hàng đã giao" });
  });
});

export default router;
