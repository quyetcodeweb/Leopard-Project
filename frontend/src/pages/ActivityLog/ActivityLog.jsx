import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import "./ActivityLog.css";
import axios from "axios";

const API_URL = "http://localhost:5000/api/audit-logs";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});

  // Filters
  const [username, setUsername] = useState("");
  const [action, setAction] = useState("all");
  const [entity, setEntity] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 8;

  // ======================
  // FETCH LOGS
  // ======================
const fetchLogs = useCallback(async () => {
  try {
    const res = await axios.get(API_URL, {
      params: {
        page,
        limit,
        username,
        action,
        entity,
        fromDate,
        toDate
      }
    });

    setLogs(res.data.data);
    setPagination(res.data.pagination);
  } catch (err) {
  console.error(err.response?.data || err.message);
}
}, [page, limit, username, action, entity, fromDate, toDate]);

useEffect(() => {
  fetchLogs();
}, [fetchLogs]);

  return (
    <div className="activity-page">
      {/* ===== FILTER ===== */}
      <div className="activity-toolbar">
        <input
          type="text"
          placeholder="🔍 Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="all">-- Hành động --</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>

        <select value={entity} onChange={(e) => setEntity(e.target.value)}>
          <option value="all">-- Đối tượng --</option>
          <option value="Product">Product</option>
          <option value="Order">Order</option>
          <option value="Voucher">Voucher</option>
          <option value="User">User</option>
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

      </div>

      {/* ===== AUTO CLEAN ===== */}
      <div className="auto-clean-box">
        <p className="hint">
            🔁 Hệ thống tự động xóa log cũ hơn <b>30 ngày</b> mỗi ngày lúc 02:00
        </p>
        </div>
      {/* ===== TABLE ===== */}
      <table className="activity-table">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>User</th>
            <th>Hành động</th>
            <th>Đối tượng</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr>
              <td colSpan="5">Không có dữ liệu</td>
            </tr>
          )}

          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.username}</td>
              <td>
                <span className={`badge ${log.action.toLowerCase()}`}>
                  {log.action}
                </span>
              </td>
              <td>{log.entity}</td>
              <td>
                {log.old_value || log.new_value ? "Thay đổi dữ liệu" : log.action}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== PAGINATION ===== */}
      <div className="pagination">
        {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
