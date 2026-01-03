import db from '../config/db.js';

const customerController = {
    getAllCustomers: (req, res) => {
        db.query("SELECT * FROM Customer ORDER BY CreatedDate DESC", (err, results) => {
            if (err) return res.status(500).json({ message: "Lỗi truy vấn" });
            res.json(results);
        });
    },

    getCustomerHistory: (req, res) => {
        const { id } = req.params;

        // Truy vấn lấy danh sách đơn hàng của khách hàng
        const sqlOrders = "SELECT OrderID, OrderDate, Total, Status FROM `Order` WHERE CustomerID = ? ORDER BY OrderDate DESC";

        db.query(sqlOrders, [id], (err, orders) => {
            if (err) return res.status(500).json({ message: "Lỗi truy vấn đơn hàng" });

            if (orders.length === 0) {
                return res.json({ data: [] });
            }

            // Lấy danh sách OrderID để truy vấn chi tiết sản phẩm
            const orderIds = orders.map(o => o.OrderID);

            // Truy vấn lấy chi tiết sản phẩm cho tất cả các đơn hàng trên
            const sqlDetails = `
            SELECT od.OrderID, p.ProductName as name, od.Quantity as qty, od.Price as price 
            FROM OrderDetail od
            JOIN Product p ON od.ProductID = p.ProductID
            WHERE od.OrderID IN (?)`;

            db.query(sqlDetails, [orderIds], (err, details) => {
                if (err) return res.status(500).json({ message: "Lỗi truy vấn chi tiết" });

                // Gộp sản phẩm vào đúng đơn hàng tương ứng
                const historyWithItems = orders.map(order => ({
                    ...order,
                    // Chuyển định dạng ngày để hiển thị đẹp hơn
                    OrderDate: new Date(order.OrderDate).toLocaleString('vi-VN'),
                    Items: details.filter(d => d.OrderID === order.OrderID)
                }));

                res.json({ data: historyWithItems });
            });
        });
    },

    saveCustomer: (req, res) => {
        const { CustomerID, FullName, Phone, Email, Address, Label, Status } = req.body;

        if (CustomerID && CustomerID !== '') {
            const sql = "UPDATE Customer SET FullName=?, Phone=?, Email=?, Address=?, Label=?, Status=? WHERE CustomerID=?";
            db.query(sql, [FullName, Phone, Email, Address, Label, Status, CustomerID], (err, result) => {
                if (err) return res.status(500).json({ message: "Lỗi SQL: " + err.sqlMessage });
                res.json({ message: "Cập nhật thành công" });
            });
        } else {
            const sql = "INSERT INTO Customer (FullName, Phone, Email, Address, Label, Status) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(sql, [FullName, Phone, Email, Address, Label, Status], (err, result) => {
                if (err) {
                    console.error("Lỗi khi Insert:", err.sqlMessage);
                    return res.status(500).json({ message: "Không thể thêm mới: " + err.sqlMessage });
                }
                res.json({ message: "Thêm thành công", id: result.insertId });
            });
        }
    },

    deleteCustomer: (req, res) => {
        const id = req.params.id;

        db.query("DELETE FROM Customer WHERE CustomerID = ?", [id], (err, result) => {
            if (err) {
                console.error("Lỗi khi Delete:", err.sqlMessage);
                return res.status(500).json({
                    message: "Lỗi hệ thống: Khách hàng này có thể đang có đơn hàng liên quan nên không thể xóa."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng để xóa" });
            }

            res.json({ message: "Xóa thành công" });
        });
    },

    // Lấy tất cả ghi chú của 1 khách hàng
    getNotes: (req, res) => {
        const { id } = req.params;
        const sql = "SELECT * FROM CustomerNote WHERE CustomerID = ? ORDER BY CreatedAt DESC";
        db.query(sql, [id], (err, results) => {
            if (err) return res.status(500).json({ message: "Lỗi lấy ghi chú" });
            res.json(results);
        });
    },

    // Thêm ghi chú mới
    addNote: (req, res) => {
        const { id } = req.params;
        const { content, author } = req.body;
        const sql = "INSERT INTO CustomerNote (CustomerID, Content, Author) VALUES (?, ?, ?)";
        db.query(sql, [id, content, author], (err, result) => {
            if (err) return res.status(500).json({ message: "Lỗi thêm ghi chú" });
            res.json({ id: result.insertId, CustomerID: id, Content: content, Author: author });
        });
    },

    // Xóa ghi chú
    deleteNote: (req, res) => {
        const { noteId } = req.params;
        const sql = "DELETE FROM CustomerNote WHERE NoteID = ?";
        db.query(sql, [noteId], (err, result) => {
            if (err) return res.status(500).json({ message: "Lỗi xóa ghi chú" });
            res.json({ message: "Đã xóa ghi chú" });
        });
    }
};

export default customerController;