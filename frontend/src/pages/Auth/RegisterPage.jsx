import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../Auth/RegisterPage.css'; 
import '../Auth/AuthCommon.css'; 
import { FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";
import { BsCart2 } from "react-icons/bs";

// ⭐ Cấu hình API Backend (Đảm bảo Node/Express server đang chạy ở đây)
const API_BASE_URL = 'http://localhost:5000/api/auth'; 

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorFields.includes(e.target.name)) {
            setErrorFields(errorFields.filter(field => field !== e.target.name));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setErrorFields([]);
        
        // --- BƯỚC 1: Validation ở Frontend ---
        const requiredFields = ['username', 'email', 'password', 'confirmPassword'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            const fieldNames = { username: 'Tên đăng nhập', email: 'Email', password: 'Mật khẩu', confirmPassword: 'Xác nhận mật khẩu' };
            const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
            setError(`Vui lòng điền thông tin ở ${missingFieldNames}.`);
            setErrorFields(missingFields);
            return; 
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ, vui lòng nhập lại email theo định dạng example@gmail.com');
            setErrorFields(['email']);
            return;
        }
        
        // Mật khẩu: 8-20 ký tự, in hoa, thường, số, ký tự đặc biệt
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\,.;]).{8,20}$/; 
        if (!passwordRegex.test(formData.password)) {
            setError('Mật khẩu phải có 8-20 ký tự, bao gồm chữ in, chữ thường, số, ký tự đặc biệt. Vui lòng nhập lại');
            setErrorFields(['password']);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp, vui lòng nhập lại.');
            setErrorFields(['password', 'confirmPassword']);
            return;
        }
        
        setIsLoading(true); // Bắt đầu loading

        // --- BƯỚC 2: Gọi API Đăng ký ---
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.success) {
                // Đăng ký thành công: CHUYỂN HƯỚNG VỀ TRANG ĐĂNG NHẬP
                navigate('/login'); 

            } else {
                // Lỗi từ server (Tên đăng nhập/Email đã tồn tại)
                setError(response.data.message || 'Lỗi đăng ký không xác định.');
                setErrorFields(['username', 'email']);
            }
        } catch (err) {
            console.error("Lỗi kết nối hoặc phản hồi API:", err.response ? err.response.data : err.message);
            // Xử lý lỗi kết nối hoặc lỗi server
            const errorMessage = err.response?.data?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend.';
            setError(errorMessage);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const getInputBorderClass = (fieldName) => {
        return errorFields.includes(fieldName) ? 'input-error-border' : '';
    };

    return (
        <div className="register-page">
            {/* Cột Trái: Form Đăng Ký */}
            <div className="register-form-container">
                <h1 className="logo-sms">
                    <span className="logo-icon">🛒</span> SMS
                </h1>
                <h2 className="auth-title">Đăng ký</h2>

                <form onSubmit={handleSubmit} className="register-form">
                    {error && <p className="error-message">{error}</p>}

                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            className={`input-field ${getInputBorderClass('username')}`}
                            disabled={isLoading}
                        />
                        <span className="input-icon"><FiUser /></span>
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input-field ${getInputBorderClass('email')}`}
                            disabled={isLoading}
                        />
                        <span className="input-icon"><FiMail /></span>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input-field ${getInputBorderClass('password')}`}
                            disabled={isLoading}
                        />
                        <span className="input-icon"><FiLock /></span>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`input-field ${getInputBorderClass('confirmPassword')}`}
                            disabled={isLoading}
                        />
                        <span className="input-icon"><FiCheck /></span>
                    </div>

                    {/* Nút Đăng ký */}
                    <button type="submit" className="btn-auth" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                {/* Link Đăng nhập */}
                <p className="auth-link-footer">
                    Đã có tài khoản? <a href="/login" className="link-text">Đăng nhập</a>
                </p>
            </div>

            {/* Cột Phải: Hình Minh Họa */}
            <div className="illustration-container">
                <div className="illustration-content">
                    <img 
                        src="/images/undraw_inflation_ht0o 1.png" 
                        alt="Người đàn ông đi bộ với giỏ hàng"
                        className="illustration-image" 
                    />
                </div>
                <p className="illustration-caption">
                    Quản lý thông minh - Kinh doanh hiệu quả
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;