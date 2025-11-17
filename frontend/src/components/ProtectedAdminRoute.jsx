import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedDashboardRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  // Cho phép admin, manager, staff truy cập Dashboard
  const allowedRoles = ["admin", "manager", "staff"];

  if (!allowedRoles.includes(user.role)) {
    return (
      <h1 style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        Bạn không có quyền truy cập trang này.
      </h1>
    );
  }

  return children;
};

export default ProtectedDashboardRoute;
