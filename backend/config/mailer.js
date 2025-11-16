// FILE: backend/config/mailer.js

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load biến môi trường từ .env

// Cấu hình Transporter (SMTP Server)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Nếu dùng Gmail
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email gửi
        pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng
    }
});

/**
 * Hàm gửi email
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} subject - Chủ đề email
 * @param {string} text - Nội dung email (dạng text)
 * @param {string} html - Nội dung email (dạng HTML)
 */
const sendMail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendMail
};