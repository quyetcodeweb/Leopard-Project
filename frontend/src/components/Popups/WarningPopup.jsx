import React from "react";
import "./WarningPopup.css";

const WarningPopup = ({ warnings, onClose, onMarkSeen }) => {
  return (
    <div className="warning-popup-overlay">
      <div className="warning-popup">
        <h2>⚠ Cảnh báo tồn kho</h2>

        <ul>
          {warnings.map((w, index) => (
            <li key={index}>
              <strong>{w.name}</strong> - Còn lại: {w.stock}
            </li>
          ))}
        </ul>

        <div className="popup-actions">
          <button className="btn-closee" onClick={onClose}>Đóng</button>
          <button className="btn-seen" onClick={onMarkSeen}>Đã xem</button>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
