import db from "../config/db.js";
import bcrypt from "bcrypt";

// Lấy danh sách user
export const getAllUsers = (req, res) => {
  db.query(
    "SELECT user_id, username, email, role, created_at FROM users",
    (err, users) => {
      if (err) return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
      res.json({ success: true, users });
    }
  );
};

// Tạo user mới
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
      if (err) return res.status(500).json({ message: "Lỗi server", err });
      if (exists.length > 0)
        return res.status(409).json({ message: "Tên đăng nhập hoặc Email đã tồn tại!" });

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, role],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Lỗi server", err: err2 });
          res.status(201).json({ message: "Tạo tài khoản thành công!" });
        }
      );
    }
  );
};

// Cập nhật role
export const updateUserRole = (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE users SET role = ? WHERE user_id = ?",
    [role, id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
      res.json({ success: true, message: "Cập nhật vai trò thành công." });
    }
  );
};

// Xóa user
export const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE user_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    res.json({ success: true, message: "Xóa user thành công." });
  });
};
