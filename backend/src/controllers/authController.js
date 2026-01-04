import db from "../config/db.js";
import { createAuditLog } from "../services/auditLog.service.js";

// === BCRYPT GIẢ ===
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
export const registerUser = (req, res) => {
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

  const passwordHash = password;

  db.query(
    "SELECT user_id FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Tên đăng nhập hoặc email đã tồn tại."
        });
      }

      db.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [username, email, passwordHash, "customer"],
        (err2, result) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
          }

          // ✅ GHI LOG ĐĂNG KÝ
          createAuditLog({
            userId: result.insertId,
            username,
            role: "customer",
            action: "REGISTER",
            entity: "user",
            entityId: result.insertId,
            oldValue: null,
            newValue: { username, email, role: "customer" },
            req
          });

          return res.status(201).json({
            success: true,
            message: "Đăng ký thành công! Vui lòng đăng nhập."
          });
        }
      );
    }
  );
};


// ===============================
// 📌 API ĐĂNG NHẬP
// ===============================
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin."
    });
  }

  db.query(
    "SELECT user_id, username, password_hash, role FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
      }

      const user = results[0];

      // ❌ LOGIN FAIL (không tồn tại user)
      if (!user) {
        createAuditLog({
          userId: null,
          username,
          role: null,
          action: "LOGIN_FAIL",
          entity: "auth",
          entityId: null,
          oldValue: null,
          newValue: { username },
          req
        });

        return res.status(401).json({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng."
        });
      }

      const isMatch = bcrypt.compare(password, user.password_hash);

      // ❌ LOGIN FAIL (sai mật khẩu)
      if (!isMatch) {
        createAuditLog({
          userId: user.user_id,
          username: user.username,
          role: user.role,
          action: "LOGIN_FAIL",
          entity: "auth",
          entityId: user.user_id,
          oldValue: null,
          newValue: null,
          req
        });

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

      // ✅ LOGIN SUCCESS
      createAuditLog({
        userId: user.user_id,
        username: user.username,
        role: user.role,
        action: "LOGIN",
        entity: "auth",
        entityId: user.user_id,
        oldValue: null,
        newValue: null,
        req
      });

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role,
        },
      });
    }
  );
};
