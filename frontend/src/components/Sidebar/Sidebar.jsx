import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import {
  FaUsers,
  FaTags,
  FaClipboardList,
  FaBox,
  FaWarehouse,
  FaChartBar,
  FaUserCog,
  FaHistory,
} from "react-icons/fa";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleOrderMenu = () => {
    setOpenOrder(!openOrder);
  };

  //điều hướng đơn hàng
  const goToOrderStatus = (status) => {
    navigate(`/donhang?status=${status}`);
  };

  return (
    <aside className={`sidebar ${darkMode ? "dark" : ""}`}>
      <div className="logo">🛒 SMS</div>

      {/* ==== USER INFO ==== */}
      <div className="user-block">
        <img
          src="https://via.placeholder.com/60"
          alt="avatar"
          className="sidebar-avatar"
        />
        <div className="user-info">
          <div className="user-name">Umi</div>
          <div className="user-role">Admin</div>
        </div>
      </div>

      {/* ==== MENU CHUNG ==== */}
      <div className="sidebar-section">
        <h4>Chung</h4>
        <ul>
          <li>
            <FaChartBar /> <span>Tổng quan</span>
          </li>
          <li>
            <FaUsers /> <span>Khách hàng</span>
          </li>
          <li>
            <FaTags /> <span>Mã giảm giá</span>
          </li>

          {/* === ĐƠN HÀNG === */}
          <li
            className="dropdown-btn"
            onClick={() => {
              setOpenOrder(!openOrder);  // toggle dropdown
              navigate("/donhang");       // điều hướng sang trang đơn hàng
            }}
          >
            <FaClipboardList /> <span>Đơn hàng</span>
          </li>
          <div className={`dropdown-list ${openOrder ? "show" : ""}`}>
            <li style={{ cursor: "pointer" }} onClick={() => goToOrderStatus("daxuly")}>
              Đã tiếp nhận
            </li>
            <li style={{ cursor: "pointer" }} onClick={() => goToOrderStatus("dangxuly")}>
              Đang xử lý
            </li>
            <li style={{ cursor: "pointer" }} onClick={() => goToOrderStatus("danggiao")}>
              Đã giao
            </li>
            <li style={{ cursor: "pointer" }} onClick={() => goToOrderStatus("dahuy")}>
              Đã hủy
            </li>
          </div>
          <li className="active">
            <FaBox /> <span>Sản phẩm</span>
          </li>
          <li>
            <FaWarehouse /> <span>Kho hàng</span>
          </li>
          <li>
            <FaChartBar /> <span>Thống kê</span>
          </li>
        </ul>
      </div>

      {/* ==== MENU ADMIN ==== */}
      <div className="sidebar-section">
        <h4>Admin</h4>
        <ul>
          <li>
            <FaUserCog /> <span>Người dùng</span>
          </li>
          <li>
            <FaHistory /> <span>Lịch sử thao tác</span>
          </li>
          <li
            onClick={() => navigate("/lichsudonhang")}
            style={{ cursor: "pointer" }}
          >
            <FaHistory /> <span>Lịch sử đơn hàng</span>
          </li>
        </ul>
      </div>

      {/* ==== DARK MODE TOGGLE ==== */}
      <div className="darkmode">
        <label>Chế độ tối</label>
        <div
          className={`toggle-switch ${darkMode ? "active" : ""}`}
          onClick={toggleDarkMode}
        >
          <div className="switch-circle"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;