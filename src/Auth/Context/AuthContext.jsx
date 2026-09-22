/**
 * Authentication context — the ONLY source of admin session state.
 *
 * Security model (replaces the old hardcoded login + localStorage):
 * - Access token: short-lived JWT kept in JS memory via services/api.js.
 * - Refresh token: HttpOnly cookie handled entirely by the backend.
 * - Session verification: every protected route mounts through /auth/me,
 *   so forged browser state grants nothing.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setAccessToken, setSessionExpiredHandler } from "../../services/api";

export const AuthContext = createContext(null);

/** localStorage keys written by the old frontend — cleared on boot. */
export const LEGACY_STORAGE_KEYS = [
  "admin",
  "anataServices",
  "services",
  "heroSlides",
  "singers",
  "djs",
  "comedians",
  "magicians",
  "dancers",
  "influencers",
  "medias",
  "videos",
  "testimonials",
  "teamMembers",
  "careerJobs",
  "careerApplications",
  "blogs",
  "portfolios",
  "vendors",
  "artists",
  "talents",
  "corporateEvents",
  "exhibitionStallDesigns",
  "exhibitionEvents",
  "homeFAQs",
  "corporateFAQs",
  "token",
];

export function clearLegacyStorage() {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* private mode — nothing to clear */
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearLegacyStorage();
    setSessionExpiredHandler(() => {
      setUser(null);
    });

    // Re-hydrate the session from the access token (if still in memory)
    // plus a /auth/me check — covers page reloads with a live refresh cookie.
    let cancelled = false;
    const bootstrap = async () => {
      try {
        const res = await api.post("/auth/refresh/", {});
        const token = res.data?.accessToken;
        if (!token) throw new Error("no session");
        setAccessToken(token);
        const me = await api.get("/auth/me/");
        if (!cancelled) setUser(me.data?.user || null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout/", {});
    } catch {
      /* best effort — clear locally regardless */
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAdmin: !!user,
      isSuperAdmin: user?.role === "super_admin",
      canWrite: user?.role === "super_admin" || user?.role === "editor",
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
