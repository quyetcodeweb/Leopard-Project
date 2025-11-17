
import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Dashboard</h2>
      </div>
    </div>
  );
};

export default Dashboard;
