/**
 * Central API client.
 *
 * - Base URL from VITE_API_BASE_URL (defaults to /api so the Vercel rewrite
 *   keeps everything same-origin in production).
 * - The JWT access token lives in JS MEMORY ONLY (never localStorage).
 * - The refresh token arrives as an HttpOnly cookie set by the backend; the
 *   browser attaches it automatically to same-origin /api/auth requests.
 * - On a 401 the client tries ONE silent refresh + retry, then logs out.
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the HttpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
});

let accessToken = null;
let onSessionExpired = null; // set by AuthContext

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

// Attach the in-memory access token to every request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

async function tryRefresh() {
  // Single in-flight refresh shared by concurrent 401s.
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${BASE_URL}/auth/refresh/`, {}, { withCredentials: true })
      .then((res) => {
        const token = res.data?.accessToken;
        accessToken = token || null;
        return token || null;
      })
      .catch(() => {
        accessToken = null;
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (
      response?.status === 401 &&
      !config._retried &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/refresh")
    ) {
      config._retried = true;
      const token = await tryRefresh();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      }
      if (onSessionExpired) onSessionExpired();
    }
    return Promise.reject(error);
  }
);

/** Normalise paginated or plain-list responses into an array. */
export function toList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

/** Normalise to { items, count } */
export function toPage(data) {
  if (Array.isArray(data)) return { items: data, count: data.length };
  if (Array.isArray(data?.results))
    return { items: data.results, count: data.count ?? data.results.length };
  return { items: [], count: 0 };
}

/** Extract a human-friendly message from an axios/API error. */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return Array.isArray(val) ? String(val[0]) : String(val);
  }
  return fallback;
}

/** Field-level errors keyed by input name, for inline form errors. */
export function fieldErrors(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return {};
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "detail") continue;
    out[key] = Array.isArray(value) ? String(value[0]) : String(value);
  }
  return out;
}
