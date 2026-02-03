import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { formatMoney } from "../utils/format";

// PUBLIC_INTERFACE
export function CartPage() {
  /** View and edit cart items, proceed to checkout. */
  const { items, updateQty, removeItem, clear, subtotal, shipping, total, count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container main">
      <div className="grid">
        <div className="col8">
          <div className="card cardPad">
            <div className="row">
              <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
                Cart <span className="pill">{count} items</span>
              </h1>
              <div className="row">
                <Link className="btn btnSmall" to="/">
                  Continue shopping
                </Link>
                <button className="btn btnDanger btnSmall" onClick={clear} disabled={items.length === 0}>
                  Clear
                </button>
              </div>
            </div>

            <hr className="hr" />

            {items.length === 0 ? (
              <p className="cardSubtle">Your cart is empty. Go catch some neon deals in the catalog.</p>
            ) : (
              <table className="table" aria-label="Cart items">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: 120 }}>Price</th>
                    <th style={{ width: 120 }}>Qty</th>
                    <th style={{ width: 120 }}>Line</th>
                    <th style={{ width: 120 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((x) => (
                    <tr key={x.id}>
                      <td>
                        <strong>{x.name}</strong>
                        <div className="cardSubtle">
                          <span className="kbd">{x.id}</span>
                        </div>
                      </td>
                      <td>{formatMoney(x.price)}</td>
                      <td>
                        <input
                          className="input"
                          style={{ maxWidth: 100 }}
                          type="number"
                          min={1}
                          value={x.qty}
                          onChange={(e) => updateQty(x.id, e.target.value)}
                        />
                      </td>
                      <td>{formatMoney(Number(x.price) * Number(x.qty))}</td>
                      <td>
                        <button className="btn btnSmall" onClick={() => removeItem(x.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="col4">
          <div className="card cardPad">
            <h2 className="cardTitle">Totals</h2>
            <p className="cardSubtle">Synthwave shipping is calculated automatically.</p>
            <hr className="hr" />

            <div className="stack">
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

              <button
                className="btn btnPrimary"
                disabled={items.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>

              <div className="pill">
                <span className="kbd">Hint</span> You can place orders even with placeholder backend data.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
