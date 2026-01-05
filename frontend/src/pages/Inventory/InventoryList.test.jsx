import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InventoryList from "./InventoryList";
import axios from "axios";

/* ================= MOCK AXIOS ================= */
jest.mock("axios");

/* ================= MOCK XLSX ================= */
jest.mock("xlsx", () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

/* ================= MOCK POPUPS ================= */
jest.mock("../../components/Popups/ImportPopup", () => () => (
  <div>ImportPopup</div>
));

jest.mock("../../components/Popups/InOutModal", () => () => (
  <div>InOutModal</div>
));

jest.mock("../../components/Popups/WarningPopup", () => ({ warnings }) => (
  <div>
    WarningPopup
    {warnings?.map((w) => (
      <div key={w.ProductID}>{w.ProductName}</div>
    ))}
  </div>
));

/* ================= MOCK window.open ================= */
beforeAll(() => {
  window.open = jest.fn(() => ({
    document: {
      write: jest.fn(),
      close: jest.fn(),
    },
    print: jest.fn(),
  }));
});

/* ================= MOCK DATA ================= */
const mockProducts = [
  {
    ProductID: 1,
    ProductName: "Sản phẩm A",
    Stock: 10,
    WarningStock: 5,
    CategoryID: 1,
    Image: "",
  },
  {
    ProductID: 2,
    ProductName: "Sản phẩm B",
    Stock: 3,
    WarningStock: 5,
    CategoryID: 2,
    Image: "",
  },
];

const mockCategories = [
  { CategoryID: 1, CategoryName: "Điện thoại" },
  { CategoryID: 2, CategoryName: "Laptop" },
];

describe("InventoryList Component", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/products")) {
        return Promise.resolve({ data: mockProducts });
      }

      if (url.includes("/category")) {
        return Promise.resolve({ data: mockCategories });
      }

      return Promise.reject(new Error("Unknown API"));
    });

    axios.put.mockResolvedValue({});
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ================= TEST CASES ================= */

  test("Render trang InventoryList", async () => {
    render(<InventoryList />);

    expect(
      await screen.findByPlaceholderText("🔍 Tìm kiếm...")
    ).toBeInTheDocument();
  });

  test("Load danh sách sản phẩm", async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
      expect(screen.getByText("Sản phẩm B")).toBeInTheDocument();
    });
  });

    test("Load danh mục vào dropdown", async () => {
    const { container } = render(<InventoryList />);

    await waitFor(() => {
        const options = container.querySelectorAll("option");
        const values = Array.from(options).map(o => o.textContent);

        expect(values).toContain("Điện thoại");
        expect(values).toContain("Laptop");
    });
    });

  test("Hiển thị cảnh báo tồn kho thấp", async () => {
    render(<InventoryList />);

    expect(await screen.findByText("WarningPopup")).toBeInTheDocument();
    expect(screen.getByText("Sản phẩm B")).toBeInTheDocument(); // đúng logic
  });

  test("Lọc sản phẩm theo tên", async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
      expect(screen.getByText("Sản phẩm B")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("🔍 Tìm kiếm...");
    fireEvent.change(input, { target: { value: "A" } });

    await waitFor(() => {
      expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
      expect(screen.queryByText("Sản phẩm B")).not.toBeInTheDocument();
    });
  });

  test("Hiển thị pagination", async () => {
    render(<InventoryList />);

    expect(await screen.findByRole("button", { name: "1" }))
      .toBeInTheDocument();
  });
});
