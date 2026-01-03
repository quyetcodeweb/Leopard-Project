import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./RevenuePieChart.css";

const COLORS = [
  "#6C9BFF", // Hóa phẩm
  "#4CAF50", // Rau củ
  "#E79AE3", // Thực phẩm
  "#FFD84D",
  "#FFB020",
  "#00E5FF",
];

export default function RevenuePieChart({ from, to }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/revenue/category", { params: { from, to } })
      .then((res) => {
        const formatted = res.data.map((d) => ({
          name: d.name,
          value: Number(d.value),
        }));
        setData(formatted);
      })
      .catch(console.error);
  }, [from, to]);

  const total = data.reduce((s, i) => s + i.value, 0);

  // ✅ FIX CHÍNH: format % cho giá trị rất nhỏ
  const formatPercent = (value) => {
    if (!total || value === 0) return "0%";

    const percent = (value / total) * 100;

    if (percent < 0.01) return "<0.01%";

    return `${percent.toFixed(2)}%`;
  };

  return (
    <div className="pie-card">
      {/* HEADER */}
      <div className="pie-header">
        <h4>Doanh thu theo danh mục</h4>
        <span
          className="view-link"
          onClick={() => navigate("/reports/revenue/category")}
        >
          Xem báo cáo
        </span>
      </div>

      {/* DIVIDER */}
      <div className="divider" />

      <div className="pie-body">
        {/* CHART */}
        <ResponsiveContainer width={260} height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              minAngle={5} // 🔥 ép hiện màu dù rất nhỏ
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(v) =>
                `${formatPercent(v)} • ${v.toLocaleString("vi-VN")} VND`
              }
            />
          </PieChart>
        </ResponsiveContainer>

        {/* LEGEND */}
        <div className="pie-legend">
          {data.map((item, i) => (
            <div className="legend-item" key={i}>
              <span
                className="legend-color"
                style={{
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
              <div>
                <div className="legend-name">{item.name}</div>
                <div className="legend-value">
                  {formatPercent(item.value)} •{" "}
                  {item.value.toLocaleString("vi-VN")} VND
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
