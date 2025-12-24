import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword'; 
import OTPVerification from './OTPVerification';
import NewPassword from './NewPassword';
import { useNavigate } from 'react-router-dom';

const SCREENS = {
    FORGOT_PASSWORD: 'forgot_password',
    OTP_VERIFICATION: 'otp_verification',
    NEW_PASSWORD: 'new_password',
};

const ForgotPasswordFlow = () => {
    const navigate = useNavigate(); 
    const [currentScreen, setCurrentScreen] = useState(SCREENS.FORGOT_PASSWORD);
    const [userEmail, setUserEmail] = useState('');

    // Bước 1: Email -> OTP
    const handleOTPSent = (email) => {
        setUserEmail(email);
        setCurrentScreen(SCREENS.OTP_VERIFICATION);
    };

    // Bước 2: OTP -> Mật khẩu mới
    const handleOTPVerified = () => {
        setCurrentScreen(SCREENS.NEW_PASSWORD);
    };

    // Bước 3: Hoàn thành -> Chuyển hướng
    const handlePasswordSet = () => {
        alert('Đặt mật khẩu thành công! Chuyển về trang đăng nhập.');
        navigate('/login');
    };

    // Điều hướng các màn hình
    switch (currentScreen) {
        case SCREENS.OTP_VERIFICATION:
            return (
                <OTPVerification 
                    email={userEmail} 
                    onOTPVerified={handleOTPVerified} 
                />
            );
            
        case SCREENS.NEW_PASSWORD:
            return (
                <NewPassword 
                    email={userEmail} // QUAN TRỌNG: Phải truyền email xuống đây
                    onPasswordSet={handlePasswordSet} 
                />
            );

        case SCREENS.FORGOT_PASSWORD:
        default:
            return (
                <ForgotPassword 
                    onOTPSent={handleOTPSent} 
                />
            );
    }
};

export default ForgotPasswordFlow;