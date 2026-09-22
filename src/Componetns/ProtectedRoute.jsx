import React, { useContext } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { AuthContext } from "../Auth/Context/AuthContext";
import Forbidden from "../Pages/Errors/Forbidden";

/**
 * Server-verified route protection.
 *
 * The dashboard only renders when /auth/me has confirmed a valid session
 * (see AuthProvider bootstrap). Client checks here are for UX — the real
 * enforcement is role-based permissions on every /api/admin/* endpoint.
 */
const ROLE_LABELS = {
  super_admin: "Super Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-600">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <Forbidden
        role={ROLE_LABELS[user.role] || user.role}
        backTo="/admin/dashboard"
      />
    );
  }

  return children;
};

export default ProtectedRoute;
