import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./Layout.css";

const Layout = ({ title, children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`layout ${darkMode ? "dark" : ""}`}>
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Topbar title={title} darkMode={darkMode} />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
