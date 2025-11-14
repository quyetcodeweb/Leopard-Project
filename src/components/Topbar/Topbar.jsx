import React from "react";
import "./Topbar.css";
import { FaBell } from "react-icons/fa";

const Topbar = ({ title = "Sản phẩm" }) => {
  return (
    <header className="topbar">
      <div className="page-title">{title}</div>

      <div className="topbar-right">
        <FaBell className="bell" />
      </div>
    </header>
  );
};

export default Topbar;
