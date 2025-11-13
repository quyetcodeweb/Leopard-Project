import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoute.js"; // ⭐ Import Auth Router

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối database
connectDB();

// Routes 
app.get("/", (req, res) => {
  res.send("LeopardProject API đang hoạt động 🚀");
});

// ⭐ Thêm Auth Routes
app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));