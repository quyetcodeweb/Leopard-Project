import React, { useState, useEffect } from "react";
import axios from "axios";
import Taodonhang from "../../pages/QLDH/Taodonhang";
import ChiTietHoaDon from "../../pages/QLDH/Chitietdonhang"; 
import "./Donhang.css";

const Donhang = () => {
  const [donHangList, setDonHangList] = useState([]);
  const [searchMa, setSearchMa] = useState("");
  const [searchNgay, setSearchNgay] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  // Lấy danh sách đơn hàng
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donhang");
      setDonHangList(res.data);
      setCurrentPage(1); // reset phân trang về trang 1
    } catch (err) {
      console.error(err);
      alert("Lấy danh sách đơn hàng thất bại");
    }
  };

  // Tìm kiếm
  const handleSearch = async () => {
    try {
      if (!searchMa && !searchNgay) return fetchData();

      const res = await axios.get("http://localhost:5000/api/donhang/search", {
        params: { ma: searchMa, ngay: searchNgay },
      });
      setDonHangList(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Tìm kiếm thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  // Xác nhận đơn hàng
  const handleConfirm = async (orderID) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/donhang/${orderID}/confirm`);
      alert(res.data.message);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Xác nhận thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  // Hủy đơn hàng
  const handleCancel = async (orderID) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/donhang/${orderID}/cancel`);
      alert(res.data.message);
      fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Hủy đơn hàng thất bại: " + (err.response?.data?.message || err.message));
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

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("vi-VN", { hour12: false });
  };

  return (
    <div className="donhang-container">
      <div className="donhang-frame">
        {/* Thanh tìm kiếm */}
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
          <button className="search-btn" onClick={handleSearch}>
            Tìm kiếm
          </button>
        </div>

        {/* Nút tạo đơn hàng */}
        <div className="create-btn-wrapper">
          <button className="btn-create" onClick={() => setShowModal(true)}>
            + Tạo đơn hàng
          </button>
        </div>

        {/* Bảng dữ liệu */}
        <div className="table-wrapper">
          <table className="table table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Trạng thái đơn</th>
                <th>Xác nhận đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((don) => (
                <tr
                  key={don.OrderID}
                  onClick={() => setSelectedOrderID(don.OrderID)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{don.OrderID}</td>
                  <td>{formatDateTime(don.OrderDate)}</td>
                  <td>
                    <span
                      className={`badge-status ${don.Status
                        .replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {don.Status}
                    </span>
                  </td>
                  <td>
                    {don.Status === "Đã tiếp nhận" && (
                      <>
                        <button
                          className="btn-confirm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirm(don.OrderID);
                          }}
                        >
                          Xác nhận
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(don.OrderID);
                          }}
                        >
                          Hủy
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="pagination-wrapper">
          <ul className="pagination mb-0">
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="page-link">&lt;</span>
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
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="page-link">&gt;</span>
            </li>
          </ul>
        </div>

        {/* Popup Tạo đơn hàng */}
        {showModal && <Taodonhang onClose={() => setShowModal(false)} onCreated={fetchData} />}

        {/* Popup Chi tiết đơn hàng */}
        {selectedOrderID && (
          <ChiTietHoaDon
            orderID={selectedOrderID}
            onClose={() => setSelectedOrderID(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Donhang;
