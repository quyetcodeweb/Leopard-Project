import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleOrderMenu = () => {
    setOpenOrder(!openOrder);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, avatar: reader.result };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className={`sidebar ${darkMode ? "dark" : ""}`}>
      {/* LOGO */}
      <div className="logo-area">
        <img src="/images/logoleo.png" alt="SMS Logo" className="logo-img" />
      </div>

      {/* USER INFO */}
      {user && (
        <div className="user-block">
          <label className="avatar-wrapper">
            <img
              src={user.avatar || "/images/mi_goi.png"}
              alt="avatar"
              className="sidebar-avatar"
            />
            <input type="file" hidden accept="image/*" onChange={handleChangeAvatar} />
          </label>

          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
      )}

      {/* MENU */}
      <div className="sidebar-section">
        <h4>Chung</h4>
        <ul>
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
            <a href="#" onClick={(e) => { e.preventDefault(); toggleOrderMenu(); }}>
              <FaClipboardList /> <span>Đơn hàng</span>
            </a>
          </li>

          <div className={`dropdown-list ${openOrder ? "show" : ""}`}>
            <li><NavLink to="/orders/received">Đã tiếp nhận</NavLink></li>
            <li><NavLink to="/orders/processing">Đang xử lý</NavLink></li>
            <li><NavLink to="/orders/delivered">Đã giao</NavLink></li>
            <li><NavLink to="/orders/cancelled">Đã hủy</NavLink></li>
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
        </ul>
      </div>

      {/* ADMIN */}
      {user?.role === "admin" && (
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
            </li>
          </ul>
        </div>
      )}

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="darkmode">
          <label>Chế độ tối</label>
          <div
            className={`toggle-switch ${darkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
          >
            <div className="switch-circle"></div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
