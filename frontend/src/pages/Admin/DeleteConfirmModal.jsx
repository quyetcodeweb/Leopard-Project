import React from "react";
import "./AddVoucherModal.css"; // reuse modal styles

const DeleteConfirmModal = ({ voucher, onCancel, onConfirm }) => {
  if (!voucher) return null;

  const start = voucher.StartDate ? voucher.StartDate.slice(0,10) : "-";
  const end = voucher.ExpirationDate ? voucher.ExpirationDate.slice(0,10) : "-";
  const valueText = voucher.DiscountPercent > 0 ? `${voucher.DiscountPercent}%` : `${voucher.Value ?? "-"} VND`;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ width: 560 }}>
        <div className="modal-header">
          <span className="title">XÓA MÃ GIẢM GIÁ</span>
          <span className="close-btn" onClick={onCancel}>X</span>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <strong>Bạn có chắc chắn muốn xóa?</strong>
          </div>

          <div style={{ padding: "0 10px 10px 10px" }}>
            <p>Mã: <strong>{voucher.Code}</strong></p>
            <p>Loại: <strong>{valueText}</strong></p>
            <p>Thời gian: <strong>{start} - {end}</strong></p>
            <p style={{ color: "#E5484D" }}>Hành động này không thể hoàn tác!</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
            <button className="cancel" onClick={onCancel}>Hủy</button>
            <button className="save" onClick={onConfirm} style={{ background: "#ff6b6b" }}>Xóa</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
