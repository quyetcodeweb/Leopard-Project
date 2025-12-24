import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";          
import nodemailer from "nodemailer";  
import bcrypt from "bcrypt";      

import "./config/db.js"; 
import productRoutes from "./routers/productRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import donhangRoutes from "./routes/donhang.js";
import deliverRoutes from "./routes/deliver.js";
import ordersRoutes from "./routes/orders.js";
import sanphamRoutes from "./routes/sanpham.js";
import authRouter from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); 

// --- Cấu hình DB và Mailer ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/donhang", donhangRoutes);
app.use("/api/deliver", deliverRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/sanpham", sanphamRoutes);
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);

// --- API Quên mật khẩu & OTP ---

// 1. API Gửi OTP
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi truy vấn!' });
        if (results.length === 0) return res.status(404).json({ message: 'Email không tồn tại!' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60000); // 5 phút

        db.query('INSERT INTO password_resets (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code=?, expires_at=?', 
        [email, otp, expiresAt, otp, expiresAt], (err) => {
            if (err) return res.status(500).json({ message: 'Lỗi lưu OTP vào DB' });

            transporter.sendMail({
                from: `"LeopardProject Support" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: '[SMS] Mã xác thực đổi mật khẩu',
                text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`
            }, (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Lỗi gửi mail' });
                }
                res.json({ message: 'Mã OTP đã được gửi đến email của bạn.' });
            });
        });
    });
});

// 2. API Xác thực OTP
app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otpCode } = req.body;
    db.query('SELECT * FROM password_resets WHERE email = ? AND otp_code = ? AND expires_at > NOW()', 
    [email, otpCode], (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi kiểm tra OTP' });
        if (results.length > 0) res.json({ message: 'Xác thực OTP thành công!' });
        else res.status(400).json({ message: 'Mã OTP không đúng hoặc đã hết hạn!' });
    });
});

// 3. API Đổi mật khẩu
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email], (err) => {
            if (err) return res.status(500).json({ message: 'Lỗi cập nhật mật khẩu' });
            
            // Xóa OTP ngay sau khi đổi thành công để bảo mật
            db.query('DELETE FROM password_resets WHERE email = ?', [email]);
            res.json({ message: 'Đổi mật khẩu thành công!' });
        });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
    }
});

app.get("/", (req, res) => {
  res.send("🚀 LeopardProject API đang hoạt động!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server chạy tại http://localhost:${PORT}`)
);