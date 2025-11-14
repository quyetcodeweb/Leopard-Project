// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Donhang from "./components/Donhang/Donhang";
import Lichsudonhang from "./components/Lichsudonhang/Lichsudonhang";
import Taodonhang from "./pages/QLDH/Taodonhang";
import Chitietdonhang from "./pages/QLDH/Chitietdonhang";
import Chitietlsdonhang from "./pages/QLDH/Chitietlsdonhang";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Trang đơn hàng có thể nhận tab từ state */}
        <Route path="/donhang" element={<Donhang />} />

        <Route path="/taodonhang" element={<Taodonhang />} />
        <Route path="/chitietdonhang/:id" element={<Chitietdonhang />} />
        <Route path="/lichsudonhang" element={<Lichsudonhang />} />
        <Route path="/chitietlsdonhang/:id" element={<Chitietlsdonhang />} />
        <Route path="/" element={<Lichsudonhang/>} />
      </Routes>
    </Layout>
  );
}

export default App;
