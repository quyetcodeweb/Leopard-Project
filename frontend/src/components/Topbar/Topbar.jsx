import React from "react";
import "./Topbar.css";
import { FaBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Topbar = ({ darkMode = false }) => {
  const location = useLocation();

  const routeTitles = {
    "/": "Trang chủ",
    "/dashboard": "Dashboard",
    "/products": "Sản phẩm",
    "/products/add": "Thêm sản phẩm",
    "/HistoryOrder": "Lịch sử đơn hàng",
    "/categories": "Danh mục",
    "/user": "Quản lý người dùng",
    "/orders/cancelled": "Đơn hàng",
    "/orders/processing": "Đơn hàng",
    "/orders/received": "Đơn hàng",
    "/orders/delivered": "Đơn hàng",
    "/warehouse": "Kho hàng",
  };

  const title = routeTitles[location.pathname] || "Trang";

  return (
    <header className={`topbar ${darkMode ? "dark" : ""}`}>
      <div className="page-title">{title}</div>

      <div className="topbar-right">
        <FaBell className="bell" />
      </div>
    </header>
  );
};

export default Topbar;
