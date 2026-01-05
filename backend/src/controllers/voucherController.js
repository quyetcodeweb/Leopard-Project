import db from "../config/db.js";

/* =====================
   UTIL
===================== */
const toSQLDateTime = (dt) => {
  if (!dt) return null;
  let d = dt.trim();

  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(d)) return `${d}:00`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d} 00:00:00`;

  if (/\d{4}-\d{2}-\d{2}T/.test(d)) {
    d = d.replace("T", " ").replace("Z", "");
    return d.split(".")[0];
  }
  return d;
};

const computeStatusSQL = `CASE
  WHEN StartDate IS NOT NULL AND NOW() < StartDate THEN 2
  WHEN ExpirationDate IS NOT NULL AND NOW() > ExpirationDate THEN 3
  ELSE 1
END`;

/* =====================
   GET LIST
===================== */
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
    if (err) {
      console.error("getVouchers error:", err);
      return res.status(500).json({ message: "Server error", err });
    }
    res.json(result);
  });
};

/* =====================
   CREATE
===================== */
export const addVoucher = (req, res) => {
  const {
    code,
    type,
    discountValue,
    startDate,
    expirationDate,
    maxUse,
    status,
  } = req.body;

  if (!code || discountValue === undefined || !expirationDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const start = startDate ? new Date(startDate) : null;
  const end = expirationDate ? new Date(expirationDate) : null;

  // ✅ RÀNG BUỘC THỜI GIAN
  if (start && !end) {
    return res.status(400).json({
      message: "Voucher phải có ngày kết thúc",
    });
  }

  if (start && end && start >= end) {
    return res.status(400).json({
      message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
    });
  }

  let discountPercent = 0;
  let discountAmount = 0;

  if (type === "%") discountPercent = Number(discountValue);
  if (type === "VND") discountAmount = Number(discountValue);

  const sql = `
    INSERT INTO Voucher
    (Code, DiscountPercent, DiscountAmount, StartDate, ExpirationDate, MaxUse, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      code,
      discountPercent,
discountAmount,
      toSQLDateTime(startDate),
      toSQLDateTime(expirationDate),
      Number(maxUse ?? 1),
      Number(status),
    ],
    (err) => {
      if (err) {
        console.error("addVoucher error:", err);
        return res.status(500).json({ message: "Server error", err });
      }
      res.status(201).json({ message: "Voucher created" });
    }
  );
};

/* =====================
   UPDATE
===================== */
export const updateVoucher = (req, res) => {
  const { id } = req.params;
  const {
    code,
    type,
    discountValue,
    startDate,
    expirationDate,
    maxUse,
    status,
  } = req.body;

  const start = startDate ? new Date(startDate) : null;
  const end = expirationDate ? new Date(expirationDate) : null;

  // ✅ RÀNG BUỘC THỜI GIAN
  if (start && !end) {
    return res.status(400).json({
      message: "Voucher phải có ngày kết thúc",
    });
  }

  if (start && end && start >= end) {
    return res.status(400).json({
      message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
    });
  }

  let discountPercent = 0;
  let discountAmount = 0;

  if (type === "%") discountPercent = Number(discountValue);
  if (type === "VND") discountAmount = Number(discountValue);

  const sql = `
    UPDATE Voucher
    SET
      Code = ?,
      DiscountPercent = ?,
      DiscountAmount = ?,
      StartDate = ?,
      ExpirationDate = ?,
      MaxUse = ?,
      Status = ?
    WHERE VoucherID = ?
  `;

  db.query(
    sql,
    [
      code,
      discountPercent,
      discountAmount,
      toSQLDateTime(startDate),
      toSQLDateTime(expirationDate),
      Number(maxUse),
      Number(status),
      id,
    ],
    (err) => {
      if (err) {
        console.error("updateVoucher error:", err);
        return res.status(500).json({ message: "Server error", err });
      }
      res.json({ message: "Voucher updated successfully" });
    }
  );
};

/* =====================
   DELETE
===================== */
export const deleteVoucher = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Voucher WHERE VoucherID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", err });
    res.json({ message: "Voucher deleted", affectedRows: result.affectedRows });
  });
};

/* =====================
   APPLY
===================== */
export const applyVoucher = (req, res) => {
  const { code } = req.body;
  db.query("SELECT * FROM Voucher WHERE Code = ?", [code], (err, rows) => {
    if (err || !rows.length) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.json(rows[0]);
  });
};