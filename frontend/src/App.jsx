import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AllRouters from "./routers/AllRouters";
import Login from "./pages/Auth/LoginPage";
import Register from "./pages/Auth/RegisterPage";

import ToastNotificationManager from "./components/Thongbao/ToastNotificationManager";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          {AllRouters}
        </Route>
      </Routes>

      <ToastNotificationManager />
    </>
  );
};

export default App;
