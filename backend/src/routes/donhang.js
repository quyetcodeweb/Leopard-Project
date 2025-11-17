import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// Tìm kiếm đơn hàng theo mã hoặc ngày
router.get("/search", (req, res) => {
  const { ma, ngay } = req.query;

  let sql = `
    SELECT o.OrderID, c.FullName AS CustomerName, c.Phone AS CustomerPhone,
           o.OrderDate, o.Total, o.Status
    FROM \`Order\` o
    JOIN Customer c ON o.CustomerID = c.CustomerID
    WHERE 1=1
  `;
  const params = [];

  if (ma) {
    sql += " AND o.OrderID = ?";
    params.push(ma);
  }

  if (ngay) {
    // Lọc theo ngày (yyyy-mm-dd)
    sql += " AND DATE(o.OrderDate) = ?";
    params.push(ngay);
  }

  sql += " ORDER BY o.OrderDate DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

// 1. Lấy tất cả đơn hàng
router.get("/", (req, res) => {
  const sql = `
    SELECT o.OrderID, c.FullName AS CustomerName, c.Phone AS CustomerPhone, o.OrderDate, o.Total, o.Status
    FROM \`Order\` o
    JOIN Customer c ON o.CustomerID = c.CustomerID
    ORDER BY o.OrderDate DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// 2. Lấy chi tiết một đơn hàng
router.get("/:orderID", (req, res) => {
  const { orderID } = req.params;

  const sqlOrder = `
    SELECT o.OrderID, o.OrderDate, o.Total, o.Status,
           c.FullName AS CustomerName, c.Phone AS CustomerPhone, c.Address AS CustomerAddress
    FROM \`Order\` o
    JOIN Customer c ON o.CustomerID = c.CustomerID
    WHERE o.OrderID = ?
  `;

  const sqlProducts = `
    SELECT p.ProductName, od.Quantity, od.UnitPrice, (od.Quantity * od.UnitPrice) AS TotalPrice
    FROM OrderDetail od
    JOIN Product p ON od.ProductID = p.ProductID
    WHERE od.OrderID = ?
  `;

  db.query(sqlOrder, [orderID], (err, orderResult) => {
    if (err) return res.status(500).json({ error: err });
    if (orderResult.length === 0)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    db.query(sqlProducts, [orderID], (err2, productResult) => {
      if (err2) return res.status(500).json({ error: err2 });

      const orderDetail = {
        maDonHang: orderResult[0].OrderID,
        trangThai: orderResult[0].Status,
        khachHang: {
          ten: orderResult[0].CustomerName,
          sdt: orderResult[0].CustomerPhone,
          diachi: orderResult[0].CustomerAddress,
        },
        ngayTao: orderResult[0].OrderDate,
        tongTien: orderResult[0].Total,
        sanPham: productResult.map((p) => ({
          ten: p.ProductName,
          soluong: p.Quantity,
          dongia: p.UnitPrice,
          thanhtien: p.TotalPrice,
        })),
      };

      res.json(orderDetail);
    });
  });
});

// 3. Xác nhận đơn hàng đã tiếp nhận
router.put("/:orderID/confirm", (req, res) => {
  const { orderID } = req.params;
  const sqlUpdate = `UPDATE \`Order\` SET Status='Đang xử lý' WHERE OrderID=?`;

  db.query(sqlUpdate, [orderID], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json({ message: "Xác nhận thành công, trạng thái đã chuyển sang 'Đang xử lý'" });
  });
});

// 3.1. Xác nhận đơn hàng đang xử lý
router.put("/:orderID/complete", (req, res) => {
  const { orderID } = req.params;
  const sqlUpdate = `UPDATE \`Order\` SET Status='Hoàn thành' WHERE OrderID=?`;

  db.query(sqlUpdate, [orderID], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json({ message: "Đơn hàng đã hoàn thành" });
  });
});

// 4. Hủy đơn hàng
router.put("/:orderID/cancel", (req, res) => {
  const { orderID } = req.params;
  const sqlUpdate = `UPDATE \`Order\` SET Status='Đã hủy' WHERE OrderID=?`;

  db.query(sqlUpdate, [orderID], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json({ message: "Hủy đơn hàng thành công" });
  });
});

// Tạo đơn hàng mới
router.post("/", async (req, res) => {
  const { khachHang, sanPham } = req.body;

  if (!khachHang || !sanPham || sanPham.length === 0) {
    return res.status(400).json({ message: "Dữ liệu đơn hàng không hợp lệ" });
  }

  try {
    let customerID;

    // 1️ Kiểm tra khách hàng theo Phone
    const sqlCheckCustomer = `SELECT CustomerID FROM Customer WHERE Phone = ?`;
    const existingCustomer = await new Promise((resolve, reject) => {
      db.query(sqlCheckCustomer, [khachHang.sdt], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });

    if (existingCustomer) {
      customerID = existingCustomer.CustomerID;
    } else {
      // 2️ Thêm khách hàng mới
      const sqlInsertCustomer = `INSERT INTO Customer (FullName, Phone, Email, Address) VALUES (?, ?, ?, ?)`;
      const result = await new Promise((resolve, reject) => {
        db.query(
          sqlInsertCustomer,
          [
            khachHang.ten,
            khachHang.sdt,
            khachHang.email || null,
            khachHang.diachi,
          ],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
      customerID = result.insertId;
    }

    // 3️ Lọc sản phẩm hợp lệ
    const sanPhamHopLe = sanPham.filter((sp) => sp.ProductID && sp.soluong > 0);
    if (sanPhamHopLe.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm hợp lệ để tạo đơn" });
    }

    // 4️ Tính tổng tiền
    const total = sanPhamHopLe.reduce(
      (sum, sp) => sum + sp.soluong * sp.dongia,
      0
    );

    // 5️ Thêm đơn hàng
    const sqlInsertOrder = `INSERT INTO \`Order\` (CustomerID, Total, Status) VALUES (?, ?, 'Đã tiếp nhận')`;
    const orderResult = await new Promise((resolve, reject) => {
      db.query(sqlInsertOrder, [customerID, total], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const orderID = orderResult.insertId;

    // 6️ Thêm chi tiết đơn hàng
    const sqlInsertDetail = `INSERT INTO OrderDetail (OrderID, ProductID, Quantity, UnitPrice) VALUES ?`;
    const values = sanPhamHopLe.map((sp) => [
      orderID,
      sp.ProductID,
      sp.soluong,
      sp.dongia,
    ]);

    await new Promise((resolve, reject) => {
      db.query(sqlInsertDetail, [values], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(201).json({ message: "Tạo đơn hàng thành công", orderID });
  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Tạo đơn hàng thất bại", error: err.message });
  }
});

// Xóa đơn hàng
router.delete("/:orderID", (req, res) => {
  const { orderID } = req.params;

  // Xóa chi tiết đơn hàng trước
  const sqlDeleteDetail = `DELETE FROM OrderDetail WHERE OrderID = ?`;
  db.query(sqlDeleteDetail, [orderID], (err) => {
    if (err) return res.status(500).json({ message: err.message });

    // Xóa đơn hàng
    const sqlDeleteOrder = `DELETE FROM \`Order\` WHERE OrderID = ?`;
    db.query(sqlDeleteOrder, [orderID], (err2, result) => {
      if (err2) return res.status(500).json({ message: err2.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

      res.json({ message: "Xóa đơn hàng thành công" });
    });
  });
});

export default router;
