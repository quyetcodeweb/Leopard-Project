import React, { useState } from 'react';
import './ForgotPassword.css'; 

// Component nhận prop onSubmitPassword VÀ isLoading
const NewPassword = ({ onSubmitPassword, isLoading }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert('Mật khẩu và Xác nhận Mật khẩu không khớp. Vui lòng kiểm tra lại!');
            return;
        }

        if (password.length < 6) {
             alert('Mật khẩu phải có ít nhất 6 ký tự.');
             return;
        }

        // GỌI HÀM XỬ LÝ TỪ COMPONENT CHA
        if (onSubmitPassword) {
            onSubmitPassword(password); 
        }
    };

    return (
        <div className="forgot-password-card"> 
            <div className="logo">
                <span className="logo-text">🛒SMS</span> 
            </div>

            <h2>Mật khẩu mới</h2>

            <form onSubmit={handleSubmit} className="forgot-password-form">
                
                {/* Input: Mật khẩu mới */}
                <div className="input-group">
                    <span className="icon-prefix">🔑</span> 
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading} // Vô hiệu hóa input khi đang tải
                    />
                </div>
                
                {/* Input: Xác nhận Mật khẩu */}
                <div className="input-group">
                    <span className="icon-prefix">✔</span> 
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading} // Vô hiệu hóa input khi đang tải
                    />
                </div>
                
                {/* Vô hiệu hóa nút và thay đổi text khi đang tải */}
                <button type="submit" className="otp-button" disabled={isLoading}>
                    {isLoading ? 'Đang cập nhật...' : 'Tiếp tục'}
                </button>
            </form>
        </div>
    );
};

export default NewPassword;