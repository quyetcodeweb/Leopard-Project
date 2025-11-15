import { getDb } from "../config/db.js";

// GIẢ LẬP BCRYPT (VÌ MÔI TRƯỜNG NÀY KHÔNG CÀI)
const bcrypt = { 
    hash: async (password, salt) => password, 
    compare: async (password, hash) => password === hash
};

// GIẢ LẬP JWT
const jwt = { 
    sign: (payload, secret, options) => "mock-jwt-token-12345"
};

const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_SECRET";


// --- XỬ LÝ ĐĂNG KÝ ---
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // CHỈ CHO PHÉP EMAIL DẠNG example@gmail.com
  const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!strictEmailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message:
        "Email không hợp lệ, vui lòng nhập lại theo định dạng example@gmail.com",
    });
  }

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    const db = getDb();
    if (!db)
      return res
        .status(500)
        .json({ success: false, message: "Lỗi kết nối CSDL." });

    // 1. Kiểm tra email hoặc username tồn tại
    const [existingUsers] = await db.execute(
      "SELECT user_id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Tên đăng nhập hoặc email đã được sử dụng.",
      });
    }

    // 2. Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Lưu vào DB
    await db.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng đăng nhập.",
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ khi đăng ký." });
  }
};


// --- XỬ LÝ ĐĂNG NHẬP ---
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin." });
  }

  try {
    const db = getDb();
    if (!db)
      return res
        .status(500)
        .json({ success: false, message: "Lỗi kết nối CSDL." });

    const [users] = await db.execute(
      "SELECT user_id, username, password_hash, role FROM users WHERE username = ?",
      [username]
    );

    const user = users[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
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
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ khi đăng nhập." });
  }
};
