import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { getApiBaseUrl } from "../api/client";

// PUBLIC_INTERFACE
export function Header() {
  /** App header with navigation, cart indicator, and auth actions. */
  const { count } = useCart();
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="container">
        <div className="topbarInner">
          <div className="brand">
            <div className="brandMark" aria-hidden="true" />
            <div className="brandTitle">
              <strong>Retro Accessories</strong>
              <span>
                API <span className="kbd">{getApiBaseUrl()}</span>
              </span>
            </div>
          </div>

          <nav className="navLinks" aria-label="Primary navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
            >
              Catalog
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
            >
              Orders & Tracking
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
            >
              Profile
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
            >
              Cart <span className="pill">{count}</span>
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) => `navLink ${isActive ? "navLinkActive" : ""}`}
            >
              Admin
              {isAdmin ? <span className="pill pillGlow">enabled</span> : <span className="pill">locked</span>}
            </NavLink>
          </nav>

          <div className="rightActions">
            {isAuthed ? (
              <>
                <span className="pill" title={user?.email || ""}>
                  <span className="kbd">USER</span> {user?.role || "user"}
                </span>
                <button
                  className="btn btnSmall"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button className="btn btnPrimary btnSmall" onClick={() => navigate("/auth")}>
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
