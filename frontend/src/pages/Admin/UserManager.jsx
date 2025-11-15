import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import "./UserManager.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const UserManager = () => {
  const [users, setUsers] = useState([]);
const [showAddModal, setShowAddModal] = useState(false);

const [newUsername, setNewUsername] = useState("");
const [newEmail, setNewEmail] = useState("");
const [newPassword, setNewPassword] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Lỗi tải users:", error);
    }
  };

  /* === EDIT ROLE === */
  const openEditRole = (user) => {
    if (user.role === "admin") return;
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const updateRole = async () => {
    await fetch(`http://localhost:5000/api/users/${selectedUser.user_id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    setShowRoleModal(false);
    fetchUsers();
  };

  /* === DELETE === */
  const openDeleteUser = (user) => {
    if (user.role === "admin") return;
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    await fetch(`http://localhost:5000/api/users/${selectedUser.user_id}`, {
      method: "DELETE",
    });

    setShowDeleteModal(false);
    fetchUsers();
  };

  /* === CREATE USER === */
  const createUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Lỗi không xác định");
      return;
    }

    alert("Tạo tài khoản thành công!");
    setShowAddModal(false);
    fetchUsers();
  } catch (error) {
    console.error("Lỗi tạo user:", error);
  }
};


  /* === ROLE BADGE === */
  const renderRoleBadge = (role) => {
    const classes = {
      admin: "role-badge role-admin",
      manager: "role-badge role-manager",
      staff: "role-badge role-staff",
      user: "role-badge role-user",
    };
    return <span className={classes[role]}>{role}</span>;
  };

  return (
    <Layout title="Quản lý người dùng">
      <div className="user-manager-wrapper">
        <div className="user-manager">

          <div className="header-row">
            <h2>Quản lý phân quyền</h2>
          </div>

          {/* === TABLE === */}
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

                <select
                  className="modal-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>

                <div className="modal-actions">
                  <button className="save-btn" onClick={updateRole}>Lưu</button>
                  <button className="cancel-btn" onClick={() => setShowRoleModal(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}

          {/* =====================
              MODAL: DELETE
          ====================== */}
          {showDeleteModal && (
            <div className="modal">
              <div className="modal-content warning">
                <h3>Bạn có chắc muốn xoá?</h3>
                <p>User: <b>{selectedUser.username}</b></p>

                <div className="modal-actions">
                  <button className="delete-confirm-btn" onClick={deleteUser}>Xoá</button>
                  <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}

          {/* =====================
              MODAL: CREATE USER
          ====================== */}
          {showCreateModal && (
            <div className="modal">
                <div className="modal-content modern">

                <h3 className="modal-title">Thêm tài khoản mới</h3>

                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                    className="input"
                    placeholder="Nhập tên đăng nhập"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                    className="input"
                    placeholder="Nhập email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                    className="input"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Vai trò</label>
                    <select
                    className="select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    </select>
                </div>

                <div className="modal-actions center">
                    <button className="btn-primary" onClick={createUser}>Thêm</button>
                    <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy</button>
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
