import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../api/endpoints";
import { ErrorBanner } from "../components/ErrorBanner";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import { formatMoney } from "../utils/format";

// PUBLIC_INTERFACE
export function CheckoutPage() {
  /** Collect delivery details and place an order. */
  const { token, isAuthed } = useAuth();
  const { items, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("Demo Rider");
  const [address, setAddress] = useState("1987 Neon Ave");
  const [notes, setNotes] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const order = await placeOrder({
        token,
        order: {
          customer: { name, address, notes },
          items,
          subtotal,
          shipping,
          total,
        },
      });
      clear();
      navigate(`/orders?placed=${encodeURIComponent(order.id)}`);
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main">
      <div className="grid">
        <div className="col8">
          <div className="card cardPad">
            <div className="row">
              <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
                Checkout
              </h1>
              {!isAuthed ? (
                <span className="pill">
                  <span className="kbd">Guest</span> sign-in recommended
                </span>
              ) : (
                <span className="pill pillGlow">
                  <span className="kbd">Auth</span> ready
                </span>
              )}
            </div>

            <p className="cardSubtle">Enter delivery details and transmit the order to the backend.</p>

            <hr className="hr" />
            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <form className="stack" onSubmit={submit}>
              <label className="stack" style={{ gap: 6 }}>
                <span className="pill">
                  <span className="kbd">NAME</span>
                </span>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>

              <label className="stack" style={{ gap: 6 }}>
                <span className="pill">
                  <span className="kbd">ADDR</span>
                </span>
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>

              <label className="stack" style={{ gap: 6 }}>
                <span className="pill">
                  <span className="kbd">NOTES</span>
                </span>
                <textarea
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Delivery notes…"
                />
              </label>

              <div className="row">
                <button className="btn btnPrimary" disabled={loading}>
                  {loading ? "Placing order…" : "Place Order"}
                </button>
                <button type="button" className="btn" onClick={() => navigate("/cart")} disabled={loading}>
                  Back to Cart
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col4">
          <div className="card cardPad">
            <h2 className="cardTitle">Summary</h2>
            <hr className="hr" />
            <div className="stack">
              <div className="row">
                <span className="pill">Items</span>
                <span className="pill pillGlow">{items.length}</span>
              </div>
              <div className="row">
                <span className="pill">Subtotal</span>
                <strong style={{ fontFamily: "var(--mono)" }}>{formatMoney(subtotal)}</strong>
              </div>
              <div className="row">
                <span className="pill">Shipping</span>
                <strong style={{ fontFamily: "var(--mono)" }}>{formatMoney(shipping)}</strong>
              </div>
              <div className="row">
                <span className="pill pillGlow">Total</span>
                <strong style={{ fontFamily: "var(--mono)", fontSize: 18 }}>{formatMoney(total)}</strong>
              </div>

              <div className="pill">
                <span className="kbd">Backend</span> currently placeholder; UI is wired for real endpoints.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
