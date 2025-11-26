import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js"; 
import productRoutes from "./routers/productRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import donhangRoutes from "./routes/donhang.js";
import deliverRoutes from "./routes/deliver.js";
import ordersRoutes from "./routes/orders.js";
import sanphamRoutes from "./routes/sanpham.js";
import authRouter from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import notificationRoutes from "./routes/notification.js";
import voucherRoutes from "./routes/voucherRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); 

app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/donhang", donhangRoutes);
app.use("/api/deliver", deliverRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/sanpham", sanphamRoutes);
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/vouchers", voucherRoutes);
app.get("/", (req, res) => {
  res.send("🚀 LeopardProject API đang hoạt động!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server chạy tại http://localhost:${PORT}`)
);
