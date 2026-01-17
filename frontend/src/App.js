import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import { ThemeProvider } from "./admin/context/ThemeContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CatalogPage from "./pages/CatalogPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import DeliveryPage from "./pages/DeliveryPage";
import ReturnPage from "./pages/ReturnPage";
import ContactsPage from "./pages/ContactsPage";
import BlogPage from "./pages/BlogPage";
import ComparePage from "./pages/ComparePage";

// Admin imports
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminOrdersStats from "./admin/pages/AdminOrdersStats";
import AdminCategories from "./admin/pages/AdminCategories";
import ProtectedRoute from "./admin/components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AdminAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders/stats"
                  element={
                    <ProtectedRoute>
                      <AdminOrdersStats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute>
                      <AdminCategories />
                    </ProtectedRoute>
                  }
                />

                {/* Public Routes with Layout */}
                <Route
                  path="/"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <HomePage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/catalog"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <CatalogPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ProductDetailPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <CartPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <CheckoutPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/order-success/:orderId"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <OrderSuccessPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <WishlistPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <AboutPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/delivery"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <DeliveryPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/return"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ReturnPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/contacts"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ContactsPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <BlogPage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
                <Route
                  path="/compare"
                  element={
                    <div className="App min-h-screen bg-white flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ComparePage />
                      </main>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
              <Toaster
                position="bottom-center"
                expand={true}
                richColors
                className="!z-[9999] !bottom-20"
                toastOptions={{
                  duration: 3000,
                  className: '!mb-16',
                  style: {
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    padding: 0,
                  },
                }}
              />
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
