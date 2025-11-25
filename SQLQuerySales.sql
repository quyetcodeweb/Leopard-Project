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

-- 🥬 Thêm 50 sản phẩm đa dạng vào bảng Product
INSERT INTO Product (ProductName, Price, Description, Image, CategoryID, Stock, WarningStock, IsActive) VALUES
-- Rau củ
('Cải xanh', 18.00, 'Cải xanh tươi, giàu vitamin', 'cai_xanh.jpg', 1, 60, 5, 1),
('Bí đỏ', 25.00, 'Bí đỏ hữu cơ, dùng nấu canh', 'bi_do.jpg', 1, 80, 10, 1),
('Khoai tây', 20.00, 'Khoai tây Đà Lạt', 'khoai_tay.jpg', 1, 100, 10, 1),
('Cà chua', 22.00, 'Cà chua bi tươi', 'ca_chua.jpg', 1, 90, 10, 1),
('Bắp cải', 17.00, 'Bắp cải trắng', 'bap_cai.jpg', 1, 70, 8, 1),
('Rau ngót', 15.00, 'Rau ngót sạch', 'rau_ngot.jpg', 1, 50, 5, 1),
('Mồng tơi', 14.00, 'Rau mồng tơi tươi', 'mong_toi.jpg', 1, 40, 5, 1),
('Hành lá', 12.00, 'Hành lá tươi', 'hanh_la.jpg', 1, 45, 5, 1),
('Ngò rí', 10.00, 'Ngò rí (rau mùi)', 'ngo_ri.jpg', 1, 30, 5, 1),
('Ớt chuông đỏ', 28.00, 'Ớt chuông đỏ nhập khẩu', 'ot_chuong_do.jpg', 1, 60, 8, 1),
('Củ dền', 19.00, 'Củ dền tươi', 'cu_den.jpg', 1, 35, 5, 1),
('Khoai lang', 16.00, 'Khoai lang mật', 'khoai_lang.jpg', 1, 55, 5, 1),
('Su hào', 13.00, 'Su hào tươi', 'su_hao.jpg', 1, 25, 5, 1),
('Cà tím', 18.00, 'Cà tím dài', 'ca_tim.jpg', 1, 65, 5, 1),
('Rau dền', 12.00, 'Rau dền sạch', 'rau_den.jpg', 1, 50, 5, 1),

-- Thực phẩm khô / đóng gói
('Gạo tám thơm', 22.00, 'Gạo thơm hạt dài', 'gao_tam.jpg', 2, 150, 10, 1),
('Đường trắng', 18.00, 'Đường tinh luyện', 'duong_trang.jpg', 2, 200, 15, 1),
('Muối i-ốt', 8.00, 'Muối i-ốt sạch', 'muoi_iod.jpg', 2, 120, 10, 1),
('Nước mắm Nam Ngư', 35.00, 'Nước mắm Nam Ngư 500ml', 'nuoc_mam_nam_ngu.jpg', 2, 80, 5, 1),
('Dầu ăn Tường An', 45.00, 'Dầu ăn 1L', 'dau_an_ta.jpg', 2, 90, 10, 1),
('Bột ngọt Ajinomoto', 30.00, 'Bột ngọt 400g', 'bot_ngot_aji.jpg', 2, 100, 10, 1),
('Tương ớt Chinsu', 25.00, 'Tương ớt Chinsu 250ml', 'tuong_ot_chinsu.jpg', 2, 70, 8, 1),
('Nước tương Maggi', 28.00, 'Nước tương 500ml', 'nuoc_tuong_mag.jpg', 2, 75, 8, 1),
('Bột canh Hải Châu', 12.00, 'Bột canh 200g', 'bot_canh.jpg', 2, 85, 10, 1),
('Trứng gà ta', 30.00, 'Trứng gà ta 10 quả', 'trung_ga_ta.jpg', 2, 120, 15, 1),
('Thịt bò khô', 120.00, 'Thịt bò khô 200g', 'thit_bo_kho.jpg', 2, 40, 5, 1),
('Lạp xưởng', 80.00, 'Lạp xưởng tươi', 'lap_xuong.jpg', 2, 50, 5, 1),
('Bánh quy Cosy', 35.00, 'Bánh quy bơ Cosy', 'banh_quy.jpg', 2, 60, 8, 1),
('Bột mì Meizan', 28.00, 'Bột mì đa dụng 1kg', 'bot_mi_meizan.jpg', 2, 110, 10, 1),
('Phở khô Vifon', 20.00, 'Phở khô 500g', 'pho_kho.jpg', 2, 95, 10, 1),

