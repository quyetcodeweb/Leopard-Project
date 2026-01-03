import React, { useState, useEffect } from "react";
import "./AddVoucherModal.css"; // Reuse CSS

const splitDateTime = (dt) => {
  if (!dt) return { date: "", time: "" };
  const [date, time] = dt.replace("T", " ").split(" ");
  return {
    date,
    time: time ? time.substring(0, 5) : "",
  };
};

const EditVoucherModal = ({ voucher, onClose, onSaved }) => {
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

  useEffect(() => {
    if (!voucher) return;

    const start = splitDateTime(voucher.StartDate);
    const end = splitDateTime(voucher.ExpirationDate);

    setForm({
      code: voucher.Code || "",
      description: voucher.Description || "",
      type: voucher.DiscountPercent > 0 ? "%" : "VND",
      value:
        voucher.DiscountPercent > 0
          ? voucher.DiscountPercent
          : voucher.DiscountAmount || "",
      maxValue: voucher.MaxValue || "",
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      quantity: voucher.MaxUse || "",
      minOrder: voucher.MinOrder || "",
      status: voucher.Status === 1 ? "active" : "inactive",
    });
  }, [voucher]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ CHỈ SỬA LOGIC
  const handleUpdate = async () => {
    const startDateTime =
      form.startDate && form.startTime
        ? `${form.startDate} ${form.startTime}:00`
        : null;

    const expirationDateTime =
      form.endDate && form.endTime
        ? `${form.endDate} ${form.endTime}:00`
        : null;

    const statusValue = form.status === "active" ? 1 : 2;

    // ✅ MAP ĐÚNG BACKEND (QUAN TRỌNG)
    const data = {
      code: form.code,
      type: form.type,
      discountValue: Number(form.value),
      startDate: startDateTime,
      expirationDate: expirationDateTime,
      maxUse: Number(form.quantity),
      status: statusValue,
    };

    let result;

    // ✅ CHỈ BẮT LỖI UPDATE
    try {
      const res = await fetch(
        `http://localhost:5000/api/vouchers/${voucher.VoucherID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      result = await res.json();
    } catch (err) {
      console.error("Update voucher error:", err);
      alert("Lỗi khi cập nhật voucher");
      return;
    }

    // ✅ UPDATE OK
    alert(result.message || "Cập nhật thành công");

    // ✅ reload list nhưng KHÔNG được làm fail update
    try {
      await onSaved();
    } catch (e) {
      console.warn("Reload voucher list failed", e);
    }

    onClose();
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
