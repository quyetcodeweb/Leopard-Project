import React from "react";

const DeleteProductPopup = ({ product, onClose, onDelete }) => {
  return (
    <div className="modal-overlay">
      <div className="modalpopup">
        <h3>Xóa sản phẩm</h3>
        <p>Bạn có chắc muốn xóa sản phẩm <strong>{product?.ProductName}</strong> không?</p>
        <button className="btn-cancel" onClick={onClose}>Hủy</button>
        <button className="btn-delete" onClick={() => onDelete(product)}>Xóa</button>
      </div>
    </div>
  );
};

export default DeleteProductPopup;
