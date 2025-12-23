import React, { useState } from "react";
import "./AddVoucherModal.css";

const AddVoucherModal = ({ onClose }) => {
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "%",
    value: "",
    maxValue: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    quantity: "",
    minOrder: "",
    status: "active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {

    // ⭐ GHÉP START DATE + TIME → datetime chuẩn
    const startDateTime =
      form.startDate && form.startTime
        ? `${form.startDate} ${form.startTime}:00`
        : null;

    // ⭐ GHÉP END DATE + TIME → datetime chuẩn
    const expirationDateTime =
      form.endDate && form.endTime
        ? `${form.endDate} ${form.endTime}:00`
        : null;

    // ⭐ Status mapping FE → BE
    const statusMap = { active: 1, inactive: 2 };
    const statusValue = statusMap[form.status];

    const data = {
      code: form.code,
      discountPercent: form.value,
      startDate: startDateTime,          // ⭐ BẮT BUỘC GỬI
      expirationDate: expirationDateTime, // ⭐ BẮT BUỘC GỬI
      maxUse: form.quantity,
      status: statusValue,
    };

    console.log("DATA SENT TO BACKEND:", data);

    try {
      const res = await fetch("http://localhost:5000/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      alert(result.message);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu voucher");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-header">
          <span className="title">Thêm mã giảm giá</span>
          <span className="close-btn" onClick={onClose}>X</span>
        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* THÔNG TIN CƠ BẢN */}
          <div className="section">
            <div className="section-title">THÔNG TIN CƠ BẢN</div>

            <div className="row-2">
              <label>Mã giảm giá</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Nhập mã..."
              />
            </div>
            <div className="form-subtext">
              ❗ Chỉ cho phép chữ, số và gạch dưới
            </div>

            <div className="row-2">
              <label>Mô tả</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả..."
              />
            </div>
          </div>

          {/* LOẠI & GIÁ TRỊ */}
          <div className="section">
            <div className="section-title">LOẠI VÀ GIÁ TRỊ</div>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="%"
                  checked={form.type === "%"}
                  onChange={handleChange}
                />
                Giảm theo %
              </label>

              <label>
                <input
                  type="radio"
                  name="type"
                  value="VND"
                  checked={form.type === "VND"}
                  onChange={handleChange}
                />
                Giảm theo số tiền
              </label>
            </div>

            <div className="row-3">
              <label>Giá trị giảm</label>
              <input
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="Nhập số..."
              />
              <span className="unit">
                {form.type === "%" ? "%" : "VND"}
              </span>
            </div>

            <div className="form-subtext red">
              ❗ Từ 1% đến 100%
            </div>

            {form.type === "%" && (
              <div className="row-3">
                <label>Giảm tối đa</label>
                <input
                  name="maxValue"
                  value={form.maxValue}
                  onChange={handleChange}
                />
                <span className="unit">VND</span>
              </div>
            )}
          </div>

          {/* THỜI GIAN & ĐIỀU KIỆN */}
          <div className="section">
            <div className="section-title">THỜI GIAN VÀ ĐIỀU KIỆN</div>

            <div className="row-3">
              <label>Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="row-3">
              <label>Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
              />
            </div>

            <div className="row-2">
              <label>Số lượng</label>
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="row-3">
              <label>Đơn hàng tối thiểu</label>
              <input
                name="minOrder"
                value={form.minOrder}
                onChange={handleChange}
              />
              <span className="unit">VND</span>
            </div>
          </div>

          {/* TRẠNG THÁI */}
          <div className="section">
            <div className="section-title">TRẠNG THÁI</div>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={form.status === "active"}
                  onChange={handleChange}
                />
                Hoạt động
              </label>

              <label>
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={form.status === "inactive"}
                  onChange={handleChange}
                />
                Chưa áp dụng
              </label>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="footer">
            <button className="cancel" onClick={onClose}>Hủy</button>
            <button className="save" onClick={handleSave}>Lưu</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddVoucherModal;
