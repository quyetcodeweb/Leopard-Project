import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../Auth/LoginPage.css'; 
import '../Auth/AuthCommon.css';
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { BsCart2 } from "react-icons/bs"; // icon logo giỏ hàng


// ⭐ Cấu hình API Backend (Đảm bảo Node/Express server đang chạy ở đây)
const API_BASE_URL = 'http://localhost:5000/api/auth'; 

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errorFields.includes(e.target.name)) {
            setErrorFields(errorFields.filter(field => field !== e.target.name));
            setError('');
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setErrorFields([]);

        // --- BƯỚC 1: Kiểm tra Bỏ trống ---
        const requiredFields = ['username', 'password'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            const fieldNames = { username: 'Tên đăng nhập', password: 'Mật khẩu' };
            const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
            
            setError(`Vui lòng điền thông tin ở ${missingFieldNames}. Vui lòng kiểm tra lại!`);
            setErrorFields(missingFields);
            
            if (missingFields[0] === 'username' && usernameRef.current) {
                usernameRef.current.focus();
            } else if (missingFields[0] === 'password' && passwordRef.current) {
                passwordRef.current.focus();
            }
            return; 
        }
        
        setIsLoading(true); // Bắt đầu loading

        // --- BƯỚC 2: Gọi API Đăng nhập ---
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, formData);

            if (response.data.success) {
                // Đăng nhập thành công: Lưu token và user info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // ⭐ CHUYỂN HƯỚNG ĐẾN TRANG HOMEPAGE
                navigate("/HomePage");

            } else {
                // Lỗi từ server (Tên đăng nhập/Mật khẩu không đúng)
                setError(response.data.message || 'Lỗi đăng nhập không xác định.');
                setErrorFields(['username', 'password']);
                if (usernameRef.current) {
                    usernameRef.current.focus();
                }
            }
        } catch (err) {
            console.error("Lỗi kết nối hoặc phản hồi API:", err.response ? err.response.data : err.message);
            // Xử lý lỗi kết nối hoặc lỗi server
            const errorMessage = err.response?.data?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend.';
            setError(errorMessage);
            setErrorFields(['username', 'password']);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
    };

    const getInputBorderClass = (fieldName) => {
        return errorFields.includes(fieldName) ? 'input-error-border' : '';
    };

    return (
        <div className="register-page"> 
            
            {/* Cột Trái: Form Đăng Nhập */}
            <div className="register-form-container">
                <h1 className="logo-sms">
                    <span className="logo-icon">🛒</span> SMS
                </h1>
                <h2 className="auth-title">Đăng nhập</h2> 

                <form onSubmit={handleSubmit} className="register-form">
                    
                    {error && <p className="error-message">{error}</p>}

                    {/* Input: Tên đăng nhập */}
                    <div className="input-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={formData.username}
                        onChange={handleChange}
                        className={`input-field ${getInputBorderClass('username')}`}
                        ref={usernameRef}
                        disabled={isLoading}
                    />
                    <span className="input-icon"><FiUser /></span>
                    </div>

                    {/* Input: Mật khẩu */}
                    <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input-field ${getInputBorderClass('password')}`}
                        ref={passwordRef}
                        disabled={isLoading}
                    />
                    <span className="input-icon"><FiLock /></span>
                    <span
                        className="input-icon password-toggle"
                        onClick={handleTogglePassword}
                        style={{ right: '15px', left: 'auto', cursor: 'pointer' }}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                    </div>

                    
                    {/* Link Quên mật khẩu */}
                    <div className="forgot-password-link">
                        <a href="/forgot-password" className="link-text">Quên mật khẩu?</a>
                    </div>

                    {/* Nút Đăng nhập */}
                    <button type="submit" className="btn-auth" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Link Đăng ký */}
                <p className="auth-link-footer">
                    Chưa có tài khoản? <a href="/register" className="link-text">Đăng ký</a>
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

export default LoginPage;