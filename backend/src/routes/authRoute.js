import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const authRouter = express.Router();

// Đăng ký
authRouter.post("/register", registerUser);

// Đăng nhập
authRouter.post("/login", loginUser);

// Đăng xuất
authRouter.post("/logout", (req, res) => {
    res.clearCookie("token"); // nếu bạn lưu token dạng cookie
    return res.json({ message: "Đăng xuất thành công" });
});

export default authRouter;
