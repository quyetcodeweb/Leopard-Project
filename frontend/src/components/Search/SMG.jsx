import React, { useEffect, useState } from "react";
import axios from "axios";

const SMG = () => {
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [total, setTotal] = useState(0);

  // Gọi API
  const fetchVouchers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vouchers", {
        params: {
          search,
          status,
          type,
        },
      });

      setVouchers(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Lỗi khi tải voucher:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Xóa bộ lọc
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    fetchVouchers();
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-3">Tìm kiếm & Lọc mã giảm giá</h3>

      {/* Bộ lọc */}
      <div className="card p-3 mb-4 shadow-sm">

        <div className="row g-3">

          {/* Tìm kiếm */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Tìm theo mã</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập mã voucher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lọc trạng thái */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Trạng thái</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="unused">Chưa áp dụng</option>
            </select>
          </div>

          {/* Lọc loại giảm giá */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Loại giảm giá</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="percent">Giảm theo %</option>
              <option value="fixed">Giảm số tiền cố định</option>
            </select>
          </div>

        </div>

        {/* Nút tác vụ */}
        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={fetchVouchers}>
            Tìm kiếm
          </button>
          <button className="btn btn-secondary" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Kết quả */}
      <div className="d-flex justify-content-between mb-2">
        <h5>Kết quả tìm được: {total}</h5>
      </div>

      {/* Bảng voucher */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Mã</th>
            <th>Giảm (%)</th>
            <th>Ngày hết hạn</th>
            <th>Số lần dùng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {vouchers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            vouchers.map((item) => (
              <tr key={item.VoucherID}>
                <td>{item.Code}</td>
                <td>{item.DiscountPercent}%</td>
                <td>{new Date(item.ExpirationDate).toLocaleDateString()}</td>
                <td>{item.UsedCount} / {item.MaxUse}</td>
                <td>
                  <span
                    className={
                      item.Status === "Hoạt động"
                        ? "badge bg-success"
                        : item.Status === "Hết hạn"
                        ? "badge bg-danger"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {item.Status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SMG;
