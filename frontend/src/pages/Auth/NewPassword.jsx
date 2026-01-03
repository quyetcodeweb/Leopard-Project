import React, { useState } from 'react';
import ErrorPopup from '../../components/Popups/ErrorPopup';
import './AuthCommon.css'; 

// Nhận thêm props 'email' từ component cha (ForgotPasswordFlow)
const NewPassword = ({ email, onPasswordSet }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra khớp mật khẩu
        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp.');
            setShowError(true);
            return;
        }

        // 2. Kiểm tra độ mạnh (tối thiểu 8 ký tự)
        if (password.length < 8) {
            setErrorMessage('Mật khẩu phải tối thiểu 8 ký tự.');
            setShowError(true);
            return;
        }

        setIsLoading(true);

        try {
            // 3. Gọi API thật tới Backend
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    newPassword: password 
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Thành công: Gọi hàm để quay về trang Login
                onPasswordSet(); 
            } else {
                // Thất bại (Lỗi server hoặc lỗi DB)
                setErrorMessage(data.message || 'Lỗi khi cập nhật mật khẩu.');
                setShowError(true);
            }
        } catch (err) {
            setErrorMessage('Lỗi kết nối máy chủ.');
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-sms">🛒SMS</div>
            <h2>Mật khẩu mới</h2>
            <p className="instruction-text">Đặt lại mật khẩu cho: <b>{email}</b></p>
            
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Xác nhận lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        disabled={isLoading}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className={`primary-button full-width ${isLoading ? 'disabled' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
                </button>
            </form>

            {showError && (
                <ErrorPopup
                    message={errorMessage}
                    onTryAgain={handleCloseError}
                    onClose={handleCloseError}
                />
            )}
        </div>
    );
};

export default NewPassword;