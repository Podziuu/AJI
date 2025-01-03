import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import Register from "./pages/Register.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<ProtectedRoute />} >
         <Route path="/" element={<Home />} />
          <Route path="/cart" element={<App />} />
          <Route path="/orders" element={<App />} />
          <Route path="/initialize" element={<App />} />
          <Route path="/reviews" element={<App />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
