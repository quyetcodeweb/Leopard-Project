import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Hàm tự động phân loại thông báo
function classifyNotification(title, content) {
  const successKeywords = [
    "thành công",
    "đã lưu",
    "tạo đơn hàng",
    "xác nhận thành công",
    "cập nhật thành công",
    "xóa",
    "hoàn thành",
    "giao",
    "created",
  ];
  const warningKeywords = [
    "cảnh báo",
    "không hợp lệ",
    "sắp hết",
    "hết hàng",
    "thiếu",
    "lỗi",
    "nhập đầy đủ",
    "không tìm thấy",
    "chọn",
    "hết hạn",
  ];

  const text = `${title} ${content}`.toLowerCase();

  if (successKeywords.some((kw) => text.includes(kw))) return "success";
  if (warningKeywords.some((kw) => text.includes(kw))) return "warning";
  return "info";
}


/** Tạo thông báo */
router.post("/", async (req, res) => {
  try {
    const { userId, type, title, content } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Nếu không có type, backend tự phân loại
    const finalType = type || classifyNotification(title, content);

    const sql = `
      INSERT INTO Notification (UserID, Type, Title, Content)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.promise().execute(sql, [
      userId,
      finalType,
      title,
      content,
    ]);

    res.json({
      message: "Đã lưu thông báo",
      NotificationID: result.insertId,
      Type: finalType,
    });
  } catch (error) {
    console.error("Lỗi tạo thông báo:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/** Lấy thông báo theo user, đã có Type */
router.get("/", async (req, res) => {
  try {
    let userId = req.query.userId;

    if (!userId) return res.status(400).json({ message: "Thiếu userId" });

    userId = parseInt(userId);
    if (isNaN(userId)) return res.status(400).json({ message: "userId không hợp lệ" });

    const [rows] = await pool.promise().query(
      `SELECT NotificationID, UserID, Type, Title, Content,
              CAST(IsRead AS UNSIGNED) AS IsRead,
              DATE_FORMAT(CreatedAt, '%Y-%m-%d %H:%i:%s') AS CreatedAt
       FROM Notification
       WHERE UserID = ?
       ORDER BY NotificationID DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy thông báo:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
