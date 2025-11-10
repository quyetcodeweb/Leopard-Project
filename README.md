# 🐆 Leopard Project

Dự án **Leopard Project** là một ứng dụng web fullstack được phát triển bởi nhóm sinh viên.  
Hệ thống gồm **Backend (Node.js + Express + MySQL)** và **Frontend (React)**, được chia rõ trong hai thư mục chính:

LeopardProject/
│
├── backend/ → Server API (Node.js + Express + MySQL)
└── frontend/ → Giao diện web (React / Vite / Next.js)

---

## 🚀 1. Công nghệ sử dụng

### 🧩 Backend

- Node.js
- ExpressJS
- MySQL
- Sequelize ORM (hoặc MySQL2)
- JWT Authentication
- Dotenv (quản lý biến môi trường)

### 💻 Frontend

- React (hoặc framework frontend khác)
- Axios (gọi API)
- React Router
- TailwindCSS / Bootstrap (tùy chọn)

---

## ⚙️ 2. Cấu trúc thư mục

backend/
├── src/
│ ├── config/ # Cấu hình database, dotenv,...
│ ├── controllers/ # Xử lý logic
│ ├── models/ # Định nghĩa bảng dữ liệu
│ ├── routes/ # Định nghĩa API endpoint
│ └── app.js # File khởi động server
└── package.json

frontend/
├── src/
│ ├── components/ # Giao diện, form, table
│ ├── pages/ # Các trang chính
│ ├── services/ # Gọi API đến backend
│ └── App.jsx # Điểm vào ứng dụng React
└── package.json

---

## 🧑‍💻 3. Hướng dẫn cài đặt

### Bước 1️⃣: Clone project

git clone https://github.com/<your-username>/Leopard-Project.git
cd Leopard-Project

### Bước 2️⃣: Cài đặt backend

cd backend
npm install

# Tạo file .env dựa trên .env.example:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=leoparddb
JWT_SECRET=your_secret_key

# Chạy server:

npm run dev

### Bước 3️⃣: Cài đặt frontend

cd ../frontend
npm install
npm start

## GIT

### Tạo nhánh

git checkout -b feature/<Tên nhánh>

### Push code

git add .
git commit -m "Thêm tính năng X"
git push origin feature/<Tên nhánh>

# Lưu ý:

Không commit node_modules/ hoặc file .env

Luôn chạy git pull trước khi code để cập nhật mới nhất

Ghi rõ commit message (ví dụ: feat: thêm api đăng nhập)

Review code trước khi merge
