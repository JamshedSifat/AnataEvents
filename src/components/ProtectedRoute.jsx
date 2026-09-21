import { Navigate, Outlet, useLocation } from 'react-router';

import { AUTH_STATUS, useAuth } from '../auth/Context/AuthContext';
import { LoadingScreen } from './ui/States';
import Forbidden from './Forbidden';

/**
 * Guards every `/admin/dashboard/*` route.
 *
 * The check is server-backed: the provider only marks the session
 * authenticated after `GET /api/auth/me/` succeeds with the rotating cookie.
 * `requiredRole` adds a second, role-based layer (super_admin only).
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { status, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) {
    return <LoadingScreen message="Verifying your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
    return <Forbidden />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
