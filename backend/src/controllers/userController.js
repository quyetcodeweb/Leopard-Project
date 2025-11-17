import { getDb } from "../config/db.js";
import bcrypt from "bcrypt";

// Lấy danh sách user
export const getAllUsers = async (req, res) => {
  try {
    const db = getDb();
    const [users] = await db.execute(
      "SELECT user_id, username, email, role, created_at FROM users"
    );
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
};

// Tạo user mới
export const createUser = async (req, res) => {
  try {
    const db = getDb();
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Thiếu dữ liệu." });
    }

    // Cấm tạo admin
    if (role === "admin") {
      return res.status(403).json({ message: "Không thể tạo tài khoản admin!" });
    }

    // Kiểm tra trùng username hoặc email
    const [exists] = await db.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "Tên đăng nhập hoặc Email đã tồn tại!" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    await db.execute(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: "Tạo tài khoản thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Cập nhật role
export const updateUserRole = async (req, res) => {
  try {
    const db = getDb();
    const { role } = req.body;
    const { id } = req.params;

    await db.execute("UPDATE users SET role = ? WHERE user_id = ?", [role, id]);

    res.json({ success: true, message: "Cập nhật vai trò thành công." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
};

// Xóa user
export const deleteUser = async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    await db.execute("DELETE FROM users WHERE user_id = ?", [id]);
    res.json({ success: true, message: "Xóa user thành công." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
};
