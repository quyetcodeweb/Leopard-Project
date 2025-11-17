import { getDb } from "../config/db.js";

// === BCRYPT GIẢ ===
// Lưu mật khẩu dạng thô
const bcrypt = { 
    hash: async (password, salt) => password, 
    compare: async (password, hash) => password === hash 
};

// === JWT GIẢ ===
const jwt = { 
    sign: (payload, secret, options) => "mock-jwt-token-12345"
};

const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_SECRET";


// ===============================
// 📌 API ĐĂNG KÝ
// ===============================
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!strictEmailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Email không hợp lệ, vui lòng nhập example@gmail.com",
    });
  }

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false, 
      message: "Vui lòng điền đầy đủ thông tin."
    });
  }

  try {
    const db = getDb();

    const [existing] = await db.execute(
      "SELECT user_id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Tên đăng nhập hoặc email đã tồn tại."
      });
    }

    // ⭐ KHÔNG HASH → LƯU MẬT KHẨU THÔ
    const passwordHash = password;

    await db.execute(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [username, email, passwordHash, "customer"]
    );

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công! Vui lòng đăng nhập."
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ."
    });
  }
};


// ===============================
// 📌 API ĐĂNG NHẬP
// ===============================
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin."
    });
  }

  try {
    const db = getDb();

    const [users] = await db.execute(
      "SELECT user_id, username, password_hash, role FROM users WHERE username = ?",
      [username]
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng."
      });
    }

    // ⭐ bcrypt.compare GIẢ → so sánh trực tiếp
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng."
      });
    }

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
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ."
    });
  }
};
