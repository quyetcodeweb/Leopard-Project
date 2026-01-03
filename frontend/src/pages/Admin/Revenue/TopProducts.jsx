import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./TopProducts.css";

export default function TopProducts({ from, to }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/revenue/top-products", { params: { from, to } })
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, [from, to]);

  return (
    <div className="top-products">
      {/* Header */}
      <div className="top-header">
        <h4 className="title">Top sản phẩm bán chạy</h4>
      </div>

      {/* Thanh ngang */}
      <div className="divider" />

      {/* List */}
      {products.map((p) => (
        <div className="product-item" key={p.id}>
          <img
            src={p.image}
            alt={p.name}
            className="product-img"
          />

          <div className="product-info">
            <div className="product-name">{p.name}</div>

            <div className="product-row">
              <span
                className={`status ${
                  p.status === "Còn hàng" ? "in-stock" : "out-stock"
                }`}
              >
                {p.status}
              </span>

              <span
                className="view"
                onClick={() => navigate(`/products`)}
              >
                Xem chi tiết
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
