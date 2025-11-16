// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Cho phép mọi nguồn gốc để loại bỏ lỗi CORS khi debug
app.use(express.json()); // Đọc dữ liệu JSON gửi từ Frontend

// 1. Kết nối DB
require('./config/db'); 

// 2. Tích hợp Route Auth
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // Base URL: /api/auth

// Route kiểm tra server
app.get('/', (req, res) => {
    res.send('Server Backend đang chạy trên port ' + PORT);
});

app.listen(PORT, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${PORT}`);
});
