import mysql from "mysql2";

export const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error("❌ Lỗi kết nối MySQL:", err);
    } else {
      console.log("✅ Kết nối MySQL thành công!");
    }
  });

  return connection;
};
