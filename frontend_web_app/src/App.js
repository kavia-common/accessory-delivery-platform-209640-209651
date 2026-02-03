import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { Header } from "./components/Header";
import { AuthProvider } from "./state/AuthContext";
import { CartProvider } from "./state/CartContext";

import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// PUBLIC_INTERFACE
function App() {
  /** App entry: provides global state, routing, and overall retro layout. */
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="appShell">
            <Header />
            <main className="main" role="main">
              <Routes>
                <Route path="/" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <footer className="footer">
              <div className="container">
                <div className="row" style={{ flexWrap: "wrap" }}>
                  <span>
                    <span className="kbd">Retro Accessories</span> — accessory delivery platform
                  </span>
                  <span className="pill">
                    <span className="kbd">CORS</span> calls target <span className="kbd">http://localhost:3001</span>
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
