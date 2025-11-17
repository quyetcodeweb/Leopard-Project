import React, { useState } from "react";
<<<<<<< HEAD
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
=======
import { NavLink } from "react-router-dom";
>>>>>>> origin/main
import "./Sidebar.css";
import { FiLogOut } from "react-icons/fi";
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

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [openOrder, setOpenOrder] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

<<<<<<< HEAD
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleOrderMenu = () => setOpenOrder(!openOrder);

  const isActive = (path) => location.pathname === path;

  // ========================== LOGOUT ==========================
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};
=======
  const toggleOrderMenu = () => {
    setOpenOrder(!openOrder);
  };
>>>>>>> origin/main

  return (
    <aside className={`sidebar ${darkMode ? "dark" : ""}`}>
      {/* LOGO */}
      <div className="logo-area">
        <img src="/images/logo_sms_blue.png" alt="SMS Logo" className="logo-img" />
      </div>

      {/* USER INFO */}
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

      {/* MENU */}
      <div className="sidebar-section">
        <h4>Chung</h4>
        <ul>
<<<<<<< HEAD
          <li className={isActive("/admin/dashboard") ? "active" : ""}>
            <Link to="/admin/dashboard"><FaChartBar /><span>Tổng quan</span></Link>
          </li>

          <li className={isActive("/admin/customers") ? "active" : ""}>
            <Link to="/admin/customers"><FaUsers /><span>Khách hàng</span></Link>
          </li>

          <li className={isActive("/admin/vouchers") ? "active" : ""}>
            <Link to="/admin/vouchers"><FaTags /><span>Mã giảm giá</span></Link>
          </li>

          <li className={`dropdown-btn ${openOrder ? "open" : ""}`} onClick={toggleOrderMenu}>
            <FaClipboardList /><span>Đơn hàng</span>
          </li>

          <div className={`dropdown-list ${openOrder ? "show" : ""}`}>
            <li><Link to="/admin/orders/received">Đã tiếp nhận</Link></li>
            <li><Link to="/admin/orders/processing">Đang xử lý</Link></li>
            <li><Link to="/admin/orders/delivered">Đã giao</Link></li>
            <li><Link to="/admin/orders/canceled">Đã hủy</Link></li>
          </div>

          <li className={isActive("/admin/products") ? "active" : ""}>
            <Link to="/admin/products"><FaBox /><span>Sản phẩm</span></Link>
          </li>

          <li className={isActive("/admin/warehouse") ? "active" : ""}>
            <Link to="/admin/warehouse"><FaWarehouse /><span>Kho hàng</span></Link>
          </li>

          <li className={isActive("/admin/statistics") ? "active" : ""}>
            <Link to="/admin/statistics"><FaChartBar /><span>Thống kê</span></Link>
=======
          <li>
            <NavLink to="/" end>
              <FaChartBar /> <span>Tổng quan</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/customers">
              <FaUsers /> <span>Khách hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/coupons">
              <FaTags /> <span>Mã giảm giá</span>
            </NavLink>
          </li>
          <li>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleOrderMenu();
              }}
            >
              <FaClipboardList /> <span>Đơn hàng</span>
            </a>
          </li>
          <div className={`dropdown-list ${openOrder ? "show" : ""}`}>
            <li>
              <NavLink to="/orders/received">Đã tiếp nhận</NavLink>
            </li>
            <li>
              <NavLink to="/orders/processing">Đang xử lý</NavLink>
            </li>
            <li>
              <NavLink to="/orders/delivered">Đã giao</NavLink>
            </li>
            <li>
              <NavLink to="/orders/cancelled">Đã hủy</NavLink>
            </li>
          </div>
          <li>
            <NavLink to="/products">
              <FaBox /> <span>Sản phẩm</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/warehouse">
              <FaWarehouse /> <span>Kho hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats">
              <FaChartBar /> <span>Thống kê</span>
            </NavLink>
>>>>>>> origin/main
          </li>
        </ul>
      </div>

<<<<<<< HEAD
      {/* ADMIN */}
      <div className="sidebar-section">
        <h4>Admin</h4>
        <ul>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users"><FaUserCog /><span>Người dùng</span></Link>
          </li>

          <li className={isActive("/admin/logs") ? "active" : ""}>
            <Link to="/admin/logs"><FaHistory /><span>Lịch sử thao tác</span></Link>
          </li>

          <li className={isActive("/admin/order-logs") ? "active" : ""}>
            <Link to="/admin/order-logs"><FaHistory /><span>Lịch sử đơn hàng</span></Link>
=======
      <div className="sidebar-section">
        <h4>Admin</h4>
        <ul>
          <li>
            <NavLink to="/user">
              <FaUserCog /> <span>Người dùng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/HistoryControl">
              <FaHistory /> <span>Lịch sử thao tác</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/HistoryOrder">
              <FaHistory /> <span>Lịch sử đơn hàng</span>
            </NavLink>
>>>>>>> origin/main
          </li>
        </ul>
      </div>

      {/* DARK MODE */}
      <div className="darkmode">
        <label>Chế độ tối</label>
        <div className={`toggle-switch ${darkMode ? "active" : ""}`} onClick={toggleDarkMode}>
          <div className="switch-circle"></div>
        </div>
      </div>

      {/* LOGOUT BUTTON - NEW DESIGN */}
      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut className="logout-icon" />
        Đăng xuất
      </button>
    </aside>
  );
};

export default Sidebar;