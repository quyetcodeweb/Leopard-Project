import React, { useState } from 'react';
import './ForgotPassword.css'; 

// Component nhận props 'email', 'onSubmitOTP', VÀ 'isLoading'
const EnterOTP = ({ email, onSubmitOTP, isLoading }) => {
    const [otpCode, setOtpCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (otpCode.length !== 6) { 
            alert('Vui lòng nhập đúng 6 ký tự mã OTP.');
            return;
        }

        // GỌI HÀM XỬ LÝ TỪ COMPONENT CHA
        if (onSubmitOTP) {
            onSubmitOTP(otpCode);
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
                    <span className="icon-prefix">🔒</span> 
                    <input
                        type="text"
                        placeholder="OTP code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength="6"
                        required
                        disabled={isLoading} // Vô hiệu hóa input khi đang tải
                    />
                </div>
                
                {/* Vô hiệu hóa nút và thay đổi text khi đang tải */}
                <button type="submit" className="otp-button" disabled={isLoading}>
                    {isLoading ? 'Đang xác minh...' : 'Tiếp tục'}
                </button>
            </form>

            {email && (
                <p style={{marginTop: '20px', fontSize: '0.9rem'}}>
                    Mã OTP đã được gửi đến **{email}**
                </p>
            )}
            
            <div className="resend-link">
                 {/* Vô hiệu hóa link "Gửi lại" khi đang tải */}
                 <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); console.log('Logic gọi lại API gửi OTP...'); }}
                    style={{pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.6 : 1}}
                 >
                    Gửi lại mã OTP
                </a>
             </div>
        </div>
    );
};

export default EnterOTP;