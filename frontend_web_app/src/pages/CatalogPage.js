import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listAccessories } from "../api/endpoints";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";
import { useCart } from "../state/CartContext";
import { formatMoney } from "../utils/format";

// PUBLIC_INTERFACE
export function CatalogPage() {
  /** Browse/search accessories and add them to cart. */
  const { addItem } = useCart();

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const accentStyle = useMemo(
    () => ({
      primary: { borderColor: "rgba(59, 130, 246, 0.45)" },
      teal: { borderColor: "rgba(6, 182, 212, 0.45)" },
    }),
    []
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    listAccessories({ q })
      .then((data) => {
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load catalog.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [q]);

  return (
    <div className="container main">
      <div className="card cardPad" style={{ marginBottom: 18 }}>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <div className="stack" style={{ gap: 6 }}>
            <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
              Catalog
            </h1>
            <p className="cardSubtle">
              Browse accessories, add to cart, and place an order with a synthwave glow.
            </p>
          </div>
          <span className="pill pillGlow">
            <span className="kbd">Tip</span> type to search
          </span>
        </div>

        <hr className="hr" />

        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or category…"
            aria-label="Search accessories"
            style={{ maxWidth: 520 }}
          />
          <button className="btn" onClick={() => setQ("")}>
            Clear
          </button>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      </div>

      {loading ? (
        <Loading label="Loading catalog…" />
      ) : (
        <div className="grid">
          {items.map((p) => (
            <div key={p.id} className="col4">
              <div className="card cardPad" style={accentStyle[p.accent] || undefined}>
                <div className="row">
                  <span className="pill">
                    <span className="kbd">CAT</span> {p.category}
                  </span>
                  <span className="pill pillGlow">
                    <span className="kbd">★</span> {p.rating}
                  </span>
                </div>

                <h2 className="cardTitle" style={{ marginTop: 10 }}>
                  {p.name}
                </h2>
                <p className="cardSubtle" style={{ minHeight: 44 }}>
                  {p.description}
                </p>

                <div className="row" style={{ marginTop: 12 }}>
                  <strong style={{ fontFamily: "var(--mono)" }}>{formatMoney(p.price)}</strong>
                  <div className="row" style={{ justifyContent: "flex-end" }}>
                    <Link className="btn btnSmall" to={`/product/${p.id}`}>
                      Details
                    </Link>
                    <button
                      className="btn btnPrimary btnSmall"
                      onClick={() => addItem(p, 1)}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 ? (
            <div className="col12">
              <div className="card cardPad">
                <h2 className="cardTitle">No matches</h2>
                <p className="cardSubtle">Try a different search term.</p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
