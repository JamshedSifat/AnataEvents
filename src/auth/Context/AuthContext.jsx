/**
 * Session state for the admin panel.
 *
 * * Access token: memory only (`tokenStore`), 10 minutes.
 * * Refresh token: HttpOnly cookie rotated by `/api/auth/refresh/`.
 * * The signed-in user is always re-verified against `GET /api/auth/me/`, so a
 *   forged localStorage flag (the old build's `admin` key) grants nothing.
 * * 30-minute idle timeout logs the user out automatically.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { purgeLegacyStorage, refreshSession, setUnauthorizedHandler, tokenStore } from '../../services/api';
import * as authApi from '../../services/auth';

export const AuthContext = createContext(null);

const IDLE_TIMEOUT_MS = (Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) || 30) * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'];

export const AUTH_STATUS = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  ANONYMOUS: 'anonymous',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(AUTH_STATUS.LOADING);
  const idleTimer = useRef(null);

  // Purge the demo build's localStorage keys before anything else runs.
  useEffect(() => {
    purgeLegacyStorage();
  }, []);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus(AUTH_STATUS.ANONYMOUS);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  // Boot: try to rotate the refresh cookie, then verify with /me/.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshSession();
        const profile = await authApi.fetchMe();
        if (!cancelled) {
          setUser(profile);
          setStatus(AUTH_STATUS.AUTHENTICATED);
        }
      } catch {
        if (!cancelled) clearSession();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async (email, password, honeypot = '') => {
    const data = await authApi.login(email, password, honeypot);
    const profile = data.user || (await authApi.fetchMe());
    setUser(profile);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  /** Replace the cached profile after a password change or profile update. */
  const refreshProfile = useCallback(async () => {
    const profile = await authApi.fetchMe();
    setUser(profile);
    return profile;
  }, []);

  // Idle timeout (30 minutes of no interaction → sign out).
  useEffect(() => {
    if (status !== AUTH_STATUS.AUTHENTICATED) return undefined;

    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT_MS);
    };

    reset();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [status, logout]);

  const value = useMemo(
    () => ({
      user,
      status,
      isLoading: status === AUTH_STATUS.LOADING,
      isAuthenticated: status === AUTH_STATUS.AUTHENTICATED && Boolean(user),
      role: user?.role ?? null,
      canWrite: Boolean(user?.can_write),
      canManageUsers: Boolean(user?.permissions?.can_manage_users),
      canViewAuditLog: Boolean(user?.permissions?.can_view_audit_log),
      login,
      logout,
      refreshProfile,
      setUser,
    }),
    [user, status, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default AuthProvider;
