import db from "../config/db.js";
import bcrypt from "bcrypt";
import { createAuditLog } from "../services/auditLog.service.js";

// 📋 Lấy danh sách user (KHÔNG LOG)
export const getAllUsers = (req, res) => {
  db.query(
    "SELECT user_id, username, email, role, created_at FROM users",
    (err, users) => {
      if (err)
        return res.status(500).json({ success: false, message: "Lỗi máy chủ." });

      res.json({ success: true, users });
    }
  );
};

// ➕ Tạo user mới (CÓ LOG)
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role)
    return res.status(400).json({ message: "Thiếu dữ liệu." });

  if (role === "admin")
    return res.status(403).json({ message: "Không thể tạo tài khoản admin!" });

  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    async (err, exists) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      if (exists.length > 0)
        return res
          .status(409)
          .json({ message: "Tên đăng nhập hoặc Email đã tồn tại!" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, role],
        (err2, result) => {
          if (err2)
            return res.status(500).json({ message: "Lỗi server" });

          // ✅ AUDIT LOG
          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "CREATE",
            entity: "user",
            entityId: result.insertId,
            oldValue: null,
            newValue: { username, email, role },
            req
          });

          res.status(201).json({ message: "Tạo tài khoản thành công!" });
        }
      );
    }
  );
};

// ✏️ Cập nhật role user (CÓ LOG)
export const updateUserRole = (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  // Lấy dữ liệu cũ
  db.query(
    "SELECT user_id, username, role FROM users WHERE user_id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      if (rows.length === 0)
        return res.status(404).json({ message: "User không tồn tại" });

      const oldUser = rows[0];

      db.query(
        "UPDATE users SET role = ? WHERE user_id = ?",
        [role, id],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ success: false, message: "Lỗi máy chủ." });

          // ✅ AUDIT LOG
          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "UPDATE",
            entity: "user_role",
            entityId: id,
            oldValue: { role: oldUser.role },
            newValue: { role },
            req
          });

          res.json({
            success: true,
            message: "Cập nhật vai trò thành công.",
          });
        }
      );
    }
  );
};

// 🗑️ Xóa user (CÓ LOG)
export const deleteUser = (req, res) => {
  const { id } = req.params;

  // Lấy user cũ để log
  db.query(
    "SELECT user_id, username, email, role FROM users WHERE user_id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      if (rows.length === 0)
        return res.status(404).json({ message: "User không tồn tại" });

      const oldUser = rows[0];

      db.query(
        "DELETE FROM users WHERE user_id = ?",
        [id],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ success: false, message: "Lỗi máy chủ." });

          // ✅ AUDIT LOG
          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "DELETE",
            entity: "user",
            entityId: id,
            oldValue: oldUser,
            newValue: null,
            req
          });

          res.json({ success: true, message: "Xóa user thành công." });
        }
      );
    }
  );
};
