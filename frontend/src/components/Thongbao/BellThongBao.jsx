import React, { useEffect } from "react";
import { useNotifications } from "./NotificationContext";

const BellThongBao = ({ isOpen, onClose }) => {
  const { notifications, fetchNotifications } = useNotifications();

  /** Khi mở popup → fetch dữ liệu */
  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50px",
        right: "10px",
        width: "340px",
        maxHeight: "420px",
        overflowY: "auto",
        backgroundColor: "#f7f7f7",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        borderRadius: "10px",
        zIndex: 1000,
        padding: "15px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: "1.1rem" }}>Thông báo</strong>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "4px",
          }}
        >
          ✕
        </button>
      </div>

      {notifications.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>Không có thông báo</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notifications.map((tb) => (
            <li
              key={tb.NotificationID}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "18px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor:
                    tb.Type === "success"
                      ? "#c4efcc"
                      : tb.Type === "warning"
                      ? "#ffe1c4"
                      : "#d8edff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                {tb.Type === "success"
                  ? "✔️"
                  : tb.Type === "warning"
                  ? "⚠️"
                  : "ℹ️"}
              </div>
              <div>
                <strong style={{ fontSize: "0.95rem" }}>{tb.Title}</strong>
                <p style={{ margin: "4px 0 0 0", color: "#444", fontSize: "0.88rem" }}>
                  {tb.Content}
                </p>
                <small style={{ color: "#888", fontSize: "0.75rem" }}>
                  {new Date(tb.CreatedAt).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BellThongBao;
