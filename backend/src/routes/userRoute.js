import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUser
} from "../controllers/userController.js";

const router = express.Router();

// Lấy danh sách user
router.get("/", getAllUsers);

// Tạo user mới (chuẩn REST)
router.post("/", createUser);

// Nếu muốn giữ /create
router.post("/create", createUser);

// Cập nhật role
router.put("/:id/role", updateUserRole);

// Xóa user
router.delete("/:id", deleteUser);


export default router;
