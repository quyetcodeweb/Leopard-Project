import React, { useState } from 'react';
import './Popup.css';
import * as XLSX from 'xlsx';

const ImportPopup = ({ onClose, onComplete }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);
      onComplete(rows);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Nhập kho từ Excel</h2>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <div className="popup-actions">
          <button onClick={handleImport} className="btn-save">Nhập</button>
          <button onClick={onClose} className="btn-cancel">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ImportPopup;