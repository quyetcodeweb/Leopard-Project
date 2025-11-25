import React, { useEffect, useState } from "react";
import axios from "axios";
import AddVoucherModal from "./AddVoucherModal";
import EditVoucherModal from "./EditVoucherModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./VoucherManager.css";

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/vouchers");
      setVouchers(res.data);
    } catch (err) {
      console.error("loadVouchers error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const filtered = vouchers.filter((v) => {
    if (search && !v.Code.toLowerCase().includes(search.toLowerCase())) return false;
    if (startDate && v.StartDate?.slice(0, 10) < startDate) return false;
    if (endDate && v.ExpirationDate?.slice(0, 10) > endDate) return false;

    if (typeFilter !== "all") {
      if (typeFilter === "percent" && v.DiscountPercent <= 0) return false;
      if (typeFilter === "cash" && v.DiscountPercent > 0) return false;
    }

    if (statusFilter !== "all" && `${v.Status}` !== statusFilter) return false;

    return true;
  });

  const onOpenDelete = (v) => setDeleteTarget(v);
  const onOpenEdit = (v) => setOpenEdit(v);

  const handleDelete = async (voucherId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vouchers/${voucherId}`);
      alert("Xóa mã giảm giá thành công");
      setDeleteTarget(null);
      loadVouchers();
    } catch (err) {
      console.error("delete error", err);
      alert("Lỗi khi xóa");
    }
  };

  const getStatusText = (s) => {
    if (s == 1) return "Hoạt động";
    if (s == 2) return "Chưa áp dụng";
    if (s == 3) return "Hết hạn";
    return s;
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="voucher-container">
      <h2 className="voucher-title">Quản lý mã giảm giá</h2>

      {/* HÀNG TRÊN: TÌM KIẾM + BUTTON */}
      <div className="top-row">
        <div className="top-left">
          <input
            className="search-input"
            placeholder="🔍  Tìm kiếm ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="top-right">
          <button className="clear-filter" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
          <button className="add-btn" onClick={() => setOpenAdd(true)}>
            + Thêm mã giảm giá
          </button>
        </div>
      </div>

      {/* HÀNG DƯỚI: BỘ LỌC */}
      <div className="filter-row">
        <div className="date-group">
          <label>Ngày bắt đầu</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="date-group">
          <label>Ngày kết thúc</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="select-group">
          <label>Loại</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="percent">% </option>
            <option value="cash">VND</option>
          </select>
        </div>

        <div className="select-group">
          <label>Trạng thái</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="1">Hoạt động</option>
            <option value="2">Chưa áp dụng</option>
            <option value="3">Hết hạn</option>
          </select>
        </div>
      </div>

      {/* BẢNG */}
      <table className="voucher-table">
        <thead>
          <tr>
            <th> </th> {/* EDIT ICON ĐẦU DÒNG */}
            <th>STT</th>
            <th>Mã</th>
            <th>Loại</th>
            <th>Giá trị</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th> </th> {/* DELETE ICON CUỐI DÒNG */}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>Đang tải...</td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>Không có dữ liệu</td>
            </tr>
          ) : (
            filtered.map((v, i) => (
              <tr key={v.VoucherID}>

                {/* EDIT ICON */}
                <td className="action-cell">
                  <button className="icon-btn" onClick={() => onOpenEdit(v)}>
                    <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                </td>

                <td>{i + 1}</td>
                <td>{v.Code}</td>
                <td>{v.DiscountPercent > 0 ? "%" : "VND"}</td>
                <td>{v.DiscountPercent > 0 ? `${v.DiscountPercent}%` : v.Value ? `${v.Value}đ` : "-"}</td>
                <td>{v.StartDate?.slice(0, 10)}</td>
                <td>{v.ExpirationDate?.slice(0, 10)}</td>
                <td>{getStatusText(v.Status)}</td>

                {/* DELETE ICON */}
                <td className="action-cell">
                  <button className="icon-btn" onClick={() => onOpenDelete(v)}>
                    <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6m5 0V4h4v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODALS */}
      {openAdd && (
        <AddVoucherModal
          onClose={() => {
            setOpenAdd(false);
            loadVouchers();
          }}
          onSuccess={() => loadVouchers()}
        />
      )}

      {openEdit && (
        <EditVoucherModal
          voucher={openEdit}
          onClose={() => setOpenEdit(null)}
          onSuccess={() => loadVouchers()}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          voucher={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.VoucherID)}
        />
      )}
    </div>
  );
};

export default VoucherManager;
