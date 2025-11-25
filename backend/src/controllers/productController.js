import db from "../config/db.js";

// 📋 Lấy danh sách sản phẩm
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

// ➕ Thêm sản phẩm
export const addProduct = (req, res) => {
  let { ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive } = req.body;

  console.log("📦 Dữ liệu nhận được:", req.body);

  // 🧠 Quy tắc: Nếu hết hàng thì ẩn sản phẩm
  if (Stock === 0) {
    IsActive = 0;
  }

  const sql = `
    INSERT INTO Product (ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive],
    (err, result) => {
      if (err) {
        console.error("❌ Lỗi SQL khi thêm sản phẩm:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ Thêm sản phẩm thành công!", id: result.insertId });
    }
  );
};

// ✏️ Cập nhật sản phẩm
export const updateProduct = (req, res) => {
  const { id } = req.params;
  let { ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive } = req.body;

  // 🧠 Quy tắc: Nếu hết hàng thì tự động ẩn
  if (Stock === 0) {
    IsActive = 0;
  }

  const sql = `
    UPDATE Product 
    SET ProductName=?, Price=?, Description=?, Image=?, CategoryID=?, Stock=?, WarningStock=?, IsActive=?
    WHERE ProductID=?
  `;

  db.query(
    sql,
    [ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Cập nhật sản phẩm thành công!" });
    }
  );
};

// 🗑️ Xóa sản phẩm
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Product WHERE ProductID=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa sản phẩm thành công!" });
  });
};

// 🔘 Toggle trạng thái hiển thị
export const toggleProductStatus = (req, res) => {
  const { id } = req.params;

  // Lấy trạng thái hiện tại rồi đảo ngược
  const sqlSelect = "SELECT IsActive, Stock FROM Product WHERE ProductID=?";
  db.query(sqlSelect, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

    const row = results[0];
    const currentStatus = row.IsActive ? row.IsActive[0] : 0;

    // 🧠 Nếu hết hàng thì không cho bật hiển thị
    if (row.Stock === 0 && currentStatus === 0) {
      return res.status(400).json({ error: "Sản phẩm hết hàng, không thể bật hiển thị!" });
    }

    const newStatus = currentStatus ? 0 : 1;

    const sqlUpdate = "UPDATE Product SET IsActive=? WHERE ProductID=?";
    db.query(sqlUpdate, [newStatus, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ ProductID: id, IsActive: newStatus });
    });
  });
};
// 📦 Cập nhật tồn kho (nhập/xuất)
export const updateStock = (req, res) => {
  const { id } = req.params;
  const { quantity, type } = req.body;

  if (quantity === undefined || type === undefined) {
    return res.status(400).json({ error: "Thiếu quantity hoặc type" });
  }

  const sqlSelect = "SELECT Stock FROM Product WHERE ProductID=?";
  db.query(sqlSelect, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

    const currentStock = results[0].Stock;
    const newStock = currentStock + quantity;

    if (newStock < 0) {
      return res.status(400).json({ error: "Không thể trừ vượt quá tồn kho!" });
    }

    const sqlUpdate = "UPDATE Product SET Stock=? WHERE ProductID=?";
    db.query(sqlUpdate, [newStock, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ ProductID: id, Stock: newStock, type });
    });
  });
};
