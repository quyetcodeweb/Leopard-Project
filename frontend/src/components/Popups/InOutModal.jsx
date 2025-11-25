import React, { useState } from "react";
import "./InOutModal.css";

const InOutModal = ({ product, onClose, onSave }) => {
  const [quantity, setQuantity] = useState("");

  const handleSave = () => {
    const qty = Number(quantity);
    if (isNaN(qty)) {
      alert("Vui lòng nhập số hợp lệ!");
      return;
    }
    onSave(qty);
    onClose();
  };

  return (
    <div className="inout-overlay">
      <div className="inout-modal">
        <h3>{product.ProductName}</h3>
        <div className="inout-content">
          <div className="inout-image">
            {product.Image ? (
              <img src={product.Image} alt={product.ProductName} />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="inout-inputs">
            <input
              type="number"
              placeholder="Nhập số lượng (+/-)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="inout-buttons">
              <button className="inout-btn save" onClick={handleSave}>
                Lưu
              </button>
              <button className="inout-btn cancel" onClick={onClose}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InOutModal;
