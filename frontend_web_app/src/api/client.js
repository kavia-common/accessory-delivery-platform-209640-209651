/**
 * A tiny fetch wrapper with:
 * - explicit base URL (no env vars, per task requirement)
 * - JSON parsing and consistent error shape
 * - optional bearer token support
 */

const API_BASE_URL = "http://localhost:3001";

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", body, token, headers } = {}) {
  /** Perform an HTTP request to the backend API and return parsed JSON or throw an Error. */
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const finalHeaders = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network errors / CORS / backend down
    throw new Error("Network error: unable to reach the API server.");
  }

  // Some endpoints might return empty body
  const contentType = res.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");
  const payload = hasJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (payload && (payload.detail || payload.message)) ||
      (typeof payload === "string" && payload) ||
      `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Return the API base URL used by the frontend. */
  return API_BASE_URL;
}
