import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Layout.css";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`layout ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={() => setDarkMode(prev => !prev)} />
      <Topbar darkMode={darkMode} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
