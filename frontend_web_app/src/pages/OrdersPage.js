import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listMyOrders } from "../api/endpoints";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";
import { useAuth } from "../state/AuthContext";
import { formatMoney } from "../utils/format";

// PUBLIC_INTERFACE
export function OrdersPage() {
  /** View orders and delivery tracking status. */
  const { token, isAuthed } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const placedId = useMemo(() => new URLSearchParams(location.search).get("placed"), [location.search]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    listMyOrders({ token })
      .then((data) => {
        if (!alive) return;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load orders.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <div className="container main">
      <div className="card cardPad" style={{ marginBottom: 18 }}>
        <div className="row">
          <div className="stack" style={{ gap: 6 }}>
            <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
              Orders & Tracking
            </h1>
            <p className="cardSubtle">
              Watch your order travel through cyberspace into the real world.
            </p>
          </div>
          <div className="row">
            {!isAuthed ? (
              <button className="btn btnPrimary btnSmall" onClick={() => navigate("/auth")}>
                Login to sync
              </button>
            ) : (
              <span className="pill pillGlow">
                <span className="kbd">SYNC</span> enabled
              </span>
            )}
          </div>
        </div>

        {placedId ? (
          <>
            <hr className="hr" />
            <div className="pill pillGlow">
              <span className="kbd">Placed</span> Order <span className="kbd">{placedId}</span> is now in the system.
            </div>
          </>
        ) : null}

        <hr className="hr" />
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      </div>

      {loading ? (
        <Loading label="Loading orders…" />
      ) : orders.length === 0 ? (
        <div className="card cardPad">
          <h2 className="cardTitle">No orders yet</h2>
          <p className="cardSubtle">Place an order from the checkout page to see tracking here.</p>
        </div>
      ) : (
        <div className="grid">
          {orders.map((o) => (
            <div key={o.id} className="col6">
              <div className="card cardPad">
                <div className="row">
                  <span className="pill">
                    <span className="kbd">ORDER</span> {o.id}
                  </span>
                  <span className={`pill ${o.status === "DELIVERED" ? "pillGlow" : ""}`}>
                    <span className="kbd">STATUS</span> {o.status}
                  </span>
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                  <div className="stack" style={{ gap: 6 }}>
                    <div className="cardSubtle">
                      Created: <span className="kbd">{new Date(o.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="cardSubtle">
                      ETA: <span className="kbd">{o.etaMinutes} min</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="cardSubtle">Total</div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--mono)" }}>
                      {formatMoney(o.total)}
                    </div>
                  </div>
                </div>

                <hr className="hr" />
                <div className="stack">
                  {(o.items || []).map((it) => (
                    <div key={it.id} className="row">
                      <span className="pill">{it.name}</span>
                      <span className="pill">
                        <span className="kbd">x{it.qty}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
