import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import donhangRouters from "./routes/donhang.js";
import ordersRouters from "./routes/orders.js";
import sanphamRouters from "./routes/sanpham.js";
import deliverRouters from "./routes/deliver.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối database
connectDB();

// Routes
app.use("/api/donhang", donhangRouters);
app.use("/api/orders", ordersRouters); 
app.use("/api/sanpham", sanphamRouters);
app.use("/api/deliver", deliverRouters);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
