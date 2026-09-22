import React from "react";
import { Link, useNavigate } from "react-router";

const SUGGESTIONS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
];

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-100 px-4">
      <div className="text-center max-w-lg">
        <p className="text-8xl font-playfair font-bold text-primary mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          This page took an unplanned detour
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has moved. Our events
          are flawless — our URLs occasionally aren't.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ← Go back
          </button>
          <Link
            to="/"
            className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="badge badge-lg badge-outline hover:bg-primary hover:text-white transition"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
