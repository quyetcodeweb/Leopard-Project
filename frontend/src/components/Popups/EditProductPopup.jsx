import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditProductPopup = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    ProductName: "",
    Price: 0,
    Description: "",
    Image: "",
    CategoryID: "",
    Stock: 0,
    WarningStock: "5",
    IsActive: 1,
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    // Load danh mục
    fetch("http://localhost:5000/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi tải danh mục:", err));

    // Khởi tạo form từ product
    if (product) {
      setForm({
        ProductName: product.ProductName || "",
        Price: product.Price || 0,
        Description: product.Description || "",
        Image: product.Image || "",
        CategoryID: product.CategoryID || "",
        Stock: product.Stock || 0,
        WarningStock: product.WarningStock || 5,
        IsActive: product.IsActive || 1,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Image" && files[0]) {
      const reader = new FileReader();
      reader.onload = () => setForm({ ...form, Image: reader.result });
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      Price: parseFloat(form.Price) || 0,
      WarningStock: parseInt(form.WarningStock) || 0,
      CategoryID: form.CategoryID ? parseInt(form.CategoryID) : null,
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
        <h3>Chỉnh sửa sản phẩm</h3>
        <FaTimes className="close" onClick={onClose} />

        <form onSubmit={handleSave}>
          <div>
            <label>Tên sản phẩm</label>
            <input
              name="ProductName"
              value={form.ProductName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Giá</label>
            <input
              name="Price"
              type="number"
              value={form.Price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="full-width">
            <label>Mô tả</label>
            <textarea
              name="Description"
              value={form.Description}
              onChange={handleChange}
            />
          </div>

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

          <div>
            <label>Danh mục</label>
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

          <div>
            <label>Số lượng hiện tại</label>
            <input value={form.Stock} disabled />
          </div>

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

          <div className="full-width">
            <label>Hình ảnh</label>
            <input name="Image" type="file" onChange={handleChange} />
            {form.Image && <img src={form.Image} alt="preview" className="preview-avatar" />}
          </div>

          <button type="submit" className="btn-save">Lưu</button>
        </form>

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
                <button type="button" className="btn-save" onClick={handleAddCategory}>
                  Lưu
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowAddCategory(false)}>
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

export default EditProductPopup;
