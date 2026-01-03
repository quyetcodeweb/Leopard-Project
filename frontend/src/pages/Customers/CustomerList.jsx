import React, { useState, useEffect, useCallback } from 'react';
import './CustomerList.css';
import { customerService } from '../../services/customerService';
import { exportToExcel, exportToPDF } from '../../utils/exportHelper';
import CustomerFormModal from './CustomerFormModal';
import CustomerHistoryModal from './CustomerHistoryModal';
import { toast } from 'react-toastify';
import CustomerDetailModal from './CustomerDetailModal';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLabel, setFilterLabel] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const customersPerPage = 10;

    // LẤY DỮ LIỆU 
    const fetchCustomers = useCallback(async () => {
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
        } catch (error) {
            toast.error("Không thể tải danh sách khách hàng từ server");
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // THÊM/SỬA
    const handleSaveCustomer = async (formData) => {
        try {
            await customerService.saveCustomer(formData);
            await fetchCustomers();
            setIsFormOpen(false);
        } catch (error) {
            toast.error("Lỗi khi lưu dữ liệu vào Database");
            throw error;
        }
    };

    //THAY ĐỔI TRẠNG THÁI
    const handleChangeStatus = async (id) => {
        const customer = customers.find(c => c.CustomerID === id);
        const updatedStatus = customer.Status === 'Hoạt động' ? 'Vô hiệu hóa' : 'Hoạt động';

        try {
            await customerService.saveCustomer({ ...customer, Status: updatedStatus });
            setCustomers(prev => prev.map(c => c.CustomerID === id ? { ...c, Status: updatedStatus } : c));
            toast.info("Đã cập nhật trạng thái");
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // XÓA 
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này khỏi cơ sở dữ liệu?")) {
            try {
                await customerService.deleteCustomer(id);
                setCustomers(prev => prev.filter(c => c.CustomerID !== id));
                toast.success("Đã xóa khách hàng thành công");
            } catch (error) {
                toast.error("Lỗi: Không thể xóa khách hàng");
            }
        }
    };

    const handleViewDetail = (customer) => {
        setSelectedCustomer(customer);
        setIsDetailOpen(true);
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setIsFormOpen(true);
    };

    const handleViewHistory = (customerId) => {
        const customer = customers.find(c => c.CustomerID === customerId);
        setSelectedCustomer(customer);
        setIsHistoryOpen(true);
    };

    //LỌC VÀ PHÂN TRANG 
    const filteredCustomers = customers.filter(c =>
        (c.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.Phone?.includes(searchTerm) ||
            c.Email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterLabel === 'All' || c.Label === filterLabel)
    );

    const sortedData = [...filteredCustomers].sort((a, b) =>
        new Date(b.CreatedAt) - new Date(a.CreatedAt)
    );

    const indexOfLastItem = currentPage * customersPerPage;
    const indexOfFirstItem = indexOfLastItem - customersPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / customersPerPage) || 1;

    const handleExportData = (type) => {
        const fileName = `DanhSachKhachHang_${new Date().getTime()}`;
        if (type === 'excel') exportToExcel(filteredCustomers, fileName);
        else exportToPDF(filteredCustomers, fileName);
    };

    return (
        <div className="customer-container">
            <div className="customer-header" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                <div className="filter-section" style={{ flex: 1, display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, SĐT, Email..."
                        className="search-input"
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />

                    <select
                        className="filter-select"
                        value={filterLabel}
                        onChange={(e) => { setFilterLabel(e.target.value); setCurrentPage(1); }}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                    >
                        <option value="All">Tất cả nhãn</option>
                        <option value="Khách lẻ">Khách lẻ</option>
                        <option value="Khách mới">Khách mới</option>
                        <option value="Thân thiết">Thân thiết</option>
                        <option value="Khách VIP">Khách VIP</option>
                        <option value="Tiềm năng">Tiềm năng</option>
                    </select>
                </div>

                <button className="btn-add" onClick={() => { setSelectedCustomer(null); setIsFormOpen(true); }}>Thêm khách hàng mới</button>
                <button onClick={() => handleExportData('excel')} className="btn-export">Xuất Excel</button>
                <button onClick={() => handleExportData('pdf')} className="btn-export">Xuất PDF</button>
            </div>

            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Mã KH</th>
                        <th>Họ tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Địa chỉ</th>
                        <th>Ngày tạo</th>
                        <th>Nhãn</th>
                        <th>Trạng thái</th>
                        <th style={{ width: '150px' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(customer => (
                        <tr key={customer.CustomerID}>
                            <td>{customer.CustomerID}</td>
                            <td><strong>{customer.FullName}</strong></td>
                            <td>{customer.Phone}</td>
                            <td>{customer.Email}</td>
                            <td>{customer.Address}</td>
                            <td>{new Date(customer.CreatedDate).toLocaleDateString('vi-VN')}</td>
                            <td>
                                <span className={`label-badge label-${customer.Label?.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {customer.Label}
                                </span>
                            </td>
                            <td>
                                <span className={`status-badge ${customer.Status === 'Hoạt động' ? 'active' : 'disabled'}`}>
                                    {customer.Status}
                                </span>
                            </td>
                            <td className="actions">
                                <button className="btn btn-view" title="Xem chi tiết" onClick={() => handleViewDetail(customer)}>
                                    <i className="fa-regular fa-eye"></i>
                                </button>
                                <button className="btn btn-edit" title="Chỉnh sửa" onClick={() => handleEdit(customer)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-history" title="Lịch sử" onClick={() => handleViewHistory(customer.CustomerID)}>
                                    <i className="fa-solid fa-history"></i>
                                </button>
                                <button
                                    className={`btn ${customer.Status === 'Hoạt động' ? 'btn-status-active' : 'btn-status-disabled'}`}
                                    title={customer.Status === 'Hoạt động' ? "Vô hiệu hóa" : "Kích hoạt"}
                                    onClick={() => handleChangeStatus(customer.CustomerID)}>
                                    {customer.Status === 'Hoạt động' ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-solid fa-ban"></i>}
                                </button>
                                <button className="btn btn-delete" title="Xóa" onClick={() => handleDelete(customer.CustomerID)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="btn-next">Trước</button>
                <span>Trang {currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="btn-next">Sau</button>
            </div>

            {isFormOpen && (
                <CustomerFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    initialData={selectedCustomer}
                    onSave={handleSaveCustomer}
                />
            )}

            {isHistoryOpen && (
                <CustomerHistoryModal
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    customerId={selectedCustomer?.CustomerID}
                />
            )}

            <CustomerDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default CustomerList;