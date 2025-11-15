import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth/RegisterPage.css';
import '../Auth/AuthCommon.css';
import { FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";

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

    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (errorFields.includes(e.target.name)) {
            setErrorFields(errorFields.filter(f => f !== e.target.name));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorFields([]);

        // --- 1. CHECK EMPTY ---
        const required = ['username', 'email', 'password', 'confirmPassword'];
        const missing = required.filter(f => !formData[f].trim());

        if (missing.length) {
            setError("Vui lòng điền đầy đủ thông tin.");
            setErrorFields(missing);

            const firstMissing = missing[0];
            if (firstMissing === "username") usernameRef.current.focus();
            if (firstMissing === "email") emailRef.current.focus();
            if (firstMissing === "password") passwordRef.current.focus();
            if (firstMissing === "confirmPassword") confirmPasswordRef.current.focus();
            return;
        }

        // --- 2. VALIDATE EMAIL (CHỈ CHẤP NHẬN GMAIL.COM) ---
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(formData.email.trim())) {
            setError("Email không hợp lệ, vui lòng nhập lại theo định dạng example@gmail.com");
            setErrorFields(['email']);
            emailRef.current.focus();
            return;
        }

        // --- 3. VALIDATE PASSWORD ---
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%&*._-]).{8,20}$/;

        if (!passwordRegex.test(formData.password)) {
            setError("Mật khẩu phải dài 8-20 ký tự, gồm chữ in hoa, chữ thường, số và ký tự đặc biệt.");
            setErrorFields(['password']);
            passwordRef.current.focus();
            return;
        }

        // --- 4. CONFIRM PASSWORD ---
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            setErrorFields(['password', 'confirmPassword']);
            confirmPasswordRef.current.focus();
            return;
        }

        // --- 5. API CALL ---
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (res.data.success) {
                navigate('/login');
            } else {
                setError(res.data.message || "Đăng ký thất bại.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi kết nối đến server.");
        }

        setIsLoading(false);
    };

    const getBorder = (field) => errorFields.includes(field) ? "input-error-border" : "";

    return (
        <div className="register-page">

            <div className="register-form-container">
                <h1 className="logo-sms">
                    <span className="logo-icon">🛒</span> SMS
                </h1>

                <h2 className="auth-title">Đăng ký</h2>

                <form onSubmit={handleSubmit} className="register-form">

                    {/* ==== ERROR TEXT (NOT BOX) ==== */}
                    {error && (
                        <p className="error-message-simple">
                            {error}
                        </p>
                    )}

                    {/* USERNAME */}
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleChange}
                            ref={usernameRef}
                            className={`input-field ${getBorder("username")}`}
                        />
                        <span className="input-icon"><FiUser /></span>
                    </div>

                    {/* EMAIL */}
                    <div className="input-group">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            ref={emailRef}
                            className={`input-field ${getBorder("email")}`}
                        />
                        <span className="input-icon"><FiMail /></span>
                    </div>

                    {/* PASSWORD */}
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            ref={passwordRef}
                            className={`input-field ${getBorder("password")}`}
                        />
                        <span className="input-icon"><FiLock /></span>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            ref={confirmPasswordRef}
                            className={`input-field ${getBorder("confirmPassword")}`}
                        />
                        <span className="input-icon"><FiCheck /></span>
                    </div>

                    {/* BUTTON */}
                    <button type="submit" className="btn-auth" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </form>

                <p className="auth-link-footer">
                    Đã có tài khoản? <a href="/login" className="link-text">Đăng nhập</a>
                </p>
            </div>

            <div className="illustration-container">
                <img
                    src="/images/undraw_inflation_ht0o 1.png"
                    alt="Illustration"
                    className="illustration-image"
                />
                <p className="illustration-caption">
                    Quản lý thông minh - Kinh doanh hiệu quả
                </p>
            </div>

        </div>
    );
};

export default RegisterPage;
