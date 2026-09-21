/**
 * Single axios instance for the whole SPA.
 *
 * Security model
 * --------------
 * * The access token (10 minutes) lives **in memory only** — never in
 *   localStorage/sessionStorage/cookies readable by JS.
 * * The rotating refresh token is an HttpOnly + Secure + SameSite cookie that
 *   the browser sends to `/api/auth/` because the API is proxied on the same
 *   origin (vercel.json rewrite / vite proxy).
 * * Every cookie-authenticated call carries the `X-Ananta-Client` header so a
 *   cross-site request cannot rotate the session silently.
 * * Legacy localStorage keys written by the old demo build are purged on boot
 *   and are never read for authorization decisions.
 */
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const CLIENT_HEADER = 'X-Ananta-Client';
export const CLIENT_HEADER_VALUE = 'web';

/** Keys the pre-backend build used to fake a session / store content. */
export const LEGACY_STORAGE_KEYS = [
  'admin',
  'token',
  'role',
  'anataServices',
  'services',
  'artists',
  'blogs',
  'careerApplications',
  'careerJobs',
  'comedians',
  'corporateEvents',
  'corporateFAQs',
  'dancers',
  'djs',
  'exhibitionEvents',
  'exhibitionStallDesigns',
  'heroSlides',
  'homeFAQs',
  'influencers',
  'magicians',
  'medias',
  'portfolios',
  'singers',
  'talents',
  'teamMembers',
  'testimonials',
  'vendors',
  'videos',
];

/** Delete every legacy key. Called once on app start, before anything renders. */
export function purgeLegacyStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* storage disabled — nothing to purge */
  }
}

let accessToken = null;
let unauthorizedHandler = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token) => {
    accessToken = token || null;
  },
  clear: () => {
    accessToken = null;
  },
};

/** Register a callback invoked when the session cannot be refreshed. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    [CLIENT_HEADER]: CLIENT_HEADER_VALUE,
  },
});

const AUTH_FREE_PATHS = ['/auth/login/', '/auth/refresh/', '/auth/forgot-password/', '/auth/reset-password/'];

function isAuthFree(url = '') {
  return AUTH_FREE_PATHS.some((path) => url.includes(path));
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

/** Rotate the refresh cookie and cache the new access token in memory. */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh/', {}, { headers: { [CLIENT_HEADER]: CLIENT_HEADER_VALUE } })
      .then((response) => {
        tokenStore.set(response.data.access);
        return response.data;
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
    const { config, response } = error;
    const status = response?.status;

    if (status === 401 && config && !config.__isRetry && !isAuthFree(config.url)) {
      config.__isRetry = true;
      try {
        await refreshSession();
        return api(config);
      } catch (refreshError) {
        tokenStore.clear();
        if (unauthorizedHandler) unauthorizedHandler();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401) {
      tokenStore.clear();
      if (unauthorizedHandler && !isAuthFree(config?.url)) unauthorizedHandler();
    }
    return Promise.reject(error);
  },
);

/** Normalise an axios error into `{message, fieldErrors, status}`. */
export function extractError(error) {
  const response = error?.response;
  const data = response?.data;
  const fieldErrors = {};

  if (data?.errors && typeof data.errors === 'object') {
    Object.entries(data.errors).forEach(([field, value]) => {
      if (field === 'detail' || field === 'non_field_errors') return;
      fieldErrors[field] = Array.isArray(value) ? String(value[0]) : String(value);
    });
  }

  let message =
    data?.detail ||
    (typeof data === 'string' && data) ||
    response?.statusText ||
    error?.message ||
    'Something went wrong. Please try again.';

  if (response?.status === 429) {
    message = data?.detail || 'Too many requests — please slow down and try again shortly.';
  }
  if (!response && error?.code === 'ERR_NETWORK') {
    message = 'Cannot reach the server. Check your connection and try again.';
  }

  return { message, fieldErrors, status: response?.status ?? 0 };
}

export default api;
