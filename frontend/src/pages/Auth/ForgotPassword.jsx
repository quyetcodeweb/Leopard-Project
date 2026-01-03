import React, { useState } from 'react';
import ErrorPopup from '../../components/Popups/ErrorPopup';
import './AuthCommon.css'; 

const ForgotPassword = ({ onOTPSent }) => {
    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái chờ

    // Định nghĩa hàm đóng thông báo lỗi (Cần thiết)
    const handleCloseError = () => {
        setShowError(false);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu gửi thì bật loading

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                onOTPSent(email);
            } else {
                setErrorMessage(data.message || 'Có lỗi xảy ra!');
                setShowError(true);
            }
        } catch (err) {
            setErrorMessage('Không thể kết nối tới máy chủ. Vui lòng thử lại sau!');
            setShowError(true);
        } finally {
            setIsLoading(false); // Kết thúc dù thành công hay thất bại
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-sms">🛒SMS</div>
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Nhập Email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        disabled={isLoading} // Khóa input khi đang gửi
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className={`primary-button full-width ${isLoading ? 'disabled' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
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

export default ForgotPassword;