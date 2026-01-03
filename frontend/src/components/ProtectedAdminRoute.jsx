import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = ({ allowedRoles = ["admin", "manager", "staff"] }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Nếu chưa đăng nhập -> về trang login
  if (!user) return <Navigate to="/login" replace />;

  // 2. Kiểm tra quyền (Chuyển về chữ thường để tránh lỗi so sánh)
  const userRole = user.role ? user.role.toLowerCase() : "";
  const roles = allowedRoles.map(r => r.toLowerCase());

  if (!roles.includes(userRole)) {
    return (
      <h1 style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        Bạn không có quyền truy cập trang này.
      </h1>
    );
  }

  // 3. Sử dụng Outlet để hiển thị các Route con trong AllRouters
  return <Outlet />;
};

export default ProtectedAdminRoute;