import React, { useState } from "react";
import "./RevenueOverview.css";

import SummaryCards from "./SummaryCards";
import RevenueLineChart from "./RevenueLineChart";
import RevenuePieChart from "./RevenuePieChart";
import TopProducts from "./TopProducts";

const RevenueOverview = () => {
  const today = new Date().toISOString().slice(0, 10);
  const startOfYear = `${new Date().getFullYear()}-01-01`;

  // input
  const [from, setFrom] = useState(startOfYear);
  const [to, setTo] = useState(today);

  // applied
  const [appliedFrom, setAppliedFrom] = useState(startOfYear);
  const [appliedTo, setAppliedTo] = useState(today);

  const [error, setError] = useState("");

  const monthDiff = (d1, d2) => {
    const start = new Date(d1);
    const end = new Date(d2);
    return (
      end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth())
    );
  };

  const handleApply = () => {
    setError("");

    const todayDate = new Date(today);

    // convert sang Date (tránh so sánh string)
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    // ===== VALIDATE FORMAT =====
    if ((from && isNaN(fromDate)) || (to && isNaN(toDate))) {
      setError("Ngày không hợp lệ, vui lòng chọn lại!");
      return;
    }

    // ===== CASE 1: KHÔNG NHẬP CẢ 2 =====
    if (!from && !to) {
      setAppliedFrom(startOfYear);
      setAppliedTo(today);
      return;
    }

    // ===== CASE 2: CHỈ NHẬP NGÀY KẾT THÚC =====
    if (!from && to) {
      if (toDate > todayDate) {
        setError("Ngày kết thúc không được vượt quá ngày hiện tại!");
        return;
      }

      const start = new Date(toDate);
      start.setMonth(start.getMonth() - 12);

      if (start > toDate) {
        setError("Khoảng thời gian không hợp lệ!");
        return;
      }

      setAppliedFrom(start.toISOString().slice(0, 10));
      setAppliedTo(to);
      return;
    }

    // ===== CASE 3: CHỈ NHẬP NGÀY BẮT ĐẦU =====
    if (from && !to) {
      if (fromDate > todayDate) {
        setError("Ngày bắt đầu không được vượt quá ngày hiện tại!");
        return;
      }

      const diff = monthDiff(from, today);

      if (diff > 12) {
        setError("Khoảng thời gian không quá 12 tháng!");
        return;
      }

      setAppliedFrom(from);
      setAppliedTo(today);
      return;
    }

    // ===== CASE 4: NHẬP ĐỦ 2 =====
    if (fromDate > todayDate || toDate > todayDate) {
      setError("Thời gian không vượt quá ngày hiện tại!");
      return;
    }

    if (fromDate >= toDate) {
      setError("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
      return;
    }

    if (monthDiff(from, to) > 12) {
      setError("Khoảng cách giữa hai mốc thời gian không quá 12 tháng!");
      return;
    }

    // ===== OK =====
    setAppliedFrom(from);
    setAppliedTo(to);
  };

  const handleReset = () => {
setFrom(startOfYear);
    setTo(today);
    setAppliedFrom(startOfYear);
    setAppliedTo(today);
    setError("");
  };

  return (
    <div className="revenue-page">
      {/* FILTER */}
      <div className="revenue-header">
        <div className="revenue-filter inline">
          <div className="filter-inline">
            <span className="filter-label">Ngày bắt đầu</span>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>

          <div className="filter-inline">
            <span className="filter-label">Ngày kết thúc</span>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleApply}>
            Áp dụng
          </button>

          <button className="btn-reset" onClick={handleReset}>
            Đặt lại
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* SUMMARY */}
      <SummaryCards from={appliedFrom} to={appliedTo} />

      {/* LINE */}
      <div className="card chart-full">
        <RevenueLineChart from={appliedFrom} to={appliedTo} />
      </div>

      {/* PIE + TOP */}
      <div className="row-grid">
        <div className="card">
          <RevenuePieChart from={appliedFrom} to={appliedTo} />
        </div>
        <div className="card">
          <TopProducts from={appliedFrom} to={appliedTo} />
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;