import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductList from "./ProductList";
import axios from "axios";

// ================= MOCK AXIOS =================
jest.mock("axios");

// ================= MOCK POPUPS =================
// Tránh crash khi popup render
jest.mock("../../components/Popups/AddProductPopup", () => () => (
  <div>AddProductPopup</div>
));
jest.mock("../../components/Popups/EditProductPopup", () => () => (
  <div>EditProductPopup</div>
));
jest.mock("../../components/Popups/DeleteProductPopup", () => () => (
  <div>DeleteProductPopup</div>
));

// ================= MOCK DATA =================
const mockProducts = [
  {
    ProductID: 1,
    ProductName: "Sản phẩm A",
    Price: 100,
    Stock: 10,
    WarningStock: 5,
    CategoryID: 1,
    IsActive: 1,
    Image: "",
  },
  {
    ProductID: 2,
    ProductName: "Sản phẩm B",
    Price: 200,
    Stock: 3,
    WarningStock: 5,
    CategoryID: 2,
    IsActive: 0,
    Image: "",
  },
];

const mockCategories = [
  { CategoryID: 1, CategoryName: "Điện thoại" },
  { CategoryID: 2, CategoryName: "Laptop" },
];

describe("ProductList Component", () => {
  // ================= SETUP =================
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("products")) {
        return Promise.resolve({ data: mockProducts });
      }
      if (url.includes("category")) {
        return Promise.resolve({ data: mockCategories });
      }
      return Promise.resolve({ data: [] });
    });

    axios.put.mockResolvedValue({ data: { IsActive: 0 } });
    axios.post.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= TEST CASES =================

  // ✅ TC01
  test("Render trang ProductList", async () => {
    render(<ProductList />);

    expect(
      await screen.findByPlaceholderText("🔍 Tìm kiếm ...")
    ).toBeInTheDocument();
  });

  // ✅ TC02
  test("Hiển thị danh sách sản phẩm từ API", async () => {
    render(<ProductList />);

    expect(await screen.findByText("Sản phẩm A")).toBeInTheDocument();
    expect(screen.getByText("Sản phẩm B")).toBeInTheDocument();
  });

  // ✅ TC03: Load danh mục vào dropdown
test("Load danh mục vào dropdown", async () => {
  render(<ProductList />);

  // Tìm select
  const categorySelect = await screen.findByRole("combobox");

  // Mở danh sách option (không bắt buộc nhưng an toàn)
  fireEvent.mouseDown(categorySelect);

  // Kiểm tra option
  expect(
    await screen.findByRole("option", { name: "Điện thoại" })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("option", { name: "Laptop" })
  ).toBeInTheDocument();
});

  // ✅ TC04
  test("Lọc sản phẩm theo tên", async () => {
    render(<ProductList />);

    const searchInput = await screen.findByPlaceholderText("🔍 Tìm kiếm ...");
    fireEvent.change(searchInput, { target: { value: "A" } });

    expect(await screen.findByText("Sản phẩm A")).toBeInTheDocument();
    expect(screen.queryByText("Sản phẩm B")).not.toBeInTheDocument();
  });

  // ✅ TC05
  test("Mở popup thêm sản phẩm", async () => {
    render(<ProductList />);

    const addBtn = await screen.findByRole("button", { name: /Thêm/i });
    fireEvent.click(addBtn);

    expect(await screen.findByText("AddProductPopup")).toBeInTheDocument();
  });

  // ✅ TC06
  test("Toggle trạng thái sản phẩm", async () => {
    render(<ProductList />);

    const statusDots = await screen.findAllByTitle(/Hiển thị|Ẩn/);
    fireEvent.click(statusDots[0]);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  // ✅ TC07
  test("Hiển thị phân trang", async () => {
    render(<ProductList />);

    expect(
      await screen.findByRole("button", { name: "1" })
    ).toBeInTheDocument();
  });
});
