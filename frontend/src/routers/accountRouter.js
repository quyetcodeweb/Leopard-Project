import React from "react";
import { Route } from "react-router-dom";
import ProductPage from "../pages/Products/ProductList copy.jsx";

export default function productRouter() {
  return (
    <>
      <Route path="/products" element={<ProductPage />} />
    </>
  );
}
