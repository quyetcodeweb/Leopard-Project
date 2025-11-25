import React from "react";
import { Route } from "react-router-dom";
import Donhang from "../components/Donhang/Donhang";
import ProductList from "../pages/Products/ProductList";
import HistoryOrder from "../components/Lichsudonhang/Lichsudonhang";
import UserManager from "../pages/Admin/UserManager";
import VoucherManager from "../pages/Admin/VoucherManager";
const AllRouters = (
  <>
    <Route index element={<ProductList />} />
    <Route path="products" element={<ProductList />} />
    
    <Route path="orders/received" element={<Donhang status="daxuly" />} />
    <Route path="orders/processing" element={<Donhang status="dangxuly" />} />
    <Route path="orders/delivered" element={<Donhang status="danggiao" />} />
    <Route path="orders/cancelled" element={<Donhang status="dahuy" />} />
    <Route path="HistoryOrder" element={<HistoryOrder />} />
    <Route path="user" element={<UserManager />} />
    <Route path="coupons" element={<VoucherManager />} />
  </>
);

export default AllRouters;
