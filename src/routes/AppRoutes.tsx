import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes.config";

import Marketplace from "../pages/Marketplace";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import WishlistPage from "../pages/WishlistPage";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import PaymentPage from "../pages/PaymentPage";
import BuyerDashboard from "../pages/BuyerDashboard";
import SellerDashboard from "../pages/SellerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProductDetails from "../pages/ProductDetails";
import SellerProfile from "../pages/SellerProfile";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export { ROUTES };

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publicly accessible routes */}
        <Route path={ROUTES.HOME} element={<Marketplace />} />
        <Route path={ROUTES.MARKETPLACE} element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path={ROUTES.SELLER_PROFILE} element={<SellerProfile />} />
        <Route path="/seller/:sellerId" element={<SellerProfile />} />


        {/* Routes restricted to unauthenticated users */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Authenticated user routes */}
        <Route
          path={ROUTES.WISHLIST}
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDERS}
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PAYMENT}
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.BUYER_DASHBOARD}
          element={
            <ProtectedRoute allowedRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/dashboard"
          element={<Navigate to={ROUTES.BUYER_DASHBOARD} replace />}
        />
        <Route
          path={ROUTES.SELLER_DASHBOARD}
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={<Navigate to={ROUTES.SELLER_DASHBOARD} replace />}
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
        />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}