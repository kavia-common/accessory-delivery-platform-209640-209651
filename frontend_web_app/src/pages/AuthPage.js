import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBanner } from "../components/ErrorBanner";
import { useAuth } from "../state/AuthContext";

// PUBLIC_INTERFACE
export function AuthPage() {
  /** Login/register form (email/password), updates auth context. */
  const { login, register, loading, error, setError, isAuthed } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // or "register"
  const [email, setEmail] = useState("demo@user.com");
  const [password, setPassword] = useState("password");

  if (isAuthed) {
    // Already authed — send to profile
    setTimeout(() => navigate("/profile"), 0);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") await login({ email, password });
      else await register({ email, password });
      navigate("/profile");
    } catch {
      // handled in context
    }
  };

  return (
    <div className="container main">
      <div className="grid">
        <div className="col6">
          <div className="card cardPad">
            <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
              {mode === "login" ? "Login" : "Register"}
            </h1>
            <p className="cardSubtle">
              Tip: use an email containing <span className="kbd">admin</span> (e.g.{" "}
              <span className="kbd">admin@retro.com</span>) to unlock the Admin UI placeholder.
            </p>

            <hr className="hr" />

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <form className="stack" onSubmit={onSubmit}>
              <label className="stack" style={{ gap: 6 }}>
                <span className="pill">
                  <span className="kbd">EMAIL</span> sign-in
                </span>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  type="email"
                  required
                />
              </label>

              <label className="stack" style={{ gap: 6 }}>
                <span className="pill">
                  <span className="kbd">PASS</span> phrase
                </span>
                <input
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </label>

              <div className="row">
                <button className={`btn ${mode === "login" ? "btnPrimary" : ""}`} disabled={loading}>
                  {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
                  disabled={loading}
                >
                  Switch to {mode === "login" ? "Register" : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col6">
          <div className="card cardPad">
            <h2 className="cardTitle">Why sign in?</h2>
            <p className="cardSubtle">
              Saves your profile, unlocks order tracking, and lets the Admin (if you have access)
              manage inventory and statuses.
            </p>
            <hr className="hr" />
            <div className="stack">
              <div className="pill pillGlow">
                <span className="kbd">Retro</span> CRT glow + synth gradients
              </div>
              <div className="pill">
                <span className="kbd">CORS</span> ready calls to <span className="kbd">http://localhost:3001</span>
              </div>
              <div className="pill">
                <span className="kbd">TODO</span> swap placeholder auth endpoints when backend lands
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
