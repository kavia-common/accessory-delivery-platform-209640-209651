import React from "react";

// PUBLIC_INTERFACE
export function Loading({ label = "Loading…" }) {
  /** Retro loading placeholder UI. */
  return (
    <div className="card cardPad">
      <div className="stack">
        <div className="row">
          <strong style={{ fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>{label}</strong>
          <span className="pill pillGlow">
            <span className="kbd">⌛</span> please wait
          </span>
        </div>
        <div className="skeleton" style={{ width: "86%" }} />
        <div className="skeleton" style={{ width: "70%" }} />
        <div className="skeleton" style={{ width: "92%" }} />
      </div>
    </div>
  );
}
