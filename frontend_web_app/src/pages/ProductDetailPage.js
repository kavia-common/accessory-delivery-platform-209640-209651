import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAccessoryById } from "../api/endpoints";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";
import { useCart } from "../state/CartContext";
import { formatMoney } from "../utils/format";

// PUBLIC_INTERFACE
export function ProductDetailPage() {
  /** Show detailed view of a product and allow adding to cart. */
  const { id } = useParams();
  const { addItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getAccessoryById(id)
      .then((data) => {
        if (!alive) return;
        setP(data);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load item.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <div className="container main"><Loading label="Loading item…" /></div>;

  return (
    <div className="container main">
      <div className="stack" style={{ gap: 16 }}>
        <div className="row">
          <Link className="btn btnSmall" to="/">
            ← Back to Catalog
          </Link>
          <Link className="btn btnSmall" to="/cart">
            View Cart
          </Link>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {p ? (
          <div className="grid">
            <div className="col8">
              <div className="card cardPad">
                <div className="row">
                  <span className="pill">
                    <span className="kbd">ID</span> {p.id}
                  </span>
                  <span className="pill pillGlow">
                    <span className="kbd">★</span> {p.rating}
                  </span>
                </div>

                <h1 className="cardTitle" style={{ fontFamily: "var(--mono)", fontSize: 22, marginTop: 10 }}>
                  {p.name}
                </h1>
                <p className="cardSubtle">{p.description}</p>

                <hr className="hr" />

                <div className="grid" style={{ gap: 12 }}>
                  <div className="col6">
                    <div className="card cardPad" style={{ boxShadow: "none" }}>
                      <strong style={{ fontFamily: "var(--mono)" }}>Retro Spec</strong>
                      <div className="stack" style={{ marginTop: 10 }}>
                        <div className="row">
                          <span className="pill">Category</span>
                          <span className="pill pillGlow">{p.category}</span>
                        </div>
                        <div className="row">
                          <span className="pill">Aura</span>
                          <span className="pill pillGlow">
                            {p.accent === "teal" ? "Cyan Drift" : "Blue Pulse"}
                          </span>
                        </div>
                        <div className="row">
                          <span className="pill">Drop</span>
                          <span className="pill">{new Date().getFullYear()} reissue</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col6">
                    <div className="card cardPad" style={{ boxShadow: "none" }}>
                      <strong style={{ fontFamily: "var(--mono)" }}>Price</strong>
                      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
                        {formatMoney(p.price)}
                      </div>
                      <div className="cardSubtle">Ships fast. Looks faster.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col4">
              <div className="card cardPad">
                <h2 className="cardTitle">Add to Cart</h2>
                <p className="cardSubtle">Choose quantity and make it yours.</p>
                <hr className="hr" />

                <label className="stack" style={{ gap: 6 }}>
                  <span className="pill">
                    <span className="kbd">QTY</span>
                  </span>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </label>

                <div className="row" style={{ marginTop: 12 }}>
                  <button
                    className="btn btnPrimary"
                    onClick={() => addItem(p, Number(qty) || 1)}
                  >
                    Add {formatMoney(p.price)}
                  </button>
                  <Link className="btn" to="/cart">
                    Checkout
                  </Link>
                </div>

                <hr className="hr" />
                <div className="stack">
                  <div className="pill">
                    <span className="kbd">Note</span> Backend endpoints are coming next; UI is ready.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
