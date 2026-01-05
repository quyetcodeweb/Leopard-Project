import React, { useEffect, useState } from "react";
import "./InventoryList.css";
import { FaFileImport, FaFileExport } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import ImportPopup from "../../components/Popups/ImportPopup";
import InOutModal from "../../components/Popups/InOutModal";
import WarningPopup from "../../components/Popups/WarningPopup";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_URL = "http://localhost:5000/api/category";
const WARNING_COOLDOWN = 5 * 60 * 1000; // 5 phút
const WARNING_KEY = "inventory_warning_last_seen";

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [warnings, setWarnings] = useState([]);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  const [showInOutModal, setShowInOutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showImportPopup, setShowImportPopup] = useState(false);


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    setProducts(res.data);

    const lowStockItems = res.data.filter(
      (p) => p.Stock <= p.WarningStock
    );

    if (lowStockItems.length > 0) {
      const lastSeen = localStorage.getItem(WARNING_KEY);
      const now = Date.now();

      if (!lastSeen || now - Number(lastSeen) > WARNING_COOLDOWN) {
        setWarnings(
          lowStockItems.map((p) => ({
            id: p.ProductID,
            name: p.ProductName,
            stock: p.Stock,
          }))
        );
        setShowWarningPopup(true);
      }
    }

  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
  }
};
const handleMarkSeen = () => {
  localStorage.setItem(WARNING_KEY, Date.now().toString());
  setShowWarningPopup(false);
  setWarnings([]);
};


  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi tải category:", err);
    }
  };

  // ====== FILTER & PAGINATION ======
  const filteredProducts = products.filter(
    (p) =>
      p.ProductName.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedCategory === "all" || p.CategoryID === parseInt(selectedCategory))
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = (pageCount, currentPage) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pageCount; i++) {
      if (i === 1 || i === pageCount || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l > 2) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // ====== EXCEL EXPORT ======
  const handleExportExcel = () => {
    const data = products.map((p) => ({
      ProductID: p.ProductID,
      ProductName: p.ProductName,
      Stock: p.Stock,
      WarningStock: p.WarningStock,
      AddQuantity: "", // cột để người dùng nhập thêm/xuất
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "Inventory.xlsx");
  };

  // ====== IMPORT EXCEL ======
  const handleImportRows = async (rows) => {
    let successCount = 0;
    let errorCount = 0;
    let errorItems = [];

    for (const item of rows) {
      const id = item.ProductID ?? item.productId ?? item.id;
      let addQty = Number(item.AddQuantity ?? 0);

      if (isNaN(addQty)) {
        errorCount++;
        errorItems.push({ id, reason: "AddQuantity không hợp lệ" });
        continue;
      }

      const product = products.find((p) => String(p.ProductID) === String(id));
      if (!product) {
        errorCount++;
        errorItems.push({ id, reason: "Không tìm thấy sản phẩm" });
        continue;
      }

      if (addQty < 0 && product.Stock + addQty < 0) {
        errorCount++;
        errorItems.push({ id, reason: "Trừ vượt quá tồn kho" });
        continue;
      }

      try {
        await axios.put(`${API_URL}/${product.ProductID}/stock`, {
          quantity: addQty,
          type: addQty >= 0 ? "import" : "export",
        });
        successCount++;
      } catch (err) {
        errorCount++;
        errorItems.push({ id, reason: err.message || "Lỗi server" });
      }
    }

    await fetchProducts();
    setShowImportPopup(false);

    let message = `Nhập kho hoàn tất! ${successCount} dòng thành công.`;
    if (errorCount > 0) {
      message += ` ${errorCount} dòng lỗi.\nChi tiết:\n` + errorItems.map(e => `ID:${e.id} - ${e.reason}`).join("\n");
    }
    alert(message);
  };

  // ====== NHẬP/XUẤT QUA MODAL ======
  const handleSaveQuantity = async (product, qty) => {
    if (qty === 0) return;
    if (qty < 0 && product.Stock + qty < 0) {
      alert("Không thể trừ vượt quá tồn kho!");
      return;
    }

    try {
      await axios.put(`${API_URL}/${product.ProductID}/stock`, {
        quantity: qty,
        type: qty >= 0 ? "import" : "export",
      });
      alert("Cập nhật kho thành công!");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };
  const handlePrintReport = () => {
  const printWindow = window.open("", "_blank");

  const html = `
    <html>
      <head>
        <title>Báo cáo kiểm kê kho</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
          .low-stock { color: orange; font-weight: bold; }
          .out-of-stock { color: red; font-weight: bold; }
          .ok-stock { color: green; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Báo cáo kiểm kê kho hàng</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Danh mục</th>
              <th>Tồn kho</th>
              <th>Cảnh báo</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${p.ProductID}</td>
                <td>${p.ProductName}</td>
                <td>${categories.find(c => c.CategoryID === p.CategoryID)?.CategoryName || "Không có"}</td>
                <td>${p.Stock}</td>
                <td>
                  ${p.Stock === 0 ? '<span class="out-of-stock">Hết hàng</span>' :
                  p.Stock < p.WarningStock ? '<span class="low-stock">Sắp hết</span>' : '<span class="ok-stock">Còn hàng</span>'}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

  useEffect(() => {
    document.title = "Kho hàng | Quản lý bán hàng";
  }, []);

  return (
    <div className="inventory-page">
      <div className="inventory-toolbar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">-- Tất cả danh mục --</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.CategoryID}>
              {c.CategoryName}
            </option>
          ))}
        </select>

        <button className="btn-import-excel" onClick={() => setShowImportPopup(true)}>
          <FaFileImport /> Nhập kho Excel
        </button>
        <button className="btn-export-excel" onClick={handleExportExcel}>
          <FaFileExport /> Xuất Excel mẫu
        </button>
        <button className="btn-print-report" onClick={handlePrintReport}>
        🖨 In báo cáo
        </button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Mã SP</th>
            <th>Tên SP</th>
            <th>Danh mục</th>
            <th>Tồn kho</th>
            <th>Cảnh báo</th>
            <th>Nhập số lượng</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.ProductID}>
              <td>{p.Image ? <img src={p.Image} alt={p.ProductName} /> : <div className="no-image">No Image</div>}</td>
              <td>{p.ProductID}</td>
              <td>{p.ProductName}</td>
              <td>{categories.find((c) => c.CategoryID === p.CategoryID)?.CategoryName || "Không có"}</td>
              <td>{p.Stock}</td>
                <td>
                {p.Stock === 0 ? (
                    <span className="inv-out">❌ Hết hàng</span>
                ) : p.Stock <= p.WarningStock ? (
                    <span className="inv-warning">⚠ Sắp hết</span>
                ) : (
                    <span className="inv-ok">Còn hàng</span>
                )}
                </td>
              <td>
                <button className="btn-inout" onClick={() => { setSelectedProduct(p); setShowInOutModal(true); }}>
                  Nhập số lượng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {getPageNumbers(totalPages, currentPage).map((p, i) => (
          <button
            key={i}
            className={`page-btn ${p === currentPage ? "active" : ""}`}
            disabled={p === "..."}
            onClick={() => p !== "..." && setCurrentPage(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {showImportPopup && <ImportPopup onClose={() => setShowImportPopup(false)} onComplete={handleImportRows} />}

      {showInOutModal && selectedProduct && (
        <InOutModal
          product={selectedProduct}
          onClose={() => setShowInOutModal(false)}
          onSave={(qty) => handleSaveQuantity(selectedProduct, qty)}
        />
      )}
      {showWarningPopup && (
        <WarningPopup
            warnings={warnings}
            onClose={() => setShowWarningPopup(false)}
            onMarkSeen={handleMarkSeen}
        />
        )}
    </div>
  );
};

export default InventoryList;
