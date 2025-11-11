import React, { useEffect, useState } from "react";
import "./ProductList.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("Số lượng");
  
  useEffect(() => {
    setProducts([
      { id: 1, code: "Z132312313", name: "Rau", category: "Rau", price: 240.0, qty: 1, status: true },
      { id: 2, code: "Z132312313", name: "Ăn vặt bà Tuyết", category: "Bánh", price: 240.0, qty: 30, status: true },
      { id: 3, code: "Z132312313", name: "Bánh mì", category: "Bánh", price: 240.0, qty: 30, status: false },
      { id: 4, code: "Z132312313", name: "Nui", category: "Bánh", price: 240.0, qty: 30, status: true },
      { id: 5, code: "Z132312313", name: "Mì", category: "Bánh", price: 240.0, qty: 30, status: true },
      { id: 6, code: "Z132312313", name: "Bột giặt OMO", category: "Bánh", price: 240.0, qty: 30, status: true },
      { id: 7, code: "Z132312313", name: "Card Viettel 20k", category: "Bánh", price: 240.0, qty: 30, status: true },
    ]);
  }, []);

  return (
    <div className="product-page">
      <div className="product-toolbar">
        <div className="product-search">
            <input
            type="text"
            placeholder="🔍 Tìm kiếm ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="Số lượng">Lọc theo: Số lượng</option>
            <option value="Giá">Lọc theo: Giá</option>
            <option value="Trạng thái">Lọc theo: Trạng thái</option>
          </select>
        </div>
        <div className="product-addbtn">
          <button className="btn-add">
           Thêm
          </button>
        </div>
      </div>

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
          {products.map((p) => (
            
            <tr key={p.id}>
              <td className="action-icons">
                <FaEdit className="edit" />
              </td>
              <td><div className="avatar-placeholder"></div></td>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>
                <span className={`status-dot ${p.status ? "active" : "inactive"}`}></span>
              </td>
              <td>{p.price}</td>
              <td>{p.qty}</td>
              <td className="action-icons">
                <FaTrash className="delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="page-btn">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <span>...</span>
        <button className="page-btn">40</button>
      </div>
    </div>
  );
};

export default ProductList;
