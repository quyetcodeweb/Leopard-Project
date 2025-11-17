<<<<<<< HEAD
import mysql from "mysql2/promise"; 

let db; 

export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost', 
      user: 'root', // ⭐ GÁN CỨNG: Bắt buộc phải là 'root'
      password: 'quocthang__2004', // ⭐ GÁN CỨNG: Bắt buộc phải là mật khẩu của bạn
      database: 'salesmanagementdb',
    });

    db = connection;
    console.log("✅ Kết nối MySQL thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  }
};

export const getDb = () => db;
=======
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});

export default db;
>>>>>>> origin/main
