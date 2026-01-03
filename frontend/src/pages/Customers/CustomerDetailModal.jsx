import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import './CustomerDetailModal.css';

const CustomerDetailModal = ({ isOpen, onClose, customer }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && customer?.CustomerID) {
            fetchNotes();
        }
    }, [isOpen, customer]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const data = await customerService.getNotes(customer.CustomerID);
            setNotes(data || []);
        } catch (error) {
            console.error("Lỗi tải ghi chú:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            const addedNote = await customerService.addNote(customer.CustomerID, {
                content: newNote,
                author: 'Admin'
            });
            setNotes([addedNote, ...notes]);
            setNewNote('');
        } catch (error) {
            alert("Không thể thêm ghi chú");
        }
    };

    const handleDeleteNote = async (id) => {
        if (window.confirm("Xóa ghi chú này?")) {
            try {
                await customerService.deleteNote(id);
                setNotes(notes.filter(n => n.NoteID !== id));
            } catch (error) {
                alert("Không thể xóa ghi chú");
            }
        }
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Chi tiết khách hàng: {customer.FullName}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="grid-info">
                        <div className="info-row"><label>Mã KH:</label><span>KH{customer.CustomerID}</span></div>
                        <div className="info-row"><label>Họ tên:</label><span>{customer.FullName}</span></div>
                        <div className="info-row"><label>SĐT:</label><span>{customer.Phone}</span></div>
                        <div className="info-row"><label>Email:</label><span>{customer.Email}</span></div>
                        <div className="info-row"><label>Địa chỉ:</label><span>{customer.Address}</span></div>
                    </div>

                    <div className="internal-notes-container">
                        <h3><i className="fa-solid fa-lock"></i> Ghi chú nội bộ</h3>

                        <div className="note-input-box">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Nhập nội dung ghi chú..."
                            />
                            <button className="btn-submit-note" onClick={handleAddNote}>Thêm ghi chú</button>
                        </div>

                        <div className="notes-display-list">
                            {loading ? <p>Đang tải...</p> : notes.length === 0 ? (
                                <p className="empty-msg">Chưa có ghi chú nào.</p>
                            ) : (
                                notes.map(note => (
                                    <div key={note.NoteID} className="note-card">
                                        <div className="note-header">
                                            <strong>{note.Author}</strong>
                                            <small>{new Date(note.CreatedAt).toLocaleString('vi-VN')}</small>
                                            <button className="del-btn" onClick={() => handleDeleteNote(note.NoteID)}>&times;</button>
                                        </div>
                                        <p className="note-text">{note.Content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-close-modal" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailModal;