import React, { useState, useEffect } from 'react';
import './CustomerFormModal.css';
import { toast } from 'react-toastify';

const CustomerFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        FullName: '', Phone: '', Email: '', Address: '', Label: 'Khách mới', Status: 'Hoạt động'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ FullName: '', Phone: '', Email: '', Address: '', Label: 'Khách mới', Status: 'Hoạt động' });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        let newErrors = {};
        const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.FullName.trim()) newErrors.FullName = "Họ tên không được để trống";
        if (!phoneRegex.test(formData.Phone)) newErrors.Phone = "Số điện thoại không hợp lệ (10 số, đầu số VN)";
        if (formData.Email && !emailRegex.test(formData.Email)) newErrors.Email = "Email không đúng định dạng";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Dữ liệu gửi về Server:", formData);
            const confirmMsg = initialData
                ? "Bạn có chắc chắn muốn lưu những thay đổi này không?"
                : "Bạn có chắc chắn muốn thêm khách hàng này không?";

            if (window.confirm(confirmMsg)) {
                try {
                    await onSave(formData);

                    toast.success(initialData ? "Cập nhật thành công" : "Thêm mới thành công");
                    onClose();
                } catch (error) {
                    toast.error("Lỗi: " + (error.response?.data?.message || "Không thể kết nối đến máy chủ"));
                }
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{initialData ? ' Cập nhật khách hàng' : ' Thêm khách hàng mới'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Họ tên *</label>
                        <input
                            type="text"
                            value={formData.FullName}
                            onChange={e => setFormData({ ...formData, FullName: e.target.value })}
                            className={errors.FullName ? 'input-error' : ''}
                            placeholder="Nhập họ tên đầy đủ"
                        />
                        {errors.FullName && <span className="error-text">{errors.FullName}</span>}
                    </div>

                    <div className="form-field">
                        <label>Số điện thoại *</label>
                        <input
                            type="text"
                            value={formData.Phone}
                            onChange={e => setFormData({ ...formData, Phone: e.target.value })}
                            className={errors.Phone ? 'input-error' : ''}
                            placeholder="Ví dụ: 0987654321"
                        />
                        {errors.Phone && <span className="error-text">{errors.Phone}</span>}
                    </div>

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.Email}
                            onChange={e => setFormData({ ...formData, Email: e.target.value })}
                            className={errors.Email ? 'input-error' : ''}
                            placeholder="example@gmail.com"
                        />
                        {errors.Email && <span className="error-text">{errors.Email}</span>}
                    </div>

                    <div className="form-field">
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            value={formData.Address}
                            onChange={e => setFormData({ ...formData, Address: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label>Nhãn (Label)</label>
                            <select value={formData.Label} onChange={e => setFormData({ ...formData, Label: e.target.value })}>
                                <option value="Khách lẻ">Khách lẻ</option>
                                <option value="Khách mới">Khách mới</option>
                                <option value="Thân thiết">Thân thiết</option>
                                <option value="Khách VIP">Khách VIP</option>
                                <option value="Tiềm năng">Tiềm năng</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Trạng thái</label>
                            <select value={formData.Status} onChange={e => setFormData({ ...formData, Status: e.target.value })}>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Vô hiệu hóa">Vô hiệu hóa</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn-save">
                            {initialData ? 'Lưu thay đổi' : 'Thêm khách hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerFormModal;