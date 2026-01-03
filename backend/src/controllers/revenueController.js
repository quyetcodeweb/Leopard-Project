import db from "../config/db.js";

/* ===================== SUMMARY ===================== */
export const getSummary = (req, res) => {
  let { from, to } = req.query;

  // ===== DEFAULT: từ đầu năm đến hiện tại =====
  if (!from || !to) {
    const now = new Date();
    to = now.toISOString().slice(0, 10);
    from = `${now.getFullYear()}-01-01`;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const diffDays =
    Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

  const prevTo = new Date(fromDate);
  prevTo.setDate(prevTo.getDate() - 1);

  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - diffDays + 1);

  const f1 = from;
  const t1 = to;
  const f2 = prevFrom.toISOString().slice(0, 10);
  const t2 = prevTo.toISOString().slice(0, 10);

  const summarySql = `
    SELECT
      SUM(Total) AS revenue,
      COUNT(*) AS orders
    FROM \`Order\`
    WHERE Status = 'Hoàn thành'
      AND DATE(OrderDate) BETWEEN ? AND ?
  `;

  const customerSql = `
    SELECT COUNT(DISTINCT CustomerID) AS customers
    FROM \`Order\`
    WHERE Status = 'Hoàn thành'
      AND DATE(OrderDate) BETWEEN ? AND ?
  `;

  db.query(summarySql, [f1, t1], (e1, cur) => {
    if (e1) return res.status(500).json(e1);

    db.query(summarySql, [f2, t2], (e2, prev) => {
      if (e2) return res.status(500).json(e2);

      db.query(customerSql, [f1, t1], (e3, curCus) => {
        if (e3) return res.status(500).json(e3);

        db.query(customerSql, [f2, t2], (e4, prevCus) => {
          if (e4) return res.status(500).json(e4);

          const calcPercent = (cur, prev) => {
            if (!prev || prev === 0) return 100;
            return Number((((cur - prev) / prev) * 100).toFixed(1));
          };

          res.json({
            revenue: {
              value: cur[0].revenue || 0,
              percent: calcPercent(cur[0].revenue, prev[0].revenue),
            },
            orders: {
              value: cur[0].orders || 0,
              percent: calcPercent(cur[0].orders, prev[0].orders),
            },
            customers: {
              value: curCus[0].customers || 0,
              percent: calcPercent(
                curCus[0].customers,
                prevCus[0].customers
              ),
            },
          });
        });
      });
    });
  });
};

/* ===================== LINE CHART ===================== */
export const getLineChart = (req, res) => {
  let { from, to } = req.query;

  // ===== DEFAULT: đầu năm → hiện tại =====
  if (!from || !to) {
    const now = new Date();
    to = now.toISOString().slice(0, 10);
    from = `${now.getFullYear()}-01-01`;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const diffDays =
    Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

  const prevTo = new Date(fromDate);
  prevTo.setDate(prevTo.getDate() - 1);

  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - diffDays + 1);

  const f1 = from;
  const t1 = to;
  const f2 = prevFrom.toISOString().slice(0, 10);
  const t2 = prevTo.toISOString().slice(0, 10);

  const sql = `
    SELECT 
      MONTH(OrderDate) AS month,
      SUM(Total) AS value
    FROM \`Order\`
    WHERE Status = 'Hoàn thành'
      AND DATE(OrderDate) BETWEEN ? AND ?
    GROUP BY MONTH(OrderDate)
  `;

  db.query(sql, [f1, t1], (e1, curRows) => {
    if (e1) return res.status(500).json(e1);

    db.query(sql, [f2, t2], (e2, prevRows) => {
      if (e2) return res.status(500).json(e2);

      const data = Array.from({ length: 12 }, (_, i) => {
        const cur = curRows.find(r => r.month === i + 1);
        const prev = prevRows.find(r => r.month === i + 1);

        return {
          month: i + 1,
          current: cur ? Number(cur.value) : 0,
          previous: prev ? Number(prev.value) : 0,
        };
      });

      res.json(data);
    });
  });
};

/* ===================== PIE CHART ===================== */
export const getRevenueByCategory = (req, res) => {
  let { from, to } = req.query;

  if (!from || !to) {
    const now = new Date();
    to = now.toISOString().slice(0, 10);
    from = `${now.getFullYear()}-01-01`;
  }

  const sql = `
    SELECT 
      c.CategoryName AS name,
      SUM(od.Quantity * od.UnitPrice) AS value
    FROM \`Order\` o
    JOIN OrderDetail od ON o.OrderID = od.OrderID
    JOIN Product p ON od.ProductID = p.ProductID
    JOIN Category c ON p.CategoryID = c.CategoryID
    WHERE o.Status = 'Hoàn thành'
      AND DATE(o.OrderDate) BETWEEN ? AND ?
    GROUP BY c.CategoryID
    HAVING value > 0
    ORDER BY value DESC
  `;

  db.query(sql, [from, to], (err, rows) => {
    if (err) return res.status(500).json(err);

    const top5 = rows.slice(0, 5);
    const others = rows.slice(5);

    const otherValue = others.reduce((s, i) => s + Number(i.value), 0);

    const result = [...top5];

    if (otherValue > 0) {
      result.push({
        name: "Khác",
        value: otherValue,
      });
    }

    res.json(result);
  });
};

/* ===================== TOP PRODUCTS ===================== */
export const getTopProducts = (req, res) => {
  let { from, to } = req.query;

  if (!from || !to) {
    const now = new Date();
    to = now.toISOString().slice(0, 10);
    from = `${now.getFullYear()}-01-01`;
  }

  const sql = `
    SELECT 
      p.ProductID AS id,
      p.ProductName AS name,
      p.Image AS image,
      p.Stock AS stock,
      SUM(od.Quantity) AS sold
    FROM \`Order\` o
    JOIN OrderDetail od ON o.OrderID = od.OrderID
    JOIN Product p ON od.ProductID = p.ProductID
    WHERE o.Status = 'Hoàn thành'
      AND DATE(o.OrderDate) BETWEEN ? AND ?
    GROUP BY p.ProductID
    ORDER BY sold DESC
    LIMIT 4
  `;

  db.query(sql, [from, to], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(
      rows.map(p => ({
        id: p.id,
        name: p.name,
        image: p.image ? `/images/${p.image}` : "/images/product.png",
        status: p.stock > 0 ? "Còn hàng" : "Hết hàng",
      }))
    );
  });
};



