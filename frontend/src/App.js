import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import { ThemeProvider } from "./admin/context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CatalogPage from "./pages/CatalogPage";
// import OrderSuccessPage from "./pages/OrderSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import DeliveryPage from "./pages/DeliveryPage";
import ReturnPage from "./pages/ReturnPage";
import ContactsPage from "./pages/ContactsPage";
import BlogPage from "./pages/BlogPage";

// Admin imports
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminOrdersStats from "./admin/pages/AdminOrdersStats";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminSiteSettings from "./admin/pages/AdminSiteSettings";
import AdminContent from "./admin/pages/AdminContent";
import AdminCMS from "./admin/pages/AdminCMS";
import AdminBlog from "./admin/pages/AdminBlog";
import AdminMedia from "./admin/pages/AdminMedia";
import ProtectedRoute from "./admin/components/ProtectedRoute";

import "./App.css";

const OrderSuccessStub = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">✅ Замовлення оформлено</h1>
    <p className="mt-2 text-gray-600">
      Дякуємо! Сторінка підтвердження тимчасово на техобслуговуванні.
    </p>
    <a
      href="/"
      className="inline-flex mt-4 items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-white font-semibold"
    >
      На головну
    </a>
  </div>
);


function App() {
  return (
    <Router>
      <ThemeProvider>
        <AdminAuthProvider>
          <SettingsProvider>
            <CartProvider>
              <WishlistProvider>
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
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminSiteSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/cms"
                  element={
                    <ProtectedRoute>
                      <AdminCMS />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog"
                  element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/media"
                  element={
                    <ProtectedRoute>
                      <AdminMedia />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <ProtectedRoute>
                      <AdminContent />
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
                    <div className="App min-h-screen bg-white flex-col">
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
                  path="/blog/:slug"
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
              </Routes>
              <Toaster
                position="top-center"
                expand={false}
                richColors
                className="!z-[9999]"
                toastOptions={{
                  duration: 2500,
                  style: {
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    padding: 0,
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
          </SettingsProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
