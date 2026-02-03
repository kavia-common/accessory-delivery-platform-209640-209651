import React, { useEffect, useMemo, useState } from "react";
import {
  adminListInventory,
  adminListOrders,
  adminUpdateInventory,
  adminUpdateOrderStatus,
} from "../api/endpoints";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";
import { useAuth } from "../state/AuthContext";
import { formatMoney } from "../utils/format";

// PUBLIC_INTERFACE
export function AdminPage() {
  /** Admin-only panel for inventory and order status management (placeholder until backend endpoints exist). */
  const { token, isAdmin, isAuthed } = useAuth();

  const [tab, setTab] = useState("inventory"); // inventory | orders
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  const statusOptions = useMemo(
    () => ["PLACED", "PACKING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
    []
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      if (!isAdmin) {
        // no fetch needed
        return;
      }
      const [inv, ord] = await Promise.all([adminListInventory({ token }), adminListOrders({ token })]);
      if (!alive) return;
      setInventory(Array.isArray(inv) ? inv : []);
      setOrders(Array.isArray(ord) ? ord : []);
    };

    load()
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load admin data.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isAdmin, token]);

  const updateStock = async (id, stock) => {
    setSaving(true);
    setError(null);
    try {
      await adminUpdateInventory({ token, id, patch: { stock: Number(stock) } });
      setInventory((prev) => prev.map((x) => (x.id === id ? { ...x, stock: Number(stock) } : x)));
    } catch (e) {
      setError(e.message || "Failed to update stock.");
    } finally {
      setSaving(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setSaving(true);
    setError(null);
    try {
      await adminUpdateOrderStatus({ token, id, status });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      setError(e.message || "Failed to update order status.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="container main">
        <div className="card cardPad">
          <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
            Admin Panel
          </h1>
          <p className="cardSubtle">Please log in to access admin features.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container main">
        <div className="card cardPad">
          <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
            Admin Panel
          </h1>
          <p className="cardSubtle">
            Your current account is not an admin. (Demo rule: email containing{" "}
            <span className="kbd">admin</span> becomes admin.)
          </p>
          <hr className="hr" />
          <div className="pill">
            <span className="kbd">Placeholder</span> Admin UI is ready; backend endpoints will plug in next.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container main">
      <div className="card cardPad" style={{ marginBottom: 18 }}>
        <div className="row">
          <div className="stack" style={{ gap: 6 }}>
            <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
              Admin Panel
            </h1>
            <p className="cardSubtle">Inventory and order controls (structured for real backend data).</p>
          </div>

          <div className="row">
            <button
              className={`btn btnSmall ${tab === "inventory" ? "btnPrimary" : ""}`}
              onClick={() => setTab("inventory")}
              disabled={saving}
            >
              Inventory
            </button>
            <button
              className={`btn btnSmall ${tab === "orders" ? "btnPrimary" : ""}`}
              onClick={() => setTab("orders")}
              disabled={saving}
            >
              Orders
            </button>
          </div>
        </div>

        <hr className="hr" />
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      </div>

      {loading ? (
        <Loading label="Loading admin data…" />
      ) : tab === "inventory" ? (
        <div className="card cardPad">
          <h2 className="cardTitle">Inventory</h2>
          <p className="cardSubtle">Adjust stock levels. (Currently placeholder API).</p>
          <hr className="hr" />

          <table className="table" aria-label="Inventory table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{ width: 140 }}>Price</th>
                <th style={{ width: 140 }}>Stock</th>
                <th style={{ width: 160 }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((x) => (
                <tr key={x.id}>
                  <td>
                    <strong>{x.name}</strong>
                    <div className="cardSubtle">
                      <span className="kbd">{x.category}</span> · <span className="kbd">{x.id}</span>
                    </div>
                  </td>
                  <td>{formatMoney(x.price)}</td>
                  <td>
                    <span className="pill pillGlow">{x.stock ?? 0}</span>
                  </td>
                  <td>
                    <div className="row" style={{ justifyContent: "flex-start" }}>
                      <button
                        className="btn btnSmall"
                        disabled={saving}
                        onClick={() => updateStock(x.id, Math.max(0, (x.stock ?? 0) - 1))}
                      >
                        -1
                      </button>
                      <button
                        className="btn btnSmall"
                        disabled={saving}
                        onClick={() => updateStock(x.id, (x.stock ?? 0) + 1)}
                      >
                        +1
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card cardPad">
          <h2 className="cardTitle">Orders</h2>
          <p className="cardSubtle">Update delivery statuses. (Currently placeholder API).</p>
          <hr className="hr" />

          <table className="table" aria-label="Orders table">
            <thead>
              <tr>
                <th>Order</th>
                <th style={{ width: 180 }}>Total</th>
                <th style={{ width: 240 }}>Status</th>
                <th style={{ width: 160 }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{o.id}</strong>
                    <div className="cardSubtle">
                      <span className="kbd">{new Date(o.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td>{formatMoney(o.total)}</td>
                  <td>
                    <span className="pill pillGlow">{o.status}</span>
                  </td>
                  <td>
                    <select
                      className="select"
                      value={o.status}
                      disabled={saving}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
