import db from "../config/db.js";
import { createAuditLog } from "../services/auditLog.service.js";

// 📋 Lấy danh sách sản phẩm (KHÔNG LOG)
export const getProducts = (req, res) => {
  db.query("SELECT * FROM Product", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const products = results.map(p => ({
      ...p,
      IsActive: p.IsActive ? p.IsActive[0] : 0,
    }));

    res.json(products);
  });
};

// ➕ Thêm sản phẩm (CÓ LOG)
export const addProduct = (req, res) => {
  let { ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive } = req.body;

  if (Stock === 0) IsActive = 0;

  const sql = `
    INSERT INTO Product (ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      createAuditLog({
        userId: req.user?.id,
        username: req.user?.username,
        role: req.user?.role,
        action: "CREATE",
        entity: "product",
        entityId: result.insertId,
        oldValue: null,
        newValue: { ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive },
        req
      });

      res.json({ message: "✅ Thêm sản phẩm thành công!", id: result.insertId });
    }
  );
};

// ✏️ Cập nhật sản phẩm (CÓ LOG)
export const updateProduct = (req, res) => {
  const { id } = req.params;
  let { ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive } = req.body;

  if (Stock === 0) IsActive = 0;

  db.query(
    "SELECT * FROM Product WHERE ProductID=?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

      const oldProduct = rows[0];

      const sql = `
        UPDATE Product 
        SET ProductName=?, Price=?, Description=?, Image=?, CategoryID=?, Stock=?, WarningStock=?, IsActive=?
        WHERE ProductID=?
      `;

      db.query(
        sql,
        [ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive, id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "UPDATE",
            entity: "product",
            entityId: id,
            oldValue: oldProduct,
            newValue: { ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive },
            req
          });

          res.json({ message: "✅ Cập nhật sản phẩm thành công!" });
        }
      );
    }
  );
};

// 🗑️ Xóa sản phẩm (CÓ LOG)
export const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM Product WHERE ProductID=?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

      const oldProduct = rows[0];

      db.query(
        "DELETE FROM Product WHERE ProductID=?",
        [id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "DELETE",
            entity: "product",
            entityId: id,
            oldValue: oldProduct,
            newValue: null,
            req
          });

          res.json({ message: "Xóa sản phẩm thành công!" });
        }
      );
    }
  );
};

// 🔘 Toggle trạng thái (CÓ LOG)
export const toggleProductStatus = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM Product WHERE ProductID=?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

      const oldProduct = rows[0];
      const currentStatus = oldProduct.IsActive ? oldProduct.IsActive[0] : 0;

      if (oldProduct.Stock === 0 && currentStatus === 0) {
        return res.status(400).json({ error: "Sản phẩm hết hàng, không thể bật hiển thị!" });
      }

      const newStatus = currentStatus ? 0 : 1;

      db.query(
        "UPDATE Product SET IsActive=? WHERE ProductID=?",
        [newStatus, id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "UPDATE",
            entity: "product_status",
            entityId: id,
            oldValue: { IsActive: currentStatus },
            newValue: { IsActive: newStatus },
            req
          });

          res.json({ ProductID: id, IsActive: newStatus });
        }
      );
    }
  );
};

// 📦 Cập nhật tồn kho (CÓ LOG)
export const updateStock = (req, res) => {
  const { id } = req.params;
  const { quantity, type } = req.body;

  db.query(
    "SELECT Stock FROM Product WHERE ProductID=?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

      const oldStock = rows[0].Stock;
      const newStock = oldStock + quantity;

      if (newStock < 0) {
        return res.status(400).json({ error: "Không thể trừ vượt quá tồn kho!" });
      }

      db.query(
        "UPDATE Product SET Stock=? WHERE ProductID=?",
        [newStock, id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          createAuditLog({
            userId: req.user?.id,
            username: req.user?.username,
            role: req.user?.role,
            action: "UPDATE",
            entity: "product_stock",
            entityId: id,
            oldValue: { Stock: oldStock },
            newValue: { Stock: newStock, type },
            req
          });

          res.json({ ProductID: id, Stock: newStock, type });
        }
      );
    }
  );
};
