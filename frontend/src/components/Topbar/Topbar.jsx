import React, { useState } from "react";
import "./Topbar.css";
import { FaBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import BellThongBao from "../Thongbao/BellThongBao";

const Topbar = ({ darkMode = false }) => {
  const location = useLocation();
  const [showTB, setShowTB] = useState(false);
  const userId = localStorage.getItem("userId");

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
  };


  const title = routeTitles[location.pathname] || "Trang";

  return (
    <header className={`topbar ${darkMode ? "dark" : ""}`}>
      <div className="page-title">{title}</div>

      <div className="topbar-right">
        <FaBell
          className="bell"
          style={{ cursor: "pointer" }}
          onClick={() => setShowTB(!showTB)}
        />
      </div>

      {showTB && <BellThongBao userId={userId} onClose={() => setShowTB(false)} />}
    </header>
  );
};

export default Topbar;
