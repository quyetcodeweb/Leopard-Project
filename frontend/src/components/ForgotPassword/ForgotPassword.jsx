import React, { useState } from 'react';
import './ForgotPassword.css'; 

// Component nhận prop onSubmitEmail VÀ isLoading
const ForgotPassword = ({ onSubmitEmail, isLoading }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email) {
            alert('Vui lòng nhập địa chỉ email.');
            return;
        }

        // GỌI HÀM XỬ LÝ TỪ COMPONENT CHA
        if (onSubmitEmail) {
            onSubmitEmail(email); 
        }
    };

    return (
        <div className="forgot-password-card">
            <div className="logo">
                <span className="logo-text">🛒SMS</span> 
            </div>
            <h2>Quên mật khẩu</h2>

            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="input-group">
                    <span className="icon-prefix">📧</span> 
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading} // Vô hiệu hóa input khi đang tải
                    />
                </div>
                
                {/* Vô hiệu hóa nút và thay đổi text khi đang tải */}
                <button type="submit" className="otp-button" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'GỬI OTP'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;