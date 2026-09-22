import React from "react";
import { Link } from "react-router";

const Forbidden = ({ role = "your role", backTo = "/" }) => (
  <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md">
      <p className="text-7xl mb-4">🔒</p>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">403 — Access denied</h1>
      <p className="text-gray-600 mb-6">
        You are signed in as <span className="font-semibold">{role}</span>, which
        does not have permission to view this page. Ask a super admin if you
        need elevated access.
      </p>
      <Link
        to={backTo}
        className="inline-block bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        ← Back to dashboard
      </Link>
    </div>
  </div>
);

export default Forbidden;
