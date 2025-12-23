import db from "../config/db.js";

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

// GET LIST + FILTER  (dev truong code)
export const getVouchers = (req, res) => {
  const { search = "", type = "", status = "" } = req.query;

  // SQL gộp toàn bộ tìm kiếm vào 1 hàm duy nhất
  let sql = `
    SELECT 
      VoucherID, Code, DiscountPercent, StartDate, ExpirationDate, MaxUse, UsedCount,
      COALESCE(Status, ${computeStatusSQL}) AS Status
    FROM Voucher
    WHERE 1=1
  `;
  const params = [];

  // 1) Tìm kiếm theo mã hoặc mô tả (gộp 1 hàm duy nhất)
  if (search) {
    sql += `
      AND (Code LIKE ? OR Description LIKE ?)
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  // 2) Lọc loại giảm giá (1 hàm)
  if (type === "%") sql += " AND DiscountPercent > 0";
  if (type === "VND") sql += " AND DiscountPercent = 0";

  // 3) Lọc theo trạng thái (1 hàm)
  if (status) {
    const statusMap = {
      active: 1, "Hoạt động": 1, "hoạt động": 1,
      inactive: 2, "Chưa áp dụng": 2, "chưa áp dụng": 2,
      expired: 3, "Hết hạn": 3, "hết hạn": 3
    };
    const statusCode = statusMap[status];

    if (statusCode) {
      sql += ` AND COALESCE(Status, ${computeStatusSQL}) = ?`;
      params.push(statusCode);
    }
  }

  // Thực thi SQL
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("getVouchers error:", err);
      return res.status(500).json({ message: "Server error", err });
    }
    res.json(result);
  });
};

// CREATE NEW VOUCHER
export const addVoucher = (req, res) => {
  const {
    code, discountPercent, startDate, expirationDate, maxUse, status
  } = req.body;

  if (!code || discountPercent === undefined || !expirationDate) {
    return res.status(400).json({ message: "Missing required fields (code, discountPercent, expirationDate)" });
  }

  const vStart = toSQLDateTime(startDate);
  const vExp = toSQLDateTime(expirationDate);

  // map status numeric if passed as string
  let statusInt = null;
  if (status !== undefined) {
    statusInt = Number(status);
    if (isNaN(statusInt)) statusInt = null;
  }
  // derive if not provided
  if (statusInt === null) {
    const now = new Date();
    const s = vStart ? new Date(vStart) : null;
    const e = vExp ? new Date(vExp) : null;
    if (s && now < s) statusInt = 2;
    else if (e && now > e) statusInt = 3;
    else statusInt = 1;
  }

  const sql = `
    INSERT INTO Voucher (Code, DiscountPercent, StartDate, ExpirationDate, MaxUse, Status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [code, Number(discountPercent), vStart, vExp, Number(maxUse ?? 1), statusInt], (err, result) => {
    if (err) {
      console.error("addVoucher err", err);
      return res.status(500).json({ message: "Server error", err });
    }
    const newId = result.insertId;
    db.query("SELECT VoucherID, Code, DiscountPercent, StartDate, ExpirationDate, MaxUse, UsedCount, Status FROM Voucher WHERE VoucherID = ?", [newId], (err2, rows) => {
      if (err2) {
        console.error("addVoucher select err", err2);
        return res.status(201).json({ message: "Voucher created", VoucherID: newId });
      }
      res.status(201).json({ message: "Voucher created", voucher: rows[0] });
    });
  });
};

// UPDATE VOUCHER
export const updateVoucher = (req, res) => {
  const { id } = req.params;
  const { code, discountPercent, startDate, expirationDate, maxUse, status } = req.body;

  const vStart = toSQLDateTime(startDate);
  const vExp = toSQLDateTime(expirationDate);

  const sql = `
    UPDATE Voucher
    SET Code = ?, DiscountPercent = ?, StartDate = ?, ExpirationDate = ?, MaxUse = ?, Status = ?
    WHERE VoucherID = ?
  `;
  db.query(sql, [code, discountPercent, vStart, vExp, maxUse, status, id], (err) => {
    if (err) {
      console.error("updateVoucher error", err);
      return res.status(500).json({ message: "Server error", err });
    }
    res.json({ message: "Voucher updated successfully" });
  });
};

// DELETE VOUCHER
export const deleteVoucher = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Voucher WHERE VoucherID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("deleteVoucher err", err);
      // if foreign key prevents deletion, send meaningful message
      if (err.errno === 1451) {
        return res.status(400).json({ message: "Cannot delete voucher because it's referenced by other records" });
      }
      return res.status(500).json({ message: "Server error", err });
    }
    res.json({ message: "Voucher deleted successfully", affectedRows: result.affectedRows });
  });
};

// APPLY VOUCHER
export const applyVoucher = (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: "Missing voucher code" });

  const sql = "SELECT * FROM Voucher WHERE Code = ?";
  db.query(sql, [code], (err, rows) => {
    if (err) {
      console.error("applyVoucher err", err);
      return res.status(500).json({ message: "Server error", err });
    }
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Voucher not found" });

    const v = rows[0];

    if (v.Status !== null && v.Status !== undefined) {
      if (Number(v.Status) !== 1) {
        return res.status(400).json({ message: "Voucher is not active" });
      }
    }

    const now = new Date();
    if (v.StartDate && new Date(v.StartDate) > now) return res.status(400).json({ message: "Voucher not active yet" });
    if (v.ExpirationDate && new Date(v.ExpirationDate) < now) return res.status(400).json({ message: "Voucher expired" });

    if (v.UsedCount >= v.MaxUse) return res.status(400).json({ message: "Voucher limit reached" });

    db.query("UPDATE Voucher SET UsedCount = UsedCount + 1 WHERE VoucherID = ?", [v.VoucherID], (uErr) => {
      if (uErr) console.error("applyVoucher update usedcount err", uErr);
    });

    res.json({ message: "Voucher applied successfully", voucher: v });
  });
};
