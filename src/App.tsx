
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AdminRoute from "@/components/AdminRoute";

// Import pages
import Index from "./pages/Index";
import ShopsPage from "./pages/ShopsPage";
import ShopDetails from "./pages/ShopDetails";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound";
import RegisterShopPage from "./pages/RegisterShopPage";
import ShopDashboardPage from "./pages/ShopDashboardPage";
import OffersPage from "./pages/OffersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Required dependencies
import { MotionConfig } from "framer-motion";

// Create a new QueryClient instance inside the component
const App = () => {
  // Initialize QueryClient inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <MotionConfig reducedMotion="user">
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shops" element={<ShopsPage />} />
                  <Route path="/shop/:shopId" element={<ShopDetails />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/register-shop" element={<RegisterShopPage />} />
                  <Route path="/shop-dashboard" element={<ShopDashboardPage />} />
                  <Route path="/offers" element={<OffersPage />} />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </MotionConfig>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
