import React, { useState, useEffect } from "react";
import axios from "axios";

const Chitietdonhang = ({ orderID, onClose }) => {
  const [donHang, setDonHang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/donhang/${orderID}`);
        setDonHang(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải chi tiết đơn hàng");
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderID]);

  if (loading) return <div className="text-center mt-5">Đang tải chi tiết đơn hàng...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!donHang) return <div className="text-center mt-5">Không tìm thấy đơn hàng.</div>;

  const formatCurrency = (amount) => (amount || 0).toLocaleString("vi-VN") + "₫";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        className="container bg-white p-4 shadow rounded"
        style={{
          width: "90%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <h2 className="text-center mb-5 fw-bold">Chi tiết đơn hàng</h2>

        {/* Thông tin chung */}
        <div className="row mb-4" style={{ fontSize: "1rem" }}>
          <div className="col-8">
            <div className="mb-1"><strong>Khách hàng:</strong> <span className="ms-1">{donHang.khachHang.ten}</span></div>
            <div className="mb-1"><strong>Số điện thoại:</strong> <span className="ms-1">{donHang.khachHang.sdt}</span></div>
            <div className="mb-1"><strong>Địa chỉ:</strong> <span className="ms-1">{donHang.khachHang.diachi}</span></div>
            <div className="mb-1"><strong>Ngày tạo:</strong> <span className="ms-1">{new Date(donHang.ngayTao).toLocaleString("vi-VN", { hour12: false })}</span></div>
          </div>

          <div className="col-4 text-end">
            <div className="mb-2">
              <strong>Mã đơn hàng:</strong>{" "}
              <span className="fw-bold text-dark">{donHang.maDonHang}</span>
            </div>

            {/* Trạng thái và nút xử lý */}
            <div className="d-flex flex-column align-items-start mb-3">
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">Trạng thái:</strong>
                <input
                  type="text"
                  className="form-control form-control-sm fw-bold text-center text-dark"
                  value={donHang.trangThai}
                  readOnly
                  style={{
                    width: 140,
                    backgroundColor: "#f8f9fa",
                    fontSize: "1rem",
                    border: "1px solid #ced4da",
                  }}
                />
              </div>

              {/* Nút Xác nhận / Hủy chỉ khi Đang xử lý */}
              {donHang.trangThai === "Đang xử lý" && (
                <div className="d-flex gap-2">
                  {/* Nút Xác nhận */}
              {/* Nút Xác nhận */}
              <button
                className="btn"
                style={{ backgroundColor: "#198754", color: "white" }}
                onClick={async () => {
                  try {
                    await axios.put(
                      `http://localhost:5000/api/deliver/${donHang.maDonHang}/complete`
                    );
                    alert("Đơn hàng đã hoàn thành");
                    window.location.reload(); // reload trang sau khi xác nhận
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.message || "Lỗi khi xác nhận đơn hàng!");
                  }
                }}
              >
                Xác nhận
              </button>

              {/* Nút Hủy */}
              <button
                className="btn"
                style={{
                  backgroundColor: "#BD0C0C",
                  color: "white",
                  fontWeight: "500",
                  width: "107px",
                  height: "37px",
                }}
                onClick={async () => {
                  try {
                    await axios.put(
                      `http://localhost:5000/api/donhang/${donHang.maDonHang}/cancel`
                    );
                    alert("Đơn hàng đã hủy");
                    window.location.reload(); // reload trang sau khi hủy
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.message || "Lỗi khi hủy đơn hàng!");
                  }
                }}
              >
                Hủy
              </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="table-responsive" style={{ overflowX: "auto", paddingRight: "15px" }}>
          <table className="table table-striped" style={{ border: "1px solid #dee2e6" }}>
            <thead>
              <tr style={{ backgroundColor: "#F5F5F5", borderBottom: "2px solid #dee2e6" }}>
                <th style={{ textAlign: "left", paddingLeft: "12px", fontSize: "1.1rem", fontWeight: "600" }}>Sản phẩm</th>
                <th style={{ textAlign: "center", fontSize: "1.1rem", fontWeight: "600", width: "15%" }}>Số lượng</th>
                <th style={{ textAlign: "right", fontSize: "1.1rem", fontWeight: "600", width: "20%", paddingRight: "12px" }}>Đơn giá</th>
                <th style={{ textAlign: "right", fontSize: "1.1rem", fontWeight: "600", width: "20%", paddingRight: "12px" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {donHang.sanPham.map((sp, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "left", fontSize: "1rem", paddingLeft: "12px" }}>{sp.ten}</td>
                  <td style={{ textAlign: "center", fontSize: "1rem" }}>{sp.soluong}</td>
                  <td style={{ textAlign: "right", fontSize: "1rem", paddingRight: "12px" }}>{formatCurrency(sp.dongia)}</td>
                  <td style={{ textAlign: "right", fontSize: "1rem", paddingRight: "12px", fontWeight: "500" }}>{formatCurrency(sp.thanhtien)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng cộng và nút quay lại */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
          <h4 className="mb-0 fw-bold" style={{ color: "#198754" }}>
            Tổng: {formatCurrency(donHang.tongTien)}
          </h4>
          <button
            className="btn btn-light"
            onClick={onClose}
            style={{ border: "1px solid #6C757D", color: "#6C757D" }}
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chitietdonhang;
