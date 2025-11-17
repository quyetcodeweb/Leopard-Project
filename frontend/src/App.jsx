<<<<<<< HEAD
// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
=======
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AllRouters from "./routers/AllRouters";
>>>>>>> origin/main

import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import HomePage from "./pages/HomePage";

// ⭐ Admin components
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import UserManager from "./pages/Admin/UserManager";
import Dashboard from "./pages/Admin/Dashboard"; // Nếu chưa có tạo file rỗng tạm thời

const App = () => {
  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User homepage */}
        <Route path="/homepage" element={<HomePage />} />

        {/* ⭐ ADMIN AREA */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <Routes>
                {/* Dashboard admin (trang mặc định sau login) */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Người dùng → Quản lý phân quyền */}
                <Route path="users" element={<UserManager />} />

                {/* Mặc định khi vào /admin → tự chuyển về dashboard */}
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedAdminRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
=======
    <Routes>
      <Route path="/" element={<Layout />}>
        {AllRouters}
      </Route>
    </Routes>
>>>>>>> origin/main
  );
};

export default App;
