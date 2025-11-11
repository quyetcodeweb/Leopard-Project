import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Layout.css";

const Layout = ({ children, title = "Dashboard" }) => {
  return (
    <div className="layout">
      <Sidebar />
      <Topbar title={title} />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
