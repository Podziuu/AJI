import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Main page that consists table of products */}
        <Route path="/cart" element={<App />} /> {/* Cart */}
        <Route path="/orders" element={<App />} /> {/* Order view only for worker role */}
        <Route path="/login" element={<App />} /> {/* Login page */}
        <Route path="/register" element={<App />} /> {/* Register page */}
        <Route path="/initialize" element={<App />} /> {/* Page to initialize db */}
        <Route path="/register" element={<App />} /> {/* Form to add new review and view all of reviews */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