-- Đồ uống
('Coca-Cola lon', 12.00, 'Coca-Cola 330ml', 'coca.jpg', 3, 200, 15, 1),
('Pepsi lon', 12.00, 'Pepsi 330ml', 'pepsi.jpg', 3, 180, 15, 1),
('7Up lon', 12.00, '7Up 330ml', '7up.jpg', 3, 160, 15, 1),
('Trà xanh Không độ', 15.00, 'Trà xanh chai 500ml', 'tra_khongdo.jpg', 3, 140, 10, 1),
('Cà phê G7', 55.00, 'Cà phê hòa tan G7 15 gói', 'ca_phe_g7.jpg', 3, 90, 10, 1),
('Nước ép cam', 20.00, 'Nước ép cam tươi', 'nuoc_ep_cam.jpg', 3, 100, 10, 1),
('Sữa tươi Vinamilk', 18.00, 'Sữa tươi tiệt trùng 180ml', 'sua_vinamilk.jpg', 3, 120, 10, 1),
('Sữa đậu nành Fami', 15.00, 'Sữa đậu nành Fami 200ml', 'fami.jpg', 3, 130, 10, 1),
('Red Bull', 25.00, 'Nước tăng lực Red Bull 250ml', 'redbull.jpg', 3, 110, 10, 1),
('Trà sữa đóng chai', 22.00, 'Trà sữa matcha', 'tra_sua.jpg', 3, 95, 10, 1),
('Bia Heineken', 25.00, 'Bia lon Heineken 330ml', 'heineken.jpg', 3, 80, 10, 1),
('Bia Tiger', 23.00, 'Bia lon Tiger 330ml', 'tiger.jpg', 3, 90, 10, 1),
('Nước suối Lavie', 7.00, 'Nước suối Lavie 500ml', 'lavie.jpg', 3, 150, 10, 1),
('Trà chanh C2', 14.00, 'Trà chanh 500ml', 'tra_c2.jpg', 3, 130, 10, 1),
('Soda chanh muối', 16.00, 'Nước soda chanh muối', 'soda_chanh_muoi.jpg', 3, 70, 10, 1),

-- Hóa phẩm / vệ sinh
('Nước rửa chén Sunlight', 35.00, 'Nước rửa chén Sunlight 750ml', 'sunlight.jpg', 4, 100, 10, 1),
('Nước lau sàn Gift', 40.00, 'Nước lau sàn hương chanh', 'gift.jpg', 4, 90, 10, 1),
('Bột giặt Tide', 85.00, 'Bột giặt 2kg', 'tide.jpg', 4, 80, 10, 1),
('Nước xả Downy', 55.00, 'Nước xả Downy 800ml', 'downy.jpg', 4, 75, 10, 1),
('Kem đánh răng P/S', 25.00, 'Kem đánh răng P/S 180g', 'ps.jpg', 4, 120, 10, 1),
('Bàn chải Colgate', 18.00, 'Bàn chải đánh răng Colgate', 'colgate.jpg', 4, 110, 10, 1),
('Khăn giấy Pulppy', 22.00, 'Khăn giấy hộp 200 tờ', 'pulppy.jpg', 4, 90, 10, 1),
('Giấy vệ sinh Bless You', 35.00, 'Giấy vệ sinh 10 cuộn', 'blessyou.jpg', 4, 130, 10, 1),
('Nước tẩy Javel', 30.00, 'Nước tẩy quần áo', 'javel.jpg', 4, 85, 10, 1),
('Nước rửa tay Lifebuoy', 28.00, 'Nước rửa tay diệt khuẩn', 'lifebuoy.jpg', 4, 95, 10, 1),
('Xịt phòng Glade', 40.00, 'Xịt phòng hương hoa', 'glade.jpg', 4, 80, 10, 1),
('Kem dưỡng da Vaseline', 75.00, 'Kem dưỡng 250ml', 'vaseline.jpg', 4, 70, 10, 1),
('Dầu gội Clear', 65.00, 'Dầu gội Clear 650ml', 'clear.jpg', 4, 90, 10, 1),
('Dầu xả Dove', 60.00, 'Dầu xả Dove 650ml', 'dove.jpg', 4, 85, 10, 1),
('Nước súc miệng Listerine', 70.00, 'Chai 500ml', 'listerine.jpg', 4, 75, 10, 1);
CREATE TABLE users (
  user_id int NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  password_hash varchar(255) NOT NULL,
  role enum('admin','user','customer','staff','manager') NOT NULL DEFAULT 'customer',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO users VALUES (1,'admin_user','admin@gmail.com','$2b$10$iM8D2.wB/G8P9ZzYw2jEjeq5vF3t2dF3x/E9G4t8','admin','2025-11-13 06:41:31'),(3,'thang1','le7283140@gmail.com','Quocthang__2004','manager','2025-11-13 12:24:43'),(10,'thangcui','ssddsd2@gmail.com','Quocthang__2004','customer','2025-11-15 08:24:55');
