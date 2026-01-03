import "./SummaryCards.css";
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function SummaryCards({ from, to }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/revenue/summary", { params: { from, to } })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [from, to]);

  if (!data) return null;

  const Percent = ({ value }) => (
    <span className={`percent ${value >= 0 ? "up" : "down"}`}>
      {value >= 0 ? "▲" : "▼"} {Math.abs(value)}%
      <small> so với kỳ trước</small>
    </span>
  );

  return (
    <div className="summary-grid">
      {/* ===== DOANH THU ===== */}
      <div className="summary-card">
        <div className="icon yellow">
          <HiOutlineCurrencyDollar />
        </div>
        <div className="content">
          <p className="label">Doanh thu</p>

          {/* ✅ FIX: format giống LineChart */}
          <h3>
            {Number(data.revenue.value || 0).toLocaleString("vi-VN")} VND
          </h3>

          <Percent value={data.revenue.percent} />
        </div>
      </div>

      {/* ===== ĐƠN HÀNG ===== */}
      <div className="summary-card">
        <div className="icon green">
          <HiOutlineShoppingCart />
        </div>
        <div className="content">
          <p className="label">Đơn hàng</p>
          <h3>{data.orders.value}</h3>
          <Percent value={data.orders.percent} />
        </div>
      </div>

      {/* ===== KHÁCH HÀNG ===== */}
      <div className="summary-card">
        <div className="icon blue">
          <HiOutlineUsers />
        </div>
        <div className="content">
          <p className="label">Khách hàng mới</p>
          <h3>{data.customers.value}</h3>
          <Percent value={data.customers.percent} />
        </div>
      </div>
    </div>
  );
}
