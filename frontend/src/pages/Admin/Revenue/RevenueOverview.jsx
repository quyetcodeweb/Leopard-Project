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

    let f = from;
    let t = to;

    // bỏ trống cả 2
    if (!f && !t) {
      setAppliedFrom(startOfYear);
      setAppliedTo(today);
      return;
    }

    // bỏ trống ngày bắt đầu
    if (!f && t) {
      const end = new Date(t);
      const start = new Date(end);
      start.setMonth(start.getMonth() - 12);

      setAppliedFrom(start.toISOString().slice(0, 10));
      setAppliedTo(t);
      return;
    }

    // bỏ trống ngày kết thúc
    if (f && !t) {
      const start = new Date(f);
      const end = new Date(today);

      const diff = monthDiff(f, today);
      setAppliedFrom(f);
      setAppliedTo(
        diff > 12
          ? new Date(start.setMonth(start.getMonth() + 12))
              .toISOString()
              .slice(0, 10)
          : today
      );
      return;
    }

    // ngày vượt quá hiện tại
    if (f > today || t > today) {
      setError("Thời gian không vượt quá ngày hiện tại, vui lòng chọn lại!");
      return;
    }

    // ngày bắt đầu >= ngày kết thúc
    if (f >= t) {
      setError("Ngày bắt đầu phải nhỏ hơn Ngày kết thúc, vui lòng chọn lại!");
      return;
    }

    // quá 12 tháng
    if (monthDiff(f, t) > 12) {
      setError(
        "Khoảng cách giữa hai mốc thời gian không quá một năm, vui lòng chọn lại!"
      );
      return;
    }

    setAppliedFrom(f);
    setAppliedTo(t);
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
