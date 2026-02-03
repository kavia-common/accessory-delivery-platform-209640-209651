import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const LS_KEY = "retro_accessory_cart_v1";

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provide cart state and actions (add/remove/update/clear). */
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw) || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // PUBLIC_INTERFACE
  const addItem = (product, qty = 1) => {
    /** Add a product to the cart (or increase quantity). */
    setItems((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      if (existing) return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + qty } : x));
      return [...prev, { id: product.id, name: product.name, price: product.price, qty }];
    });
  };

  // PUBLIC_INTERFACE
  const updateQty = (id, qty) => {
    /** Update quantity (minimum 1). */
    const safeQty = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: safeQty } : x)));
  };

  // PUBLIC_INTERFACE
  const removeItem = (id) => {
    /** Remove an item from the cart. */
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  // PUBLIC_INTERFACE
  const clear = () => {
    /** Clear cart entirely. */
    setItems([]);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.price || 0) * Number(x.qty || 0), 0),
    [items]
  );

  const shipping = subtotal > 0 ? Math.min(9.99, Math.max(3.5, subtotal * 0.08)) : 0;
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeItem,
      clear,
      subtotal,
      shipping,
      total,
      count: items.reduce((sum, x) => sum + (x.qty || 0), 0),
    }),
    [items, subtotal, shipping, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Read cart context. */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
