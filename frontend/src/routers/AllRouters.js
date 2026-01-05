import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";

import Donhang from "../components/Donhang/Donhang";
import ProductList from "../pages/Products/ProductList";
import HistoryOrder from "../components/Lichsudonhang/Lichsudonhang";
import UserManager from "../pages/Admin/UserManager";
import VoucherManager from "../pages/Admin/VoucherManager";
import InventoryList from "../pages/Inventory/InventoryList";
import CustomerList from "../pages/Customers/CustomerList";
import ActivityLog from "../pages/ActivityLog/ActivityLog";
// ✅ Lazy load trang tổng quan
const RevenueOverview = lazy(() =>
  import("../pages/Admin/Revenue/RevenueOverview")
);

const AllRouters = () => {
  return (
    <Routes>
      {/* ===== DASHBOARD / TỔNG QUAN ===== */}
      <Route
        index
        element={
          <Suspense fallback={<div />}>
            <RevenueOverview />
          </Suspense>
        }
      />

      {/* ===== SẢN PHẨM ===== */}
      <Route path="products" element={<ProductList />} />
      <Route path="warehouse" element={<InventoryList />} />
      <Route path="HistoryControl" element={<ActivityLog />} />
      {/* ===== ĐƠN HÀNG ===== */}
      <Route path="HistoryOrder" element={<HistoryOrder />} />
      <Route path="orders/received" element={<Donhang status="daxuly" />} />
      <Route path="orders/processing" element={<Donhang status="dangxuly" />} />
      <Route path="orders/delivered" element={<Donhang status="danggiao" />} />
      <Route path="orders/cancelled" element={<Donhang status="dahuy" />} />

      {/* ===== ADMIN ===== */}
      <Route element={<ProtectedAdminRoute allowedRoles={["admin", "manager", "staff"]} />}>
        <Route path="user" element={<UserManager />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="coupons" element={<VoucherManager />} />
      </Route>
    </Routes>
  );
};

export default AllRouters;
