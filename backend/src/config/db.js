import mysql from "mysql2";
import dotenv from "dotenv";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "quocthang__2004",
  database: "SalesManagementDB",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});

export default db;
