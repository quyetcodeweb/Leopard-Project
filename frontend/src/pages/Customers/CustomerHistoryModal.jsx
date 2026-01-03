import React, { useState, useEffect, useMemo } from 'react';
import { customerService } from '../../services/customerService';
import './CustomerHistoryModal.css';

const CustomerHistoryModal = ({ isOpen, onClose, customerId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (isOpen && customerId) {
            loadHistory();
            setSelectedOrder(null);
        }
    }, [isOpen, customerId]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const response = await customerService.getHistory(customerId);
            setHistory(response.data || []);
        } catch (error) {
            console.error("Lỗi khi tải lịch sử từ server:", error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // Sắp xếp theo ngày
    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) => {
            const dateA = new Date(a.OrderDate);
            const dateB = new Date(b.OrderDate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [history, sortOrder]);

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    if (!isOpen) return null;

    return (
        <div className="history-modal-overlay" onClick={onClose}>
            <div className="history-modal-content" onClick={e => e.stopPropagation()}>
                <div className="history-modal-header">
                    <h3>Lịch sử mua hàng - Khách hàng #{customerId}</h3>
                    <button onClick={onClose} className="btn-close-x">&times;</button>
                </div>

                <div className="history-modal-body">
                    {selectedOrder ? (
                        <div className="order-detail-view">
                            <button className="btn-back-text" onClick={() => setSelectedOrder(null)}>
                                ← Quay lại danh sách
                            </button>
                            <h4>Chi tiết đơn hàng: {selectedOrder.OrderID}</h4>
                            <p>Ngày đặt: {new Date(selectedOrder.OrderDate).toLocaleString('vi-VN')}</p>

                            <table className="detail-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedOrder.Items || []).map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.qty}</td>
                                            <td>{Number(item.price).toLocaleString()} đ</td>
                                            <td>{(item.qty * item.price).toLocaleString()} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="detail-footer">
                                <strong>Tổng thanh toán: {Number(selectedOrder.Total).toLocaleString()} đ</strong>
                            </div>
                        </div>
                    ) : (
                        <>
                            {loading ? (
                                <div className="loading-container"><div className="spinner"></div></div>
                            ) : history.length > 0 ? (
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th onClick={toggleSort} className="sortable-header">
                                                Ngày mua {sortOrder === 'asc' ? '▲' : '▼'}
                                            </th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedHistory.map((item) => (
                                            <tr key={item.OrderID}>
                                                <td><strong>{item.OrderID}</strong></td>
                                                <td>{new Date(item.OrderDate).toLocaleDateString('vi-VN')}</td>
                                                <td className="amount">{Number(item.Total).toLocaleString()} đ</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(item.Status)}`}>
                                                        {item.Status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-view-detail"
                                                        onClick={() => setSelectedOrder(item)}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="no-data-msg">
                                    <p>Khách hàng này chưa có giao dịch nào.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="history-modal-footer">
                    <button onClick={onClose} className="btn-close-footer">Đóng</button>
                </div>
            </div>
        </div>
    );
};

const getStatusClass = (status) => {
    switch (status) {
        case 'Hoàn thành': return 'status-completed';
        case 'Đang xử lý': return 'status-pending';
        case 'Hủy bỏ': return 'status-cancelled';
        default: return 'status-other';
    }
};

export default CustomerHistoryModal;