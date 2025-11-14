import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Chitietlsdonhang = ({ orderID, onClose }) => {
  const [donHang, setDonHang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const printRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/donhang/${orderID}`);
        const data = res.data;

        // Chỉ hiển thị 2 trạng thái: "Đã giao" hoặc "Đã hủy"
        const trangThaiHienThi = data.Status === "Đã hủy" ? "Đã hủy" : "Đã giao";

        setDonHang({ ...data, trangThai: trangThaiHienThi });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải chi tiết đơn hàng");
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderID]);

  const formatCurrency = (amount) => (amount || 0).toLocaleString("vi-VN") + "₫";

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const element = printRef.current;

    const buttons = element.querySelectorAll("button");
    buttons.forEach(btn => btn.style.display = "none");

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DonHang_${donHang.maDonHang}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Xuất PDF thất bại");
    }

    buttons.forEach(btn => btn.style.display = "inline-block");
  };

  const handlePrint = () => {
    alert("Vui lòng kết nối với thiết bị in phù hợp để in đơn hàng!");
  };

  if (loading) return <div className="text-center mt-5">Đang tải chi tiết đơn hàng...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!donHang) return <div className="text-center mt-5">Không tìm thấy đơn hàng.</div>;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
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
        ref={printRef}
        className="container bg-white p-4 shadow rounded"
        style={{
          width: "90%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto",
          animation: "fadeIn 0.3s ease"
        }}
      >
        <h2 className="text-center mb-5 fw-bold">Chi tiết đơn hàng</h2>

        <div className="row mb-4" style={{ fontSize: "1rem" }}>
          {/* Cột trái: thông tin khách hàng */}
          <div className="col-8">
            <div><strong>Khách hàng:</strong> {donHang.khachHang.ten}</div>
            <div><strong>SĐT:</strong> {donHang.khachHang.sdt}</div>
            <div><strong>Địa chỉ:</strong> {donHang.khachHang.diachi}</div>
          </div>

          {/* Cột phải: mã đơn hàng, trạng thái, ngày tạo */}
          <div className="col-4 text-end d-flex flex-column justify-content-center" style={{ gap: "0.5rem" }}>
            <div><strong>Mã đơn hàng:</strong> {donHang.maDonHang}</div>
            <div><strong>Trạng thái:</strong> {donHang.trangThai}</div>
            <div><strong>Ngày tạo:</strong> {new Date(donHang.ngayTao).toLocaleString("vi-VN")}</div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr style={{ backgroundColor: "#F5F5F5" }}>
                <th>Sản phẩm</th>
                <th className="text-center">Số lượng</th>
                <th className="text-end">Đơn giá</th>
                <th className="text-end">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {donHang.sanPham.map((sp, idx) => (
                <tr key={idx}>
                  <td>{sp.ten}</td>
                  <td className="text-center">{sp.soluong}</td>
                  <td className="text-end">{formatCurrency(sp.dongia)}</td>
                  <td className="text-end">{formatCurrency(sp.thanhtien)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
          <h4 className="fw-bold text-success">Tổng: {formatCurrency(donHang.tongTien)}</h4>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={onClose}>Quay lại</button>
            <button className="btn btn-success text-white" onClick={handleDownloadPDF}>Tải PDF</button>
            <button className="btn btn-primary text-white" onClick={handlePrint}>In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chitietlsdonhang;
