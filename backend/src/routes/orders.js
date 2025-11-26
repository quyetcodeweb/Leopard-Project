import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Tạo đơn hàng mới
router.post("/", async (req, res) => {
  const { khachHang, sanPham } = req.body;

  if (!khachHang || !khachHang.ten || !khachHang.sdt || !khachHang.diachi) {
    return res.status(400).json({ message: "Tạo đơn hàng thất bại" });
  }

  try {
    // 1️⃣ Kiểm tra khách hàng theo số điện thoại
    db.query(
      "SELECT CustomerID FROM Customer WHERE Phone = ?",
      [khachHang.sdt],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Tạo đơn hàng thất bại" });

        let customerId;

        const proceedWithOrder = () => {
          // Lọc sản phẩm hợp lệ: Quantity > 0
          const sanPhamHopLe = sanPham.filter(sp => sp.soluong > 0);

          if (sanPhamHopLe.length === 0)
            return res.status(400).json({ message: "Tạo đơn hàng thất bại" });

          // Tính tổng tiền
          const total = sanPhamHopLe.reduce(
            (sum, sp) => sum + sp.soluong * (sp.dongia || 0),
            0
          );

          // 2️⃣ Insert vào bảng `Order`
          const sqlOrder = `
            INSERT INTO \`Order\` (CustomerID, Total, Status)
            VALUES (?, ?, 'Đã tiếp nhận')
          `;
          db.query(sqlOrder, [customerId, total], (err2, resultOrder) => {
            if (err2) return res.status(500).json({ message: "Tạo đơn hàng thất bại" });

            const orderId = resultOrder.insertId;

            // 3️⃣ Lấy ProductID từ tên sản phẩm
            const productNames = sanPhamHopLe.map(sp => sp.ten);
            db.query(
              `SELECT ProductID, ProductName, Price FROM Product WHERE ProductName IN (?)`,
              [productNames],
              (err3, productsFromDB) => {
                if (err3) return res.status(500).json({ message: "Tạo đơn hàng thất bại" });

                // 4️⃣ Map ProductID cho chi tiết
                const orderDetails = sanPhamHopLe.map(sp => {
                  const prod = productsFromDB.find(p => p.ProductName === sp.ten);
                  return [
                    orderId,
                    prod ? prod.ProductID : null,
                    sp.soluong,
                    sp.dongia || (prod ? prod.Price : 0)
                  ];
                }).filter(od => od[1] !== null); // loại bỏ sp không tồn tại

                if (orderDetails.length === 0)
                  return res.status(400).json({ message: "Tạo đơn hàng thất bại" });

                // 5️⃣ Insert vào OrderDetail
                const sqlDetail = `
                  INSERT INTO OrderDetail (OrderID, ProductID, Quantity, UnitPrice)
                  VALUES ?
                `;
                db.query(sqlDetail, [orderDetails], err4 => {
                  if (err4) return res.status(500).json({ message: "Tạo đơn hàng thất bại" });

                  return res.json({ message: "Tạo đơn hàng thành công", orderId });
                });
              }
            );
          });
        };

        if (result.length > 0) {
          // Khách hàng đã tồn tại
          customerId = result[0].CustomerID;
          proceedWithOrder();
        } else {
          // Tạo khách hàng mới
          const sqlKH = `
            INSERT INTO Customer (FullName, Phone, Address, Email)
            VALUES (?, ?, ?, ?)
          `;
          db.query(
            sqlKH,
            [
              khachHang.ten,
              khachHang.sdt,
              khachHang.diachi || null,
              khachHang.email || null
            ],
            (errKH, resultKH) => {
              if (errKH) return res.status(500).json({ message: "Tạo đơn hàng thất bại" });

              customerId = resultKH.insertId;
              proceedWithOrder();
            }
          );
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Tạo đơn hàng thất bại" });
  }
});

export default router;
