import db from '../config/db.js';
import { createAuditLog } from "../services/auditLog.service.js";

const customerController = {

    // 📋 Lấy danh sách khách hàng (KHÔNG LOG)
    getAllCustomers: (req, res) => {
        db.query("SELECT * FROM Customer ORDER BY CreatedDate DESC", (err, results) => {
            if (err) return res.status(500).json({ message: "Lỗi truy vấn" });
            res.json(results);
        });
    },

    // 📜 Lịch sử mua hàng (KHÔNG LOG)
    getCustomerHistory: (req, res) => {
        const { id } = req.params;

        const sqlOrders = `
          SELECT OrderID, OrderDate, Total, Status 
          FROM \`Order\` 
          WHERE CustomerID = ? 
          ORDER BY OrderDate DESC`;

        db.query(sqlOrders, [id], (err, orders) => {
            if (err) return res.status(500).json({ message: "Lỗi truy vấn đơn hàng" });
            if (orders.length === 0) return res.json({ data: [] });

            const orderIds = orders.map(o => o.OrderID);

            const sqlDetails = `
              SELECT od.OrderID, p.ProductName AS name, od.Quantity AS qty, od.Price AS price 
              FROM OrderDetail od
              JOIN Product p ON od.ProductID = p.ProductID
              WHERE od.OrderID IN (?)`;

            db.query(sqlDetails, [orderIds], (err, details) => {
                if (err) return res.status(500).json({ message: "Lỗi truy vấn chi tiết" });

                const historyWithItems = orders.map(order => ({
                    ...order,
                    OrderDate: new Date(order.OrderDate).toLocaleString('vi-VN'),
                    Items: details.filter(d => d.OrderID === order.OrderID)
                }));

                res.json({ data: historyWithItems });
            });
        });
    },

    // 💾 Thêm / Cập nhật khách hàng (CÓ LOG)
    saveCustomer: (req, res) => {
        const { CustomerID, FullName, Phone, Email, Address, Label, Status } = req.body;

        if (CustomerID && CustomerID !== '') {

            db.query(
                "SELECT * FROM Customer WHERE CustomerID = ?",
                [CustomerID],
                (err, oldRows) => {
                    if (err) return res.status(500).json({ message: "Lỗi SQL" });

                    const oldCustomer = oldRows[0];

                    const sql = `
                      UPDATE Customer 
                      SET FullName=?, Phone=?, Email=?, Address=?, Label=?, Status=? 
                      WHERE CustomerID=?`;

                    db.query(
                        sql,
                        [FullName, Phone, Email, Address, Label, Status, CustomerID],
                        (err) => {
                            if (err) return res.status(500).json({ message: "Lỗi SQL: " + err.sqlMessage });

                            createAuditLog({
                                userId: req.user?.id,
                                username: req.user?.username,
                                role: req.user?.role,
                                action: "UPDATE",
                                entity: "customer",
                                entityId: CustomerID,
                                oldValue: oldCustomer,
                                newValue: { FullName, Phone, Email, Address, Label, Status },
                                req
                            });

                            res.json({ message: "Cập nhật thành công" });
                        }
                    );
                }
            );

        } else {

            const sql = `
              INSERT INTO Customer (FullName, Phone, Email, Address, Label, Status) 
              VALUES (?, ?, ?, ?, ?, ?)`;

            db.query(
                sql,
                [FullName, Phone, Email, Address, Label, Status],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Không thể thêm mới: " + err.sqlMessage });
                    }

                    createAuditLog({
                        userId: req.user?.id,
                        username: req.user?.username,
                        role: req.user?.role,
                        action: "CREATE",
                        entity: "customer",
                        entityId: result.insertId,
                        oldValue: null,
                        newValue: { FullName, Phone, Email, Address, Label, Status },
                        req
                    });

                    res.json({ message: "Thêm thành công", id: result.insertId });
                }
            );
        }
    },

    // ❌ Xóa khách hàng (CÓ LOG)
    deleteCustomer: (req, res) => {
        const id = req.params.id;

        db.query(
            "SELECT * FROM Customer WHERE CustomerID = ?",
            [id],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Lỗi SQL" });
                if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy khách hàng" });

                const oldCustomer = rows[0];

                db.query(
                    "DELETE FROM Customer WHERE CustomerID = ?",
                    [id],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Khách hàng có thể đang có đơn hàng liên quan"
                            });
                        }

                        createAuditLog({
                            userId: req.user?.id,
                            username: req.user?.username,
                            role: req.user?.role,
                            action: "DELETE",
                            entity: "customer",
                            entityId: id,
                            oldValue: oldCustomer,
                            newValue: null,
                            req
                        });

                        res.json({ message: "Xóa thành công" });
                    }
                );
            }
        );
    },

    // 📝 Lấy ghi chú (KHÔNG LOG)
    getNotes: (req, res) => {
        const { id } = req.params;
        db.query(
            "SELECT * FROM CustomerNote WHERE CustomerID = ? ORDER BY CreatedAt DESC",
            [id],
            (err, results) => {
                if (err) return res.status(500).json({ message: "Lỗi lấy ghi chú" });
                res.json(results);
            }
        );
    },

    // ➕ Thêm ghi chú (CÓ LOG)
    addNote: (req, res) => {
        const { id } = req.params;
        const { content, author } = req.body;

        const sql = "INSERT INTO CustomerNote (CustomerID, Content, Author) VALUES (?, ?, ?)";

        db.query(sql, [id, content, author], (err, result) => {
            if (err) return res.status(500).json({ message: "Lỗi thêm ghi chú" });

            createAuditLog({
                userId: req.user?.id,
                username: req.user?.username,
                role: req.user?.role,
                action: "CREATE",
                entity: "customer_note",
                entityId: result.insertId,
                oldValue: null,
                newValue: { CustomerID: id, Content: content, Author: author },
                req
            });

            res.json({ id: result.insertId, CustomerID: id, Content: content, Author: author });
        });
    },

    // 🗑 Xóa ghi chú (CÓ LOG)
    deleteNote: (req, res) => {
        const { noteId } = req.params;

        db.query(
            "SELECT * FROM CustomerNote WHERE NoteID = ?",
            [noteId],
            (err, rows) => {
                if (err) return res.status(500).json({ message: "Lỗi SQL" });

                const oldNote = rows[0];

                db.query(
                    "DELETE FROM CustomerNote WHERE NoteID = ?",
                    [noteId],
                    (err) => {
                        if (err) return res.status(500).json({ message: "Lỗi xóa ghi chú" });

                        createAuditLog({
                            userId: req.user?.id,
                            username: req.user?.username,
                            role: req.user?.role,
                            action: "DELETE",
                            entity: "customer_note",
                            entityId: noteId,
                            oldValue: oldNote,
                            newValue: null,
                            req
                        });

                        res.json({ message: "Đã xóa ghi chú" });
                    }
                );
            }
        );
    }
};

export default customerController;
