import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Lấy userId từ localStorage hoặc từ login info
  const user = JSON.parse(localStorage.getItem("user")); 
  const userId = user?.id;

  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/notifications?userId=${userId}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Lỗi fetch notification:", err);
    }
  };

  // Thêm notification
 const addNotification = async ({ title, content, type }) => {
  if (!userId) return;

  // Toast tạm thời hiển thị trước
  const id = Date.now();
  setToasts((prev) => [...prev, { id, title, content, type: type || "info" }]);
  setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);

  try {
    // Gọi backend, backend sẽ tự classify nếu type không có
    const res = await axios.post("http://localhost:5000/api/notifications", {
      userId,
      title,
      content,
    });

    // Lấy type do backend gán
    const savedType = res.data.Type;

    // Cập nhật toast với type chính xác
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, type: savedType } : t))
    );

    fetchNotifications();
  } catch (err) {
    console.error("Lỗi lưu notification:", err);
  }
};

  useEffect(() => {
    const original = window.alert;
    window.alert = (msg) => addNotification({ title: msg, content: msg, type: "info" });
    return () => (window.alert = original);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, toasts, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

