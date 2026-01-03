import React from 'react';
import './ErrorPopup.css';

const ErrorPopup = ({ message, onTryAgain, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="error-icon-container">
                    <div className="error-icon">
                        {/* Icon dấu X lớn màu đỏ */}
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>
                </div>
                <p className="popup-message">{message}</p>
                <button className="try-again-btn" onClick={onTryAgain}>
                    Thử lại
                </button>
            </div>
        </div>
    );
};

export default ErrorPopup;