import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/endpoints";

const AuthContext = createContext(null);

const LS_KEY = "retro_accessory_auth_v1";

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provide authentication state (user/token) and actions (login/register/logout). */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore session
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist session
  useEffect(() => {
    try {
      if (token && user) localStorage.setItem(LS_KEY, JSON.stringify({ token, user }));
      else localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }, [token, user]);

  const isAuthed = !!token;
  const isAdmin = user?.role === "admin";

  // PUBLIC_INTERFACE
  const login = async ({ email, password }) => {
    /** Authenticate and set current user. */
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (e) {
      setError(e.message || "Login failed.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const register = async ({ email, password }) => {
    /** Register and set current user. */
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser({ email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (e) {
      setError(e.message || "Registration failed.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clear current session. */
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      isAdmin,
      loading,
      error,
      login,
      register,
      logout,
      setError,
    }),
    [token, user, isAuthed, isAdmin, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Read auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
