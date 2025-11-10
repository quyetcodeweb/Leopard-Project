# 🐆 Leopard Project

Dự án **Leopard Project** là một ứng dụng web fullstack phục vụ hệ thống bán hàng.  
Hệ thống gồm:

- **Backend**: Node.js + Express + MySQL
- **Frontend**: React (hoặc Vite / Next.js)

---

## 🚀 1. Công nghệ sử dụng

### 🧩 Backend

- Node.js
- ExpressJS
- MySQL
- Sequelize ORM (hoặc MySQL2)
- JWT Authentication
- Dotenv (quản lý biến môi trường)
- Cors

### 💻 Frontend

- React
- React Router
- Axios
- TailwindCSS / Bootstrap (tùy chọn)

---

## ⚙️ 2. Cấu trúc thư mục

```text
LeopardProject/
│
├── backend/      → Server API
│   ├── src/
│   │   ├── config/       # Cấu hình database, dotenv,...
│   │   ├── controllers/  # Xử lý logic
│   │   ├── models/       # Định nghĩa bảng dữ liệu
│   │   ├── routes/       # API endpoint
│   │   └── app.js        # File khởi động server
│   └── package.json
│
└── frontend/     → Giao diện web
    ├── src/
    │   ├── assets/       # Hình ảnh, icon,...
    │   ├── components/   # Component tái sử dụng
    │   ├── pages/        # Trang chính
    │   ├── layouts/      # Header, Footer, Sidebar
    │   ├── routes/       # Cấu hình Router
    │   ├── services/     # API call
    │   ├── utils/        # Hàm tiện ích
    │   ├── context/      # State management
    │   └── App.jsx       # App chính
    └── package.json

```

## 🧑‍💻 3. Hướng dẫn cài đặt

### Bước 1️⃣: Clone project

git clone https://github.com/<your-username>/Leopard-Project.git
cd LeopardProject

### Bước 2️⃣: Cài đặt backend

cd backend
npm install

### Tạo file .env dựa trên .env.example:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=leoparddb
JWT_SECRET=your_secret_key

### Chạy server backend:

npm run dev

### Mặc định server chạy tại: http://localhost:5000

## Bước 3️⃣: Cài đặt frontend

cd ../frontend
npm install
npm start

Mặc định frontend chạy tại: http://localhost:3000

# 📡 4. Git và làm việc nhóm

🔹 Trước khi tạo nhánh mới
git checkout main
git pull origin main

🔹 Tạo nhánh
git checkout -b feature/<Tên nhánh>

🔹 Push code
git add .
git commit -m "Mô tả tính năng"
git push origin feature/<Tên nhánh>

🔹 Lưu ý

Không commit node_modules/ hoặc file .env

Luôn pull trước khi code để cập nhật mới nhất

Ghi commit message rõ ràng

Review code trước khi merge
