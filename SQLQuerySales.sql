-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS SalesManagementDB
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE SalesManagementDB;

-- Bảng danh mục sản phẩm
CREATE TABLE Category (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    Description VARCHAR(255)
);

-- Bảng sản phẩm
CREATE TABLE Product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Description VARCHAR(255),
    Image VARCHAR(255),
    CategoryID INT NOT NULL,
    Stock INT DEFAULT 0 CHECK (Stock >= 0),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- Bảng khách hàng
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) UNIQUE,
    Email VARCHAR(100),
    Address VARCHAR(255),
    CreatedDate DATETIME DEFAULT NOW()
);

-- Bảng nhân viên
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Role VARCHAR(50),
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    CHECK (Role IN ('Admin', 'Sales', 'Warehouse'))
);

-- Bảng voucher
CREATE TABLE Voucher (
    VoucherID INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) UNIQUE NOT NULL,
    DiscountPercent DECIMAL(5,2) CHECK (DiscountPercent BETWEEN 0 AND 100),
    ExpirationDate DATETIME NOT NULL,
    MaxUse INT DEFAULT 1 CHECK (MaxUse >= 1),
    UsedCount INT DEFAULT 0 CHECK (UsedCount >= 0)
);

-- Bảng thanh toán
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    Method VARCHAR(50) NOT NULL,
    PaymentDate DATETIME DEFAULT NOW(),
    Amount DECIMAL(10,2) CHECK (Amount >= 0)
);

-- Bảng đơn hàng
CREATE TABLE `Order` (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    StaffID INT NULL,
    OrderDate DATETIME DEFAULT NOW(),
    Total DECIMAL(10,2) CHECK (Total >= 0),
    VoucherID INT NULL,
    PaymentID INT NULL,
    Status VARCHAR(50) DEFAULT 'Đang xử lý',
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (VoucherID) REFERENCES Voucher(VoucherID),
    FOREIGN KEY (PaymentID) REFERENCES Payment(PaymentID)
);

-- Bảng chi tiết đơn hàng
CREATE TABLE OrderDetail (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10,2) NOT NULL CHECK (UnitPrice >= 0),
    FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- Bảng nhập hàng / tồn kho
CREATE TABLE Inventory (
    InventoryID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT NOT NULL,
    QuantityIn INT NOT NULL CHECK (QuantityIn > 0),
    ImportDate DATETIME DEFAULT NOW(),
    Supplier VARCHAR(100),
    StaffID INT NULL,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);
ALTER TABLE Product ADD COLUMN WarningStock INT DEFAULT 5;
ALTER TABLE Product ADD COLUMN IsActive BIT DEFAULT 1;
ALTER TABLE Product MODIFY COLUMN Image LONGTEXT;

-- 1. Category
INSERT INTO Category (CategoryName, Description) VALUES
('Rau củ', 'Các loại rau củ tươi ngon'),
('Thực phẩm', 'Các loại thực phẩm khô, đóng gói'),
('Đồ uống', 'Nước ngọt, nước ép, trà, cà phê'),
('Hóa phẩm', 'Sản phẩm hóa chất, vệ sinh');

-- 2. Product
INSERT INTO Product (ProductName, Price, Description, Image, CategoryID, Stock) VALUES
('Rau muống', 15.0, 'Rau muống tươi', 'rau_muong.jpg', 1, 50),
('Cà rốt', 12.0, 'Cà rốt sạch', 'ca_rot.jpg', 1, 40),
('Bánh mì', 20.0, 'Bánh mì nóng', 'banh_mi.jpg', 2, 100),
('Mì gói', 10.0, 'Mì gói ăn nhanh', 'mi_goi.jpg', 2, 200),
('Nước suối', 8.0, 'Nước suối 500ml', 'nuoc_suoi.jpg', 3, 150),
('Bột giặt OMO', 80.0, 'Bột giặt OMO 2kg', 'bom_omo.jpg', 4, 30);

-- 3. Customer
INSERT INTO Customer (FullName, Phone, Email, Address) VALUES
('Nguyen Van A', '0901234567', 'a@gmail.com', 'Hà Nội'),
('Tran Thi B', '0912345678', 'b@gmail.com', 'Hồ Chí Minh'),
('Le Van C', '0987654321', 'c@gmail.com', 'Đà Nẵng');

-- 4. Staff
INSERT INTO Staff (FullName, Role, Username, PasswordHash, Phone) VALUES
('Admin One', 'Admin', 'admin', 'admin123', '0901111111'),
('Staff Sales', 'Sales', 'sales1', 'sales123', '0902222222'),
('Warehouse Staff', 'Warehouse', 'wh1', 'wh123', '0903333333');

-- 5. Voucher
INSERT INTO Voucher (Code, DiscountPercent, ExpirationDate, MaxUse, UsedCount) VALUES
('SALE10', 10.0, '2025-12-31 23:59:59', 100, 0),
('NEWYEAR20', 20.0, '2025-12-31 23:59:59', 50, 0);

-- Tạo đơn hàng mẫu (Order)
INSERT INTO `Order` (CustomerID, StaffID, Total, Status) VALUES
(1, 2, 55.0, 'Đang xử lý'),
(2, 2, 30.0, 'Hoàn thành');

-- Chi tiết đơn hàng (OrderDetail)
INSERT INTO OrderDetail (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 2, 2, 15.0),   -- 2 x Rau muống
(1, 3, 1, 20.0),   -- 1 x Bánh mì
(2, 4, 3, 10.0);   -- 3 x Mì gói

-- Inventory
INSERT INTO Inventory (ProductID, QuantityIn, Supplier, StaffID) VALUES
(2, 100, 'Nông trại A', 3),
(3, 200, 'Cửa hàng B', 3),
(4, 300, 'Nhà cung cấp C', 3);
