import React from "react";
import { useNotifications } from "./NotificationContext";

const ToastNotificationManager = () => {
  const { toasts } = useNotifications();

  return (
    <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 3000 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background:
              t.type === "success"
                ? "#c4efcc"
                : t.type === "warning"
                ? "#ffe1c4"
                : "#d8edff",
            padding: "12px 16px",
            marginBottom: "8px",
            borderRadius: "6px",
            minWidth: "260px",
            fontFamily: "sans-serif",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <strong>{t.title}</strong>
          <div style={{ fontSize: "0.85rem" }}>{t.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotificationManager;
