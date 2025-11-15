import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Layout.css";

const Layout = ({ children, title = "Dashboard" }) => {
  return (
    <div className="layout">
  <Sidebar />
    <div className="layout-content">
      {children}
    </div>
</div>
  );
};

export default Layout;
