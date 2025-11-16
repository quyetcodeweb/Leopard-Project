// ForgotPasswordFlow.jsx

import React, { useState } from 'react';
import './ForgotPassword.css';
import ForgotPassword from './ForgotPassword'; // Bước 1: Nhập Email
import EnterOTP from './EnterOTP';           // Bước 2: Nhập OTP
import NewPassword from './NewPassword';     // Bước 3: Đặt Mật khẩu mới

// Định nghĩa các bước (Step)
const STEPS = {
    ENTER_EMAIL: 'enter_email',
    ENTER_OTP: 'enter_otp',
    NEW_PASSWORD: 'new_password',
    SUCCESS: 'success'
};

// ** ĐỊA CHỈ API CỦA BACKEND (BẠN PHẢI THAY ĐỔI ĐỊA CHỈ NÀY) **
const API_URL = 'http://localhost:3001/api/auth/forgot-password'; 

const ForgotPasswordFlow = () => {
    const [currentStep, setCurrentStep] = useState(STEPS.ENTER_EMAIL);
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState(''); // Lưu token nhận được từ API
    const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
    const [error, setError] = useState(''); // Thông báo lỗi

    // Hàm gọi API chung
    const callApi = async (endpoint, data) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (!response.ok) {
                // Nếu API trả về lỗi (ví dụ: 404, 400)
                throw new Error(result.message || 'Lỗi không xác định.');
            }
            return result;
        } catch (err) {
            setError(err.message || 'Lỗi kết nối máy chủ.');
            throw err; // Ném lỗi để hàm gọi biết thất bại
        } finally {
            setIsLoading(false);
        }
    };

    // --- 1. Xử lý GỬI OTP (TỪ ForgotPassword.jsx) ---
    const handleSendOTP = async (emailInput) => {
        setEmail(emailInput);
        try {
            console.log(`Đang gọi API gửi OTP đến: ${emailInput}`);
            
            const data = await callApi('send-otp', { email: emailInput });
            
            setResetToken(data.otpToken); // Lưu token để dùng cho bước xác minh
            setCurrentStep(STEPS.ENTER_OTP);
            setError(''); // Xóa lỗi nếu thành công

        } catch (err) {
            // Lỗi đã được xử lý trong callApi
            console.error('Lỗi khi gửi OTP:', err);
        }
    };
    
    // --- 2. Xử lý XÁC MINH OTP (TỪ EnterOTP.jsx) ---
    const handleVerifyOTP = async (otpCodeInput) => {
        
        try {
            console.log(`Đang gọi API xác minh OTP: ${otpCodeInput}`);

            const data = await callApi('verify-otp', { 
                otpToken: resetToken, 
                otpCode: otpCodeInput 
            });

            setResetToken(data.resetToken); // Lưu resetToken mới để dùng cho bước đổi mật khẩu
            setCurrentStep(STEPS.NEW_PASSWORD); 
            setError(''); // Xóa lỗi nếu thành công

        } catch (err) {
            // Lỗi đã được xử lý trong callApi
            console.error('Lỗi khi xác minh OTP:', err);
        }
    };
    
    // --- 3. Xử lý ĐẶT LẠI MẬT KHẨU (TỪ NewPassword.jsx) ---
    const handlePasswordReset = async (newPassword) => {
        
        try {
            console.log('Đang gọi API đặt lại mật khẩu.');

            await callApi('reset-password', { 
                resetToken: resetToken, 
                newPassword 
            });

            // Thành công
            setCurrentStep(STEPS.SUCCESS); 
            setError(''); // Xóa lỗi nếu thành công

        } catch (err) {
            // Lỗi đã được xử lý trong callApi
            console.error('Lỗi khi đặt lại mật khẩu:', err);
        }
    };


    const renderStep = () => {
        switch (currentStep) {
            case STEPS.ENTER_EMAIL:
                return <ForgotPassword onSubmitEmail={handleSendOTP} isLoading={isLoading} />;

            case STEPS.ENTER_OTP:
                return <EnterOTP email={email} onSubmitOTP={handleVerifyOTP} isLoading={isLoading} />;

            case STEPS.NEW_PASSWORD:
                return <NewPassword onSubmitPassword={handlePasswordReset} isLoading={isLoading} />;

            case STEPS.SUCCESS:
                return (
                    <div className="forgot-password-card" style={{textAlign: 'center'}}>
                         <div className="logo">
                            <span className="logo-text">🛒SMS</span> 
                        </div>
                        <h2>Thành công</h2>
                        <p>Mật khẩu của bạn đã được thay đổi. Vui lòng trở lại trang đăng nhập để tiếp tục.</p>
                        {/* Thay thế nút này bằng navigate('/login') nếu bạn dùng React Router */}
                        <button 
                            className="otp-button" 
                            onClick={() => setCurrentStep(STEPS.ENTER_EMAIL)} // Quay về bước đầu tiên
                            style={{marginTop: '20px'}}
                        >
                            Quay về
                        </button>
                    </div>
                );

            default:
                return <div>Lỗi: Bước không xác định</div>;
        }
    };

    return (
        <div className="forgot-password-container"> 
            
            {/* Hiển thị lỗi toàn cục nếu có */}
            {error && (
                <div style={{color: 'red', textAlign: 'center', marginBottom: '15px'}}>
                    {error}
                </div>
            )}
            
            {renderStep()}

        </div>
    );
};

export default ForgotPasswordFlow;