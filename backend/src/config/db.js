import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SalesManagementDB"
});

export const connectDB = () => {
  db.connect(err => {
    if (err) console.error("❌ Lỗi kết nối MySQL:", err);
    else console.log("✅ Kết nối MySQL thành công!");
  });
};
