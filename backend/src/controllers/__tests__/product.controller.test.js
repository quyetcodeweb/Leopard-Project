import { jest } from "@jest/globals";

// Mock mysql2 để db.js không connect thật
jest.mock("mysql2", () => ({
  createConnection: jest.fn(() => ({
    query: jest.fn(),
    connect: jest.fn((cb) => cb(null))
  }))
}));

// Mock db.js default export
jest.mock("../../config/db.js", () => ({
  __esModule: true,
  default: {
    query: jest.fn()
  }
}));

// Mock audit log service
jest.mock("../../services/auditLog.service.js", () => ({
  __esModule: true,
  createAuditLog: jest.fn()
}));

import db from "../../config/db.js";
import { createAuditLog } from "../../services/auditLog.service.js";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../productController.js";

// mock req/res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

const mockReq = (data = {}) => ({
  ...data,
  user: { id: 1, username: "admin", role: "ADMIN" }
});

afterEach(() => jest.clearAllMocks());

describe("getProducts", () => {
  it("should return product list", async () => {
    const req = {};
    const res = mockRes();

    db.query.mockImplementation((sql, cb) => {
      cb(null, [{ ProductID: 1, IsActive: Buffer.from([1]) }]);
    });

    await getProducts(req, res);

    expect(res.json).toHaveBeenCalledWith([{ ProductID: 1, IsActive: 1 }]);
  });
});

// addProduct
describe("addProduct", () => {
  it("should add product and create audit log", async () => {
    const req = mockReq({
      body: { ProductName: "Test", Price: 100, Stock: 10, IsActive: 1 }
    });
    const res = mockRes();

    db.query.mockImplementation((sql, params, cb) => {
      cb(null, { insertId: 99 });
    });

    await addProduct(req, res);

    expect(createAuditLog).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: "✅ Thêm sản phẩm thành công!", id: 99 });
  });
});

// updateProduct
describe("updateProduct", () => {
  it("should update product and log audit", async () => {
    const req = mockReq({ params: { id: 1 }, body: { ProductName: "New name", Stock: 5 } });
    const res = mockRes();

    db.query
      .mockImplementationOnce((sql, params, cb) => { cb(null, [{ ProductID: 1, Stock: 10 }]); })
      .mockImplementationOnce((sql, params, cb) => { cb(null); });

    await updateProduct(req, res);

    expect(createAuditLog).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "✅ Cập nhật sản phẩm thành công!" });
  });
});

// deleteProduct
describe("deleteProduct", () => {
  it("should delete product and log audit", async () => {
    const req = mockReq({ params: { id: 1 } });
    const res = mockRes();

    db.query
      .mockImplementationOnce((sql, params, cb) => { cb(null, [{ ProductID: 1 }]); })
      .mockImplementationOnce((sql, params, cb) => { cb(null); });

    await deleteProduct(req, res);

    expect(createAuditLog).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Xóa sản phẩm thành công!" });
  });
});
