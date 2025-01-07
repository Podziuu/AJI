import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import Register from "./pages/Register.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import Orders from "./pages/Orders.tsx";
import Init from "./pages/Init.tsx";
import Reviews from "./pages/Reviews.tsx";
import Cart from "./pages/Cart.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
import CartForm from "./pages/Checkout.tsx";
import EditProduct from "./pages/EditProduct.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/checkout" element={<CartForm />} />
        </Route>
        <Route path="" element={<ProtectedRoute allowedRoles={["WORKER"]} />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/initialize" element={<Init />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
