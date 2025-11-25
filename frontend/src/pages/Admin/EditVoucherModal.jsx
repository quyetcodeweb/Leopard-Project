import React, { useState, useEffect } from "react";
import "./AddVoucherModal.css"; // Reuse CSS

const EditVoucherModal = ({ voucher, onClose, onSuccess }) => {
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

  // ⭐ Parse datetime "2025-01-10T00:00:00"
  const splitDateTime = (dt) => {
    if (!dt) return { date: "", time: "" };
    const [date, time] = dt.split("T");
    return {
      date,
      time: time ? time.slice(0, 5) : "",
    };
  };

  // ⭐ Khi mở popup → load dữ liệu vào form
  useEffect(() => {
    const start = splitDateTime(voucher.StartDate);
    const end = splitDateTime(voucher.ExpirationDate);

    setForm({
      code: voucher.Code || "",
      description: voucher.Description || "",

      type: voucher.DiscountPercent > 0 ? "%" : "VND",

      value: voucher.DiscountPercent > 0 ? voucher.DiscountPercent : voucher.Value || "",
      maxValue: voucher.MaxValue || "",

      startDate: start.date,
      startTime: start.time,

      endDate: end.date,
      endTime: end.time,

      quantity: voucher.MaxUse || "",
      minOrder: voucher.MinOrder || "",

      status: voucher.Status == 1 ? "active" : "inactive",
    });
  }, [voucher]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const startDateTime =
      form.startDate && form.startTime
        ? `${form.startDate} ${form.startTime}:00`
        : null;

    const expirationDateTime =
      form.endDate && form.endTime
        ? `${form.endDate} ${form.endTime}:00`
        : null;

    const statusMap = { active: 1, inactive: 2 };
    const statusValue = statusMap[form.status];

    const data = {
      code: form.code,
      description: form.description,

      discountPercent: form.type === "%" ? form.value : 0,
      value: form.type === "VND" ? form.value : null,
      maxValue: form.type === "%" ? form.maxValue : null,

      startDate: startDateTime,
      expirationDate: expirationDateTime,

      maxUse: form.quantity,
      minOrder: form.minOrder,

      status: statusValue,
    };

    console.log("DATA UPDATE:", data);

    try {
      const res = await fetch(
        `http://localhost:5000/api/vouchers/${voucher.VoucherID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      alert(result.message || "Cập nhật thành công");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật voucher");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* HEADER */}
        <div className="modal-header">
          <span className="title">Sửa mã giảm giá</span>
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
              />
              <span className="unit">
                {form.type === "%" ? "%" : "VND"}
              </span>
            </div>

            {form.type === "%" && (
              <>
                <div className="form-subtext red">❗ Từ 1% đến 100%</div>

                <div className="row-3">
                  <label>Giảm tối đa</label>
                  <input
                    name="maxValue"
                    value={form.maxValue}
                    onChange={handleChange}
                  />
                  <span className="unit">VND</span>
                </div>
              </>
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
            <button className="save" onClick={handleUpdate}>Cập nhật</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditVoucherModal;
