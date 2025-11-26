import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1635",
  database: "SalesManagementDB"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});

export default db;
