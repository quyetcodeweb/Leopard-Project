// FILE: backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const jwt = require('jsonwebtoken'); 
const { sendMail } = require('../config/mailer'); // 💡 Import hàm gửi mail

const jwtSecret = 'YOUR_SUPER_SECRET_KEY'; 

// --- API 1: Gửi OTP (Bước 1: Nhận email) ---
router.post('/forgot-password/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await db.query('SELECT CustomerID, Email FROM Customer WHERE Email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });
        }
        
        const customerId = rows[0].CustomerID;
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        
        // Tạo Token
        const otpToken = jwt.sign(
            { customerId: customerId, otp: otpCode },
            jwtSecret,
            { expiresIn: '5m' } 
        );

        // ==========================================================
        // 📧 LOGIC GỬI EMAIL THẬT
        // ==========================================================
        const subject = 'Mã OTP Đặt Lại Mật Khẩu';
        const htmlContent = `
            <h2>Xin chào,</h2>
            <p>Mã xác minh (OTP) của bạn là: <strong>${otpCode}</strong></p>
            <p>Mã này sẽ hết hạn trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        `;
        
        // Gọi hàm gửi email
        await sendMail(email, subject, `Mã OTP của bạn là: ${otpCode}`, htmlContent);

        // Trả về thành công
        res.json({ 
            message: 'Mã OTP đã được gửi đến email.', 
            otpToken 
        });
        
    } catch (error) {
        console.error('LỖI GỬI EMAIL TẠI SEND-OTP:', error); 
        // Trả về lỗi 500 nếu quá trình gửi email thất bại
        res.status(500).json({ message: 'Lỗi máy chủ hoặc không thể gửi email OTP.' });
    }
});

// --- API 2: Xác minh OTP (Kiểm tra mã người dùng nhập có đúng không) ---
router.post('/forgot-password/verify-otp', (req, res) => {
    const { otpToken, otpCode } = req.body;

    if (!otpToken || !otpCode) {
        return res.status(400).json({ message: 'Thiếu thông tin OTP hoặc Token.' });
    }

    try {
        // 1. Giải mã otpToken để lấy CustomerID và OTP đã lưu
        const decoded = jwt.verify(otpToken, jwtSecret);
        
        // 2. So sánh OTP người dùng nhập với OTP trong token
        if (otpCode !== decoded.otp) {
            return res.status(400).json({ message: 'Mã OTP không hợp lệ.' });
        }

        // 3. Nếu xác minh thành công (trong trường hợp bạn không đặt lại mật khẩu)
        // Bạn có thể trả về một thông báo thành công hoặc chuyển hướng người dùng.
        res.json({ 
            message: 'Xác minh OTP thành công. Bạn có thể tiến hành bước tiếp theo.',
            customerId: decoded.customerId // Trả về ID nếu cần cho hành động tiếp theo
        });

    } catch (error) {
        // Xử lý lỗi token hết hạn hoặc không hợp lệ (ví dụ: sau 5 phút)
        console.error('LỖI XÁC MINH OTP:', error);
        return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.' });
    }
});

module.exports = router;