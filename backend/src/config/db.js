import mysql from "mysql2/promise"; 

let db; 

export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost', 
      user: 'root', // ⭐ GÁN CỨNG: Bắt buộc phải là 'root'
      password: 'quocthang__2004', // ⭐ GÁN CỨNG: Bắt buộc phải là mật khẩu của bạn
      database: 'SalesManagementDB',
    });

    db = connection;
    console.log("✅ Kết nối MySQL thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  }
};

export const getDb = () => db;