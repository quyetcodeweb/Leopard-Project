import React, { useState, useEffect } from "react";
import axios from "axios";
import ChiTietlsDonHang from "../../pages/QLDH/Chitietlsdonhang";
import "./Lichsudonhang.css";

const Lichsudonhang = () => {
  const [donHangList, setDonHangList] = useState([]);
  const [searchMa, setSearchMa] = useState("");
  const [searchNgay, setSearchNgay] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donhang");
      // Lọc chỉ những đơn 'Đã giao' hoặc 'Đã hủy'
      const filtered = res.data.filter(
        (don) => don.Status === "Hoàn thành" || don.Status === "Đã hủy"
      );
      setDonHangList(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Lấy danh sách đơn hàng thất bại");
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchMa && !searchNgay) return fetchData();

      const res = await axios.get("http://localhost:5000/api/donhang/search", {
        params: { ma: searchMa, ngay: searchNgay },
      });

      const filtered = res.data.filter(
        (don) => don.Status === "Hoàn thành" || don.Status === "Đã hủy"
      );
      setDonHangList(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Tìm kiếm thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (orderID) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderID}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/donhang/${orderID}`);
      setDonHangList(prev => prev.filter(don => don.OrderID !== orderID));
      alert(`Đơn hàng ${orderID} đã được xóa.`);
    } catch (err) {
      console.error(err);
      alert("Xóa đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  // Phân trang
  const totalPages = Math.ceil(donHangList.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = donHangList.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", { hour12: false });

  return (
    <div className="lichsu-container">
      <div className="lichsu-frame">

        {/* Thanh tìm kiếm giống Donhang */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm mã..."
            value={searchMa}
            onChange={(e) => setSearchMa(e.target.value)}
          />
          <input
            type="date"
            value={searchNgay}
            onChange={(e) => setSearchNgay(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Tìm kiếm</button>
        </div>

        <div className="table-wrapper">
          <table className="table table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thùng rác</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((don) => (
                  <tr
                    key={don.OrderID}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedOrderID(don.OrderID)}
                  >
                    <td>{don.OrderID}</td>
                    <td>{formatDateTime(don.OrderDate)}</td>
                    <td>{don.Status}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(don.OrderID); }}
                        aria-label={`Xóa đơn hàng ${don.OrderID}`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-wrapper">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <span
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >&lt;</span>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  <span className="page-link">{i + 1}</span>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <span
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >&gt;</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {selectedOrderID && (
        <ChiTietlsDonHang
          orderID={selectedOrderID}
          onClose={() => setSelectedOrderID(null)}
        />
      )}
    </div>
  );
};

export default Lichsudonhang;
