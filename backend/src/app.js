import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối database
connectDB();

// Routes (tạm thời)
app.get("/", (req, res) => {
  res.send("LeopardProject API đang hoạt động 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
