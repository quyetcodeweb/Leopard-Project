import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductPage from "./pages/Products/ProductPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route mặc định */}
        <Route path="/" element={<Navigate to="/products" />} />

        {/* Trang sản phẩm */}
        <Route path="/products" element={<ProductPage />} />
      </Routes>
    </Router>
  );
};

export default App;
