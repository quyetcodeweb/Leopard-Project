import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // lấy role

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin")
    return <h1 style={{ color: "red", textAlign: "center" }}>Bạn không có quyền truy cập</h1>;

  return children;
};

export default ProtectedAdminRoute;
