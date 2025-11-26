import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Taodonhang = ({ onClose, onCreated }) => {
  const [khachHang, setKhachHang] = useState({
    ten: "",
    sdt: "",
    diachi: "",
    maGiamGia: "",
  });

  const [errors, setErrors] = useState({
    ten: "",
    diachi: "",
  });

  const [sanPhamList, setSanPhamList] = useState([]);
  const [sanPhamListFromServer, setSanPhamListFromServer] = useState([]);
  const [timKiem, setTimKiem] = useState("");
  const [sanPhamChon, setSanPhamChon] = useState([]);
  const leftColumnRef = useRef(null);

  // 1️ Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    const fetchSanPham = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sanpham");

        const products = res.data.map((sp) => ({
          ProductID: sp.ProductID,
          ten: sp.ProductName,
          gia: sp.Price,
          Description: sp.Description,
          Image: sp.Image,
          CategoryID: sp.CategoryID,
          Stock: sp.Stock,
        }));

        setSanPhamList(products);
        setSanPhamListFromServer(products);
      } catch (err) {
        console.error(err);
        alert("Lấy danh sách sản phẩm thất bại");
      }
    };
    fetchSanPham();
  }, []);

  // 2️ Cập nhật thông tin khách hàng với ràng buộc
  const handleKhachHangChange = (e) => {
    const { name, value } = e.target;

    if (name === "sdt") {
      // Chỉ nhận số và tối đa 10 ký tự
      if (/^\d*$/.test(value) && value.length <= 10) {
        setKhachHang({ ...khachHang, [name]: value });
      }
    } else if (name === "ten" || name === "diachi") {
      // Chặn ký tự đặc biệt: chỉ bỏ @,#,$,%,&,*,...
      const regex = /^[^@#$%^&*]+$/;
      if (regex.test(value)) {
        setKhachHang({ ...khachHang, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        setErrors({ ...errors, [name]: "Không được nhập ký tự đặc biệt" });
      }
    } else {
      setKhachHang({ ...khachHang, [name]: value });
    }
  };


  // 3️ Tìm kiếm sản phẩm
  const handleTimKiem = () => {
    if (!timKiem.trim()) {
      setSanPhamList(sanPhamListFromServer);
    } else {
      const filtered = sanPhamListFromServer.filter((sp) =>
        sp.ten.toLowerCase().includes(timKiem.toLowerCase())
      );
      setSanPhamList(filtered);
    }
  };

  // 4️ Thêm sản phẩm vào danh sách chọn
  const addSanPham = (sp) => {
    if (!sanPhamChon.find((item) => item.ProductID === sp.ProductID)) {
      setSanPhamChon([...sanPhamChon, { ...sp, soluong: 1 }]);
    }
  };

  // 5️ Thay đổi số lượng sản phẩm
  const handleSoLuongChange = (ProductID, value) => {
    if (value < 0) value = 0;
    setSanPhamChon(
      sanPhamChon.map((sp) =>
        sp.ProductID === ProductID ? { ...sp, soluong: value } : sp
      )
    );
  };

  // 6️ Tạo đơn hàng
  const handleTao = async () => {
    // Kiểm tra thông tin khách hàng
    if (!khachHang.ten?.trim() || !khachHang.sdt?.trim() || !khachHang.diachi?.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng");
      return;
    }

    // Kiểm tra lỗi ký tự đặc biệt
    if (errors.ten || errors.diachi) {
      alert("Vui lòng sửa lỗi ký tự đặc biệt trước khi tạo đơn hàng");
      return;
    }

    // Lọc sản phẩm có số lượng > 0
    const sanPhamHopLe = sanPhamChon.filter((sp) => sp.soluong > 0);
    if (sanPhamHopLe.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm với số lượng > 0");
      return;
    }

    // Chuẩn bị dữ liệu gửi backend
    const data = {
      khachHang: {
        ten: khachHang.ten.trim(),
        sdt: khachHang.sdt.trim(),
        diachi: khachHang.diachi.trim(),
        email: khachHang.email?.trim() || null,
        maGiamGia: khachHang.maGiamGia?.trim() || null,
      },
      sanPham: sanPhamHopLe.map((sp) => ({
        ProductID: sp.ProductID,
        ten: sp.ten,
        soluong: sp.soluong,
        dongia: sp.gia,
      })),
    };

    try {
      await axios.post("http://localhost:5000/api/donhang", data);
      alert("Tạo đơn hàng thành công với trạng thái 'Đã tiếp nhận'");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err.response?.data || err.message);
      alert("Tạo đơn hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

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
        className="container bg-white shadow-lg rounded p-4"
        style={{
          width: "90%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <h2 className="text-center mb-4">Tạo đơn hàng</h2>

        <div className="row justify-content-center">
          {/* Left Column */}
          <div className="d-flex flex-column" ref={leftColumnRef} style={{ width: "48%", marginRight: "2%" }}>
            <div className="p-3 mb-3 rounded" style={{ backgroundColor: "#F5F5F5" }}>
              <h6 style={{ color: "#6C757D", fontSize: "0.9rem" }}>Thông tin khách hàng</h6>

              <input
                className="form-control mb-2"
                type="text"
                name="ten"
                placeholder="Nhập tên khách hàng"
                value={khachHang.ten}
                onChange={handleKhachHangChange}
                style={{ borderColor: errors.ten ? "red" : "" }}
              />
              {errors.ten && <small className="text-danger">{errors.ten}</small>}

              <input
                className="form-control mb-2"
                type="text"
                name="sdt"
                placeholder="Nhập số điện thoại"
                value={khachHang.sdt}
                onChange={handleKhachHangChange}
              />

              <input
                className="form-control mb-2"
                type="text"
                name="diachi"
                placeholder="Nhập địa chỉ khách hàng"
                value={khachHang.diachi}
                onChange={handleKhachHangChange}
                style={{ borderColor: errors.diachi ? "red" : "" }}
              />
              {errors.diachi && <small className="text-danger">{errors.diachi}</small>}

              <input
                className="form-control mb-2"
                type="text"
                name="maGiamGia"
                placeholder="Nhập mã giảm giá"
                value={khachHang.maGiamGia}
                onChange={handleKhachHangChange}
              />
            </div>

            <div className="p-3 rounded flex-grow-1" style={{ backgroundColor: "#F5F5F5" }}>
              <h6 style={{ color: "#6C757D", fontSize: "0.9rem" }}>Thông tin đơn hàng</h6>
              <div className="bg-white p-2 rounded" style={{ height: 200, overflowY: "auto" }}>
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th className="fw-normal">Tên sản phẩm</th>
                      <th className="fw-normal">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sanPhamChon.map((sp) => (
                      <tr key={sp.ProductID} style={{ borderBottom: "1px solid #ccc" }}>
                        <td>{sp.ten}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={sp.soluong}
                            onChange={(e) => handleSoLuongChange(sp.ProductID, parseInt(e.target.value) || 0)}
                            style={{ width: 60, textAlign: "center" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="d-flex flex-column" style={{ width: "48%" }}>
            <div
              className="p-3 rounded flex-grow-1"
              style={{
                backgroundColor: "#F5F5F5",
                minHeight: leftColumnRef.current ? leftColumnRef.current.offsetHeight : 400,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h6 style={{ color: "#6C757D", fontSize: "0.9rem" }}>Danh sách sản phẩm</h6>
              <div className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm me-2"
                  placeholder="Tìm kiếm ..."
                  value={timKiem}
                  onChange={(e) => setTimKiem(e.target.value)}
                />
                <button
                  className="btn btn-sm"
                  onClick={handleTimKiem}
                  style={{ backgroundColor: "#198754", color: "white", border: "none" }}
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="bg-white p-2 rounded flex-grow-1" style={{ overflowY: "auto" }}>
                <ul className="list-group">
                  {sanPhamList.map((sp) => (
                    <li
                      key={sp.ProductID}
                      className="list-group-item list-group-item-action"
                      onClick={() => addSanPham(sp)}
                      style={{ borderBottom: "1px solid #ccc", cursor: "pointer" }}
                    >
                      {sp.ten}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Nút */}
        <div className="mt-4 text-end">
          <button
            className="btn me-3"
            onClick={onClose}
            style={{ border: "1px solid #6C757D", backgroundColor: "white", color: "#6C757D" }}
          >
            Quay lại
          </button>
          <button
            className="btn"
            onClick={handleTao}
            style={{ backgroundColor: "#198754", color: "white", border: "none" }}
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Taodonhang;
