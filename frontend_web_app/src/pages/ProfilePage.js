import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/endpoints";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";
import { useAuth } from "../state/AuthContext";

// PUBLIC_INTERFACE
export function ProfilePage() {
  /** View and edit user profile information. */
  const { token, isAuthed } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState({ email: "", name: "", address: "", phone: "" });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getMyProfile({ token })
      .then((p) => {
        if (!alive) return;
        setProfile({
          email: p?.email || "",
          name: p?.name || "",
          address: p?.address || "",
          phone: p?.phone || "",
        });
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Failed to load profile.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [token]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMyProfile({ token, profile });
      setProfile(updated);
    } catch (e2) {
      setError(e2.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container main">
      <div className="grid">
        <div className="col6">
          <div className="card cardPad">
            <div className="row">
              <h1 className="cardTitle" style={{ fontFamily: "var(--mono)" }}>
                Profile
              </h1>
              {isAuthed ? (
                <span className="pill pillGlow">
                  <span className="kbd">AUTH</span> ok
                </span>
              ) : (
                <span className="pill">
                  <span className="kbd">AUTH</span> guest
                </span>
              )}
            </div>

            <p className="cardSubtle">Update contact and delivery details.</p>
            <hr className="hr" />

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            {loading ? (
              <Loading label="Loading profile…" />
            ) : (
              <form className="stack" onSubmit={save}>
                <label className="stack" style={{ gap: 6 }}>
                  <span className="pill">
                    <span className="kbd">EMAIL</span>
                  </span>
                  <input
                    className="input"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    type="email"
                    placeholder="you@domain.com"
                  />
                </label>

                <label className="stack" style={{ gap: 6 }}>
                  <span className="pill">
                    <span className="kbd">NAME</span>
                  </span>
                  <input
                    className="input"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </label>

                <label className="stack" style={{ gap: 6 }}>
                  <span className="pill">
                    <span className="kbd">ADDR</span>
                  </span>
                  <input
                    className="input"
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Delivery address"
                  />
                </label>

                <label className="stack" style={{ gap: 6 }}>
                  <span className="pill">
                    <span className="kbd">PHONE</span>
                  </span>
                  <input
                    className="input"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </label>

                <div className="row">
                  <button className="btn btnPrimary" disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <span className="pill">
                    <span className="kbd">Note</span> Currently uses placeholder profile API.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="col6">
          <div className="card cardPad">
            <h2 className="cardTitle">Retro Identity Card</h2>
            <p className="cardSubtle">
              Your profile will be wired to backend persistence once endpoints are available.
            </p>
            <hr className="hr" />
            <div className="stack">
              <div className="row">
                <span className="pill">Status</span>
                <span className="pill pillGlow">{isAuthed ? "Signed in" : "Guest mode"}</span>
              </div>
              <div className="row">
                <span className="pill">Theme</span>
                <span className="pill">Retro / Dark</span>
              </div>
              <div className="row">
                <span className="pill">Protocol</span>
                <span className="pill">
                  <span className="kbd">HTTP</span> + JSON
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
