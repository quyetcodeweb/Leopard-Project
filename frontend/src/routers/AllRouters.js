import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";

import Donhang from "../components/Donhang/Donhang";
import ProductList from "../pages/Products/ProductList";
import HistoryOrder from "../components/Lichsudonhang/Lichsudonhang";
import UserManager from "../pages/Admin/UserManager";
import InventoryList from "../pages/Inventory/InventoryList";
import CustomerList from "../pages/Customers/CustomerList";

const AllRouters = () => (
  <Routes>
    <Route index element={<ProductList />} />
    <Route path="products" element={<ProductList />} />
    <Route path="history-order" element={<HistoryOrder />} />

    <Route path="orders/received" element={<Donhang status="daxuly" />} />
    <Route path="orders/processing" element={<Donhang status="dangxuly" />} />
    <Route path="orders/delivered" element={<Donhang status="danggiao" />} />
    <Route path="orders/cancelled" element={<Donhang status="dahuy" />} />
    <Route path="user" element={<UserManager />} />
    <Route path="warehouse" element={<InventoryList />} />

    <Route element={<ProtectedAdminRoute allowedRoles={["admin", "manager", "staff"]} />}>
      <Route path="customers" element={<CustomerList />} />
    </Route>
  </Routes>
);

export default AllRouters;