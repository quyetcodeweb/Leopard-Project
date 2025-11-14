import React, { useState, useEffect } from "react";
import axios from "axios";
import ChiTietlsDonHang from "../../pages/QLDH/Chitietlsdonhang";
import "./Lichsudonhang.css";

const Lichsudonhang = () => {
  const [donHangList, setDonHangList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const itemsPerPage = 5;

  // Lấy dữ liệu khi load trang
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donhang");
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

  // Lọc theo search
  const filteredList = donHangList.filter((don) => {
    const matchesMa = don.OrderID.toString().includes(searchTerm);
    const matchesDate = searchDate ? don.OrderDate.startsWith(searchDate) : true;
    return matchesMa && matchesDate;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = async () => {
    try {
      let url = "http://localhost:5000/api/donhang";
      if (searchTerm || searchDate) url = "http://localhost:5000/api/donhang/search";

      const res = await axios.get(url, {
        params: { ma: searchTerm, ngay: searchDate },
      });

      const filtered = res.data.filter(
        (don) => don.Status === "Hoàn thành" || don.Status === "Đã hủy"
      );
      setDonHangList(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Tìm kiếm thất bại");
    }
  };

  const handleDelete = async (orderID) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderID}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/donhang/${orderID}`);
        // Xóa trên frontend sau khi xóa thành công
        setDonHangList((prev) => prev.filter((don) => don.OrderID !== orderID));
        alert(`Đơn hàng ${orderID} đã được xóa thành công.`);
      } catch (err) {
        console.error(err);
        alert("Xóa đơn hàng thất bại. Vui lòng thử lại.");
      }
    }
  };

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("vi-VN", { hour12: false });
  };

  return (
    <div className="lichsu-container">
      <div className="lichsu-frame">
        {/* Thanh tìm kiếm */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Tìm kiếm</button>
        </div>

        {/* Bảng dữ liệu */}
        <div className="table-wrapper">
          <table className="table table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Thùng rác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((don) => (
                  <tr
                    key={don.OrderID}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedOrderID(don.OrderID)}
                  >
                    <td>{don.OrderID}</td>
                    <td>{formatDateTime(don.OrderDate)}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(don.OrderID);
                        }}
                        aria-label={`Xóa đơn hàng ${don.OrderID}`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="pagination-wrapper">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <span
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  &lt;
                </span>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  <span className="page-link">{i + 1}</span>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <span
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  &gt;
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Popup Chi tiết đơn hàng */}
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
