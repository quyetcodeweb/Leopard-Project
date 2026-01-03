import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

import Donhang from "../components/Donhang/Donhang";
import ProductList from "../pages/Products/ProductList";
import HistoryOrder from "../components/Lichsudonhang/Lichsudonhang";
import UserManager from "../pages/Admin/UserManager";
import InventoryList from "../pages/Inventory/InventoryList";
import VoucherManager from "../pages/Admin/VoucherManager";

// ✅ LAZY LOAD TRANG TỔNG QUAN (FIX CRASH RECHARTS)
const RevenueOverview = lazy(() =>
  import("../pages/Admin/Revenue/RevenueOverview")
);

const AllRouters = (
  <>
    {/* ✅ TỔNG QUAN */}
    <Route
      path="/"
      element={
        <Suspense fallback={<div />}>
          <RevenueOverview />
        </Suspense>
      }
    />

    {/* SẢN PHẨM */}
    <Route path="products" element={<ProductList />} />

    {/* ĐƠN HÀNG */}
    <Route path="orders/received" element={<Donhang status="daxuly" />} />
    <Route path="orders/processing" element={<Donhang status="dangxuly" />} />
    <Route path="orders/delivered" element={<Donhang status="danggiao" />} />
    <Route path="orders/cancelled" element={<Donhang status="dahuy" />} />

    {/* KHÁC */}
    <Route path="HistoryOrder" element={<HistoryOrder />} />
    <Route path="user" element={<UserManager />} />
    <Route path="warehouse" element={<InventoryList />} />
    <Route path="coupons" element={<VoucherManager />} />
  </>
);

export default AllRouters;
