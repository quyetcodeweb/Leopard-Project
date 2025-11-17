import React, { useEffect, useState } from "react";
import "./ProductList.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

// Popup component
import AddProductPopup from "../../components/Popups/AddProductPopup";
import EditProductPopup from "../../components/Popups/EditProductPopup";
import DeleteProductPopup from "../../components/Popups/DeleteProductPopup";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_URL = "http://localhost:5000/api/category";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔄 Lấy sản phẩm từ backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      const processed = res.data.map((p) => ({
        ...p,
        IsActive: typeof p.IsActive === "object" ? p.IsActive[0] : p.IsActive,
      }));
      setProducts(processed);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  // 🔄 Lấy danh mục
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🔘 Toggle trạng thái
  const toggleStatus = async (product) => {
    try {
      const res = await axios.put(`${API_URL}/${product.ProductID}/toggle`);
      setProducts(
        products.map((p) =>
          p.ProductID === product.ProductID
            ? { ...p, IsActive: res.data.IsActive }
            : p
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  // Mở popup sửa
  const openEditModal = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // Mở popup xóa
  const openDeleteModal = (product) => {
    setDeleteProduct(product);
    setShowDeleteModal(true);
  };

  // Lọc sản phẩm theo search + category
  const filteredProducts = products.filter(
    (p) =>
      p.ProductName.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedCategory === "all" ||
        p.CategoryID === parseInt(selectedCategory))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageNumbers = (pageCount, currentPage) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l > 2) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };
  useEffect(() => {
    document.title = "Sản phẩm | Quản lý bán hàng";
  }, []);

  return (
    <div className="product-page">
      {/* TOOLBAR */}
      <div className="product-toolbar">
        <div className="product-search">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm ..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">-- Tất cả danh mục --</option>
            {categories.map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>
                {c.CategoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="product-addbtn">
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Thêm
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="product-table">
        <thead>
          <tr>
            <th></th>
            <th>Ảnh</th>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.ProductID}>
              <td className="action-icons">
                <FaEdit className="edit" onClick={() => openEditModal(p)} />
              </td>
              <td>
                <div className="avatar-placeholder">
                  {p.Image ? (
                    <img src={p.Image} alt={p.ProductName} />
                  ) : (
                    "No Image"
                  )}
                  {p.Stock <= p.WarningStock && (
                    <span
                      className="low-stock-badge"
                      data-tooltip={`Sắp hết hàng • Còn ${p.Stock} sản phẩm`}
                    >
                      !
                    </span>
                  )}
                </div>
              </td>
              <td>{p.ProductID}</td>
              <td>{p.ProductName}</td>
              <td>
                {categories.find((c) => c.CategoryID === p.CategoryID)
                  ?.CategoryName || "Chưa có"}
              </td>
              <td>
                <span
                  className={`status-dot ${p.IsActive ? "active" : "inactive"}`}
                  title={p.IsActive ? "Hiển thị" : "Ẩn"}
                  data-tooltip={p.IsActive ? "Đang hiển thị" : "Đang ẩn"}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleStatus(p)}
                ></span>
              </td>
              <td>{p.Price}</td>
              <td>{p.Stock}</td>
              <td className="action-icons">
                <FaTrash
                  className="delete"
                  onClick={() => openDeleteModal(p)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        {getPageNumbers(totalPages, currentPage).map((p, i) => (
          <button
            key={i}
            className={`page-btn ${p === currentPage ? "active" : ""}`}
            disabled={p === "..."}
            onClick={() => p !== "..." && setCurrentPage(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* POPUPS */}
      {showAddModal && (
        <AddProductPopup
          onClose={() => setShowAddModal(false)}
          onSave={async (newProduct) => {
            try {
              await axios.post(API_URL, newProduct);
              setShowAddModal(false);
              fetchProducts();
            } catch (err) {
              console.error("Lỗi thêm sản phẩm:", err);
            }
          }}
        />
      )}

      {showEditModal && editProduct && (
        <EditProductPopup
          product={editProduct}
          onClose={() => setShowEditModal(false)}
          onSave={async (updatedProduct) => {
            try {
              await axios.put(
                `${API_URL}/${editProduct.ProductID}`,
                updatedProduct
              );
              setShowEditModal(false);
              setEditProduct(null);
              fetchProducts();
            } catch (err) {
              console.error("Lỗi cập nhật sản phẩm:", err);
            }
          }}
        />
      )}

      {showDeleteModal && deleteProduct && (
        <DeleteProductPopup
          product={deleteProduct}
          onClose={() => setShowDeleteModal(false)}
          onDelete={async () => {
            try {
              await axios.delete(`${API_URL}/${deleteProduct.ProductID}`);
              setShowDeleteModal(false);
              setDeleteProduct(null);
              fetchProducts();
            } catch (err) {
              console.error("Lỗi xóa sản phẩm:", err);
            }
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
