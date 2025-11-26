import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./components/Thongbao/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
      <App />
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
