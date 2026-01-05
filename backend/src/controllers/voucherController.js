import db from "../config/db.js";
import { createAuditLog } from "../services/auditLog.service.js";

const toSQLDateTime = (dt) => {
  if (!dt) return null;
  let d = dt.trim();
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(d)) return `${d}:00`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d} 00:00:00`;
  if (/\d{4}-\d{2}-\d{2}T/.test(d)) {
    d = d.replace("T", " ").replace("Z", "");
    d = d.split(".")[0];
    return d;
  }
  return d;
};

const computeStatusSQL = `CASE
  WHEN StartDate IS NOT NULL AND NOW() < StartDate THEN 2
  WHEN ExpirationDate IS NOT NULL AND NOW() > ExpirationDate THEN 3
  ELSE 1
END`;

// =====================
// GET LIST + FILTER (NO LOG)
// =====================
export const getVouchers = (req, res) => {
  const { search = "", type = "", status = "", start = "", end = "" } = req.query;

  let sql = `
    SELECT
      VoucherID,
      Code,
      DiscountPercent,
      DiscountAmount,
      StartDate,
      ExpirationDate,
      MaxUse,
      UsedCount,
      COALESCE(Status, ${computeStatusSQL}) AS Status
    FROM Voucher
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += " AND Code LIKE ?";
    params.push(`%${search}%`);
  }

  if (type === "%") sql += " AND DiscountPercent > 0";
  if (type === "VND") sql += " AND DiscountAmount > 0";

  if (start) {
    sql += " AND StartDate >= ?";
    params.push(start);
  }

  if (end) {
    sql += " AND ExpirationDate <= ?";
    params.push(end);
  }

  if (status) {
    sql += " AND COALESCE(Status, " + computeStatusSQL + ") = ?";
    params.push(Number(status));
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", err });
    res.json(result);
  });
};

// =====================
// CREATE (CÓ LOG)
// =====================
export const addVoucher = (req, res) => {
  const { code, type, discountValue, startDate, expirationDate, maxUse, status } = req.body;

  if (!code || discountValue === undefined || !expirationDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let discountPercent = 0;
  let discountAmount = 0;

  if (type === "%") discountPercent = Number(discountValue);
  if (type === "VND") discountAmount = Number(discountValue);

  const newVoucher = {
    Code: code,
    DiscountPercent: discountPercent,
    DiscountAmount: discountAmount,
    StartDate: toSQLDateTime(startDate),
    ExpirationDate: toSQLDateTime(expirationDate),
    MaxUse: Number(maxUse ?? 1),
    Status: status !== undefined ? Number(status) : 1
  };

  const sql = `
    INSERT INTO Voucher
    (Code, DiscountPercent, DiscountAmount, StartDate, ExpirationDate, MaxUse, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    Object.values(newVoucher),
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", err });

      // ✅ AUDIT LOG
      createAuditLog({
        userId: req.user?.id,
        username: req.user?.username,
        role: req.user?.role,
        action: "CREATE",
        entity: "voucher",
        entityId: result.insertId,
        oldValue: null,
        newValue: newVoucher,
        req
      });

      res.status(201).json({ message: "Voucher created" });
    }
  );
};

// =====================
// UPDATE (CÓ LOG)
// =====================
export const updateVoucher = (req, res) => {
  const { id } = req.params;
  const { code, type, discountValue, startDate, expirationDate, maxUse, status } = req.body;

  let discountPercent = 0;
  let discountAmount = 0;

  if (type === "%") discountPercent = Number(discountValue);
  if (type === "VND") discountAmount = Number(discountValue);

  // Lấy dữ liệu cũ
  db.query(
    "SELECT * FROM Voucher WHERE VoucherID = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!rows.length) return res.status(404).json({ message: "Voucher not found" });

      const oldVoucher = rows[0];

      const newVoucher = {
        Code: code,
        DiscountPercent: discountPercent,
        DiscountAmount: discountAmount,
        StartDate: toSQLDateTime(startDate),
        ExpirationDate: toSQLDateTime(expirationDate),
        MaxUse: Number(maxUse),
        Status: Number(status)
      };

      const sql = `
        UPDATE Voucher
        SET Code=?, DiscountPercent=?, DiscountAmount=?, StartDate=?, ExpirationDate=?, MaxUse=?, Status=?
        WHERE VoucherID=?
      `;

      db.query(
        sql,
        [...Object.values(newVoucher), id],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Server error" });

          // ✅ AUDIT LOG
          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "UPDATE",
            entity: "voucher",
            entityId: id,
            oldValue: oldVoucher,
            newValue: newVoucher,
            req
          });

          res.json({ message: "Voucher updated successfully" });
        }
      );
    }
  );
};

// =====================
// DELETE (CÓ LOG)
// =====================
export const deleteVoucher = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM Voucher WHERE VoucherID = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!rows.length) return res.status(404).json({ message: "Voucher not found" });

      const oldVoucher = rows[0];

      db.query(
        "DELETE FROM Voucher WHERE VoucherID = ?",
        [id],
        (err2, result) => {
          if (err2) return res.status(500).json({ message: "Server error" });

          // ✅ AUDIT LOG
          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "DELETE",
            entity: "voucher",
            entityId: id,
            oldValue: oldVoucher,
            newValue: null,
            req
          });

          res.json({ message: "Voucher deleted", affectedRows: result.affectedRows });
        }
      );
    }
  );
};

// =====================
// APPLY (NO LOG)
// =====================
export const applyVoucher = (req, res) => {
  const { code } = req.body;
  db.query("SELECT * FROM Voucher WHERE Code = ?", [code], (err, rows) => {
    if (err || !rows.length)
      return res.status(404).json({ message: "Voucher not found" });
    res.json(rows[0]);
  });
};
