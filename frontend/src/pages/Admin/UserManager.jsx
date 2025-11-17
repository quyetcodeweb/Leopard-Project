import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import "./UserManager.css";
import { FaEdit, FaTrash } from "react-icons/fa";

/* 🌟 Mapping Role: English → Vietnamese */
const ROLE_MAP = {
  admin: "Quản trị viên",
  manager: "Quản lý",
  staff: "Nhân viên bán hàng",
  customer: "Khách hàng",
};

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ===== LOAD USERS ===== */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Lỗi tải users:", error);
    }
  };

  /* ===== EDIT ROLE ===== */
  const openEditRole = (user) => {
    if (user.role === "admin") return; // admin không được sửa
    setSelectedUser(user);
    setNewRole(user.role); // giữ nguyên EN để gửi API
    setShowRoleModal(true);
  };

  const updateRole = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/users/${selectedUser.user_id}/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }), // Gửi EN
        }
      );

      setShowRoleModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi update role:", error);
    }
  };

  /* ===== DELETE USER ===== */
  const openDeleteUser = (user) => {
    if (user.role === "admin") return; // admin không được xóa
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${selectedUser.user_id}`, {
        method: "DELETE",
      });

      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi xóa user:", error);
    }
  };

  /* ===== HIỂN THỊ BADGE ROLE VIETNAMESE ===== */
  const renderRoleBadge = (role) => {
    const classes = {
      admin: "role-badge role-admin",
      manager: "role-badge role-manager",
      staff: "role-badge role-staff",
      customer: "role-badge role-customer",
    };
    return (
      <span className={classes[role]}>
        {ROLE_MAP[role] || "Không xác định"}
      </span>
    );
  };

  return (
    <Layout title="Quản lý người dùng">
      <div className="user-manager-wrapper">
        <div className="user-manager">
          <h2>Quản lý phân quyền</h2>

          {/* TABLE */}
          <table className="user-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{renderRoleBadge(user.role)}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => openEditRole(user)}
                        disabled={user.role === "admin"}
                        style={{ opacity: user.role === "admin" ? 0.35 : 1 }}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => openDeleteUser(user)}
                        disabled={user.role === "admin"}
                        style={{ opacity: user.role === "admin" ? 0.35 : 1 }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-row">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* =====================
              MODAL: EDIT ROLE
          ====================== */}
          {showRoleModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Đổi vai trò cho: {selectedUser.username}</h3>

                {/* Dropdown tiếng Việt → gửi role English */}
                <select
                  className="modal-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="staff">Nhân viên bán hàng</option>
                  <option value="manager">Quản lý</option>
                </select>

                <div className="modal-actions">
                  <button className="save-btn" onClick={updateRole}>
                    Lưu
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowRoleModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================
              MODAL: DELETE USER
          ====================== */}
          {showDeleteModal && (
            <div className="modal">
              <div className="modal-content warning">
                <h3>Bạn có chắc muốn xoá?</h3>
                <p>
                  User: <b>{selectedUser.username}</b>
                </p>

                <div className="modal-actions">
                  <button className="delete-confirm-btn" onClick={deleteUser}>
                    Xoá
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserManager;
