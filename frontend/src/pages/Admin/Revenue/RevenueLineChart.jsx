import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RevenueLineChart.css";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function RevenueLineChart({ from, to }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/revenue/line", {
        params: { from, to },
      })
      .then((res) => {
        const raw = res.data || [];

        // ===== Tổng doanh thu =====
        const totalRevenue = raw.reduce(
          (sum, item) => sum + (item.current || 0),
          0
        );
        setTotal(totalRevenue);

        // ===== Chuẩn hóa 12 tháng =====
        const normalized = MONTHS.map((m, i) => {
          const found = raw.find((r) => r.month === i + 1);
          return {
            month: m,
            current: found ? found.current : 0,
            previous: found ? found.previous : 0,
          };
        });

        setData(normalized);
      })
      .catch(console.error);
  }, [from, to]);

  return (
    <div className="line-chart">
      {/* ===== HEADER ===== */}
      <div className="chart-header">
        <h3 className="chart-title">Doanh thu</h3>

        <span
          className="view"
          onClick={() => navigate("/reports/revenue")}
        >
          Xem báo cáo
        </span>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="divider" />

      {/* ===== SUB TITLE ===== */}
      <p className="subtitle">Doanh thu đạt được</p>

      {/* ===== TOTAL ===== */}
      <p className="total">
        {total.toLocaleString("vi-VN")} VND
      </p>

      {/* ===== CHART ===== */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="month" />

          <YAxis
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(0)}M`
                : v >= 1_000
                ? `${(v / 1_000).toFixed(0)}K`
                : v
            }
          />

          <Tooltip
            formatter={(v) =>
              `${v.toLocaleString("vi-VN")} VND`
            }
          />

          <Area
            type="monotone"
            dataKey="previous"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#previousGradient)"
            dot={false}
          />

          <Area
            type="monotone"
            dataKey="current"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#currentGradient)"
            dot={false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
