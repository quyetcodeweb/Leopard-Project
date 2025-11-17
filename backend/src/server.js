import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js"; 
import productRoutes from "./routers/productRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // thêm limit để tránh lỗi ảnh base64

app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);

app.get("/", (req, res) => {
  res.send("🚀 LeopardProject API đang hoạt động!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server chạy tại http://localhost:${PORT}`)
);
