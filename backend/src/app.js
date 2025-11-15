import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// ⭐ Import Routers
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js"; // ⭐ Thêm dòng này

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

// ⭐ Auth Routes
app.use("/api/auth", authRouter);

// ⭐ User Routes (phân quyền, CRUD user)
app.use("/api/users", userRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
