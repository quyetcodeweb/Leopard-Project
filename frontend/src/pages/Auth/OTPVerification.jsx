import React, { useState } from 'react';
import ErrorPopup from '../../components/Popups/ErrorPopup';
import './AuthCommon.css'; 

const OTPVerification = ({ email, onOTPVerified }) => {
    const [otpCode, setOtpCode] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Bổ sung hàm đóng Popup lỗi
    const handleCloseError = () => {
        setShowError(false);
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra cơ bản: mã OTP phải đủ 6 số
        if (otpCode.length !== 6) {
            setErrorMessage('Vui lòng nhập đủ 6 chữ số mã OTP.');
            setShowError(true);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otpCode })
            });

            const data = await res.json();

            if (res.ok) {
                // Thành công: chuyển sang bước nhập mật khẩu mới
                onOTPVerified(); 
            } else {
                // Thất bại: hiển thị thông báo lỗi từ Backend (Mã sai hoặc hết hạn)
                setErrorMessage(data.message || 'Mã OTP không đúng');
                setShowError(true);
            }
        } catch (err) {
            setErrorMessage('Lỗi kết nối máy chủ. Vui lòng thử lại!');
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-sms">🛒SMS</div>
            <h2>Xác thực mã OTP</h2>
            <p className="instruction-text">
                Mã OTP đã được gửi đến email:<br/> 
                <strong>{email}</strong>
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Nhập 6 số OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} // Chỉ cho phép nhập số
                        className="input-field"
                        maxLength="6"
                        disabled={isLoading}
                        required
                        autoFocus
                    />
                </div>
                <button 
                    type="submit" 
                    className={`primary-button full-width ${isLoading ? 'disabled' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xác thực...' : 'Tiếp tục'}
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

export default OTPVerification;