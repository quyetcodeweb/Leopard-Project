// backend/controllers/fc.js
import db from "../config/db.js";

/*
  Dev truong code:
  Chức năng: Cập nhật trạng thái voucher tự động
  1. Khi NOW() > ExpirationDate và Status != 3 => cập nhật Status = 3 (Hết hạn)
  2. Trả về danh sách voucher vừa hết hạn để frontend hiển thị alert
*/

export const updateVoucherStatus = (req, res) => {
  const selectSql = `
    SELECT VoucherID, Code 
    FROM Voucher 
    WHERE ExpirationDate <= NOW() AND Status != 3
  `;

  db.query(selectSql, (err, vouchers) => {
    if (err) {
      console.error("updateVoucherStatus select error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!vouchers || vouchers.length === 0) {
      return res.json({ message: "Không có voucher nào cần cập nhật", expiredVouchers: [] });
    }

    const voucherIds = vouchers.map(v => v.VoucherID);
    const expiredVouchers = vouchers.map(v => ({ VoucherID: v.VoucherID, Code: v.Code, message: `Mã ${v.Code} đã hết hạn` }));

    // Cập nhật tất cả cùng lúc
    const updateSql = `UPDATE Voucher SET Status = 3 WHERE VoucherID IN (?)`;
    db.query(updateSql, [voucherIds], (uErr) => {
      if (uErr) console.error("updateVoucherStatus update error:", uErr);
      // Trả về danh sách voucher đã hết hạn
      return res.json({
        message: "Cập nhật trạng thái voucher thành công",
        expiredVouchers,
      });
    });
  });
};
