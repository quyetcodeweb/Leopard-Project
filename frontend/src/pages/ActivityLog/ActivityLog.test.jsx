import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityLog from "./ActivityLog";
import axios from "axios";

/* ===== MOCK AXIOS ===== */
jest.mock("axios");

/* ===== MOCK DATA ===== */
const mockLogs = [
  {
    id: 1,
    created_at: "2025-01-01T10:00:00Z",
    username: "admin",
    action: "CREATE",
    entity: "Product",
    old_value: null,
    new_value: "{}"
  },
  {
    id: 2,
    created_at: "2025-01-02T10:00:00Z",
    username: "user1",
    action: "DELETE",
    entity: "Order",
    old_value: "{}",
    new_value: null
  }
];

const mockResponse = {
  data: {
    data: mockLogs,
    pagination: {
      totalPages: 2
    }
  }
};

describe("ActivityLog Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ================= TEST CASES ================= */

  test("Render trang ActivityLog", async () => {
    render(<ActivityLog />);

    expect(
      await screen.findByPlaceholderText("🔍 Username")
    ).toBeInTheDocument();
  });

  test("Load danh sách log từ API", async () => {
    render(<ActivityLog />);

    expect(await screen.findByText("admin")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
  });

  test("Hiển thị trạng thái không có dữ liệu", async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: [], pagination: { totalPages: 1 } }
    });

    render(<ActivityLog />);

    expect(
      await screen.findByText("Không có dữ liệu")
    ).toBeInTheDocument();
  });

test("Filter theo username gọi API với đúng params", async () => {
  render(<ActivityLog />);

  const input = screen.getByPlaceholderText("🔍 Username");

  fireEvent.change(input, { target: { value: "admin" } });

  await waitFor(() => {
    expect(axios.get).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          username: "admin"
        })
      })
    );
  });
});


    test("Filter theo action DELETE gọi API đúng params", async () => {
    render(<ActivityLog />);

    const select = screen.getByDisplayValue("-- Hành động --");

    fireEvent.change(select, { target: { value: "DELETE" } });

    await waitFor(() => {
        expect(axios.get).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
            params: expect.objectContaining({
            action: "DELETE"
            })
        })
        );
    });
    });

    test("Hiển thị pagination", async () => {
    render(<ActivityLog />);

    const page1 = await screen.findByRole("button", { name: "1" });
    expect(page1).toBeInTheDocument();
    });

  test("Click pagination gọi lại API", async () => {
    render(<ActivityLog />);

    const page2 = await screen.findByText("2");
    fireEvent.click(page2);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});
