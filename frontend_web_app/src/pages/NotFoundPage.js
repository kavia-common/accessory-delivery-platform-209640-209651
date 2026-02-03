import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function NotFoundPage() {
  /** Fallback page for unknown routes. */
  return (
    <div className="container main">
      <div className="card cardPad">
        <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
          404 — Signal Not Found
        </h1>
        <p className="cardSubtle">This page drifted into another timeline.</p>
        <hr className="hr" />
        <Link className="btn btnPrimary" to="/">
          Return to Catalog
        </Link>
      </div>
    </div>
  );
}
