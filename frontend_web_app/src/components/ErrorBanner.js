import React from "react";

// PUBLIC_INTERFACE
export function ErrorBanner({ message, onDismiss }) {
  /** Display an error message with optional dismiss action. */
  if (!message) return null;
  return (
    <div className="alert" role="alert" aria-live="polite">
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="stack" style={{ gap: 6 }}>
          <strong style={{ fontFamily: "var(--mono)" }}>Signal Lost</strong>
          <div style={{ color: "rgba(255,255,255,0.92)" }}>{message}</div>
        </div>
        {onDismiss ? (
          <button className="btn btnSmall" onClick={onDismiss} aria-label="Dismiss error">
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}
