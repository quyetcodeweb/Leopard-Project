// routers/AllRouters.js
import React from "react";
import { Route } from "react-router-dom";
import ProductList from "../pages/Products/ProductList";

const AllRouters = [
  <Route index element={<ProductList />} key="index" />,
  <Route path="products" element={<ProductList />} key="products" />,
];

export default AllRouters;
