import { getDb } from "../config/db.js";
// import bcrypt from "bcryptjs"; // Cần cài đặt: npm install bcryptjs
// import jwt from "jsonwebtoken"; // Cần cài đặt: npm install jsonwebtoken

// Thay thế thư viện bằng hàm giả lập để chạy trong môi trường này
const bcrypt = { 
    hash: async (password, salt) => password, 
    compare: async (password, hash) => password === hash
};
const jwt = { 
    sign: (payload, secret, options) => "mock-jwt-token-12345" 
};
const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_SECRET";
// END Mock libraries

// --- XỬ LÝ ĐĂNG KÝ ---
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, message: "Lỗi kết nối CSDL." });

    // 1. Kiểm tra username hoặc email đã tồn tại
    const [existingUsers] = await db.execute(
      "SELECT user_id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: "Tên đăng nhập hoặc email đã được sử dụng." });
    }

    // 2. Hash mật khẩu (Thực tế: dùng bcrypt.hash)
    const salt = await 10; // Giả lập salt
    const passwordHash = await bcrypt.hash(password, salt); // Giả lập hash

    // 3. Chèn người dùng mới vào DB
    await db.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    res.status(201).json({ success: true, message: "Đăng ký thành công! Vui lòng đăng nhập." });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi đăng ký." });
  }
};


// --- XỬ LÝ ĐĂNG NHẬP ---
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin đăng nhập." });
  }

  try {
    const db = getDb();
    if (!db) return res.status(500).json({ success: false, message: "Lỗi kết nối CSDL." });
    
    // 1. Tìm người dùng theo username
    const [users] = await db.execute(
      "SELECT user_id, username, email, password_hash, role FROM users WHERE username = ?",
      [username]
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." });
    }

    // 2. So sánh mật khẩu (Thực tế: dùng bcrypt.compare)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." });
    }

    // 3. Tạo Token
    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4. Trả về token và thông tin cơ bản
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role, 
      },
    });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi đăng nhập." });
  }
};