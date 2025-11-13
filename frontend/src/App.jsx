// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các component
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import ProductList from './pages/Products/ProductList';
import HomePage from './pages/HomePage'; // ⭐ THÊM DÒNG NÀY

const App = () => {
  // Tạm thời tắt isAuthenticated để test login
  const isAuthenticated = true; // Đặt true tạm để test chuyển hướng

  return (
    <Router>
      <Routes>
        {/* Trang đăng ký */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Trang chủ */}
        <Route path="/HomePage" element={<HomePage />} /> {/* ⭐ THÊM DÒNG NÀY */}

        {/* Trang mặc định */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Nếu chưa đăng nhập mà cố truy cập, đẩy về /login */}
        {!isAuthenticated && (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
