import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const AddProductPopup = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    ProductName: "",
    Price: 0,
    Description: "",
    Image: "",
    CategoryID: "",
    Stock: 0,
    WarningStock: 5,
    IsActive: 1,
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Load danh mục khi mở popup
  useEffect(() => {
    fetch("http://localhost:5000/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  // Ngăn nhập ký tự không phải số vào Price và WarningStock
  if ((name === "Price" || name === "WarningStock") && value !== "") {
    if (!/^\d*$/.test(value)) {
      return; // Không cho setState → ngăn nhập chữ
    }
  }

  // Xử lý hình ảnh
  if (name === "Image" && files && files[0]) {
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, Image: reader.result });
    reader.readAsDataURL(files[0]);
    return;
  }

  setForm({ ...form, [name]: value });
};


  const handleSave = (e) => {
  e.preventDefault();

  // ===== VALIDATION =====

  // 1. Validate tên sản phẩm
  if (!form.ProductName.trim()) {
    alert("Please fill out this field (Tên sản phẩm)");
    return;
  }
  if (form.ProductName.length > 255) {
    alert("Tên sản phẩm không hợp lệ (quá 255 ký tự)");
    return;
  }

  // 2. Validate giá
  if (form.Price === "" || form.Price === null) {
    alert("Vui lòng nhập giá sản phẩm");
    return;
  }
  if (isNaN(form.Price)) {
    alert("Please enter a number (Giá)");
    return;
  }
  if (form.Price.toString().length > 8) {
    alert("Giá không hợp lệ (quá 8 chữ số)");
    return;
  }

  // 3. Validate số lượng cảnh báo
  if (isNaN(form.WarningStock)) {
    alert("Please enter a number (Số lượng cảnh báo)");
    return;
  }
  if (parseInt(form.WarningStock) < 0) {
    alert("Số lượng cảnh báo phải >= 0");
    return;
  }

  // 4. Validate danh mục
  if (!form.CategoryID) {
    alert("Vui lòng chọn danh mục sản phẩm");
    return;
  }

  // ===== PASS → gửi về parent =====
  onSave({
    ...form,
    Price: parseFloat(form.Price),
    WarningStock: parseInt(form.WarningStock),
    CategoryID: parseInt(form.CategoryID),
    IsActive: parseInt(form.IsActive) || 0,
  });
};


  const handleAddCategory = () => {
    if (!newCategory.trim()) return alert("Vui lòng nhập tên danh mục!");

    fetch("http://localhost:5000/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ CategoryName: newCategory }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return alert(data.error);
        setCategories([...categories, data]);
        setForm({ ...form, CategoryID: data.CategoryID });
        setNewCategory("");
        setShowAddCategory(false);
      })
      .catch((err) => console.error("Lỗi thêm danh mục:", err));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Thêm sản phẩm</h3>
        <FaTimes className="close" onClick={onClose} />

        <form onSubmit={handleSave}>
          {/* Tên sản phẩm */}
          <div>
            <label>Tên sản phẩm</label>
            <input
              name="ProductName"
              placeholder="Nhập tên sản phẩm"
              value={form.ProductName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Giá */}
          <div>
            <label>Giá</label>
            <input
              name="Price"
              type="number"
              placeholder="Nhập giá sản phẩm"
              value={form.Price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mô tả */}
          <div className="full-width">
            <label>Mô tả</label>
            <textarea
              name="Description"
              placeholder="Mô tả ngắn gọn về sản phẩm"
              value={form.Description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Trạng thái hiển thị */}
          <div>
            <label>Trạng thái hiển thị</label>
            <select
              name="IsActive"
              value={form.IsActive}
              onChange={handleChange}
            >
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>

          {/* Danh mục */}
          <div>
            <label>Danh mục sản phẩm</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                name="CategoryID"
                value={form.CategoryID}
                onChange={handleChange}
                style={{ flex: 1 }}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.CategoryID} value={c.CategoryID}>
                    {c.CategoryName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn-add-category"
                onClick={() => setShowAddCategory(true)}
              >
                +
              </button>
            </div>
          </div>

          {/* Số lượng cảnh báo */}
          <div>
            <label>Số lượng cảnh báo</label>
            <input
              name="WarningStock"
              type="number"
              value={form.WarningStock}
              onChange={handleChange}
              min={0}
            />
          </div>

          {/* Ảnh */}
          <div className="full-width">
            <label>Hình ảnh</label>
            <input name="Image" type="file" onChange={handleChange} />
            {form.Image && (
              <img className="preview-avatar" src={form.Image} alt="preview" />
            )}
          </div>

          <button type="submit" className="btn-save">
            Lưu
          </button>
        </form>

        {/* Popup thêm danh mục */}
        {showAddCategory && (
          <div className="small-modal-overlay">
            <div className="small-modal">
              <h4>Thêm danh mục mới</h4>
              <input
                placeholder="Nhập tên danh mục"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <div className="btns">
                <button
                  type="button"
                  className="btn-save"
                  onClick={handleAddCategory}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddCategory(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPopup;
