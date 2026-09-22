import React from "react";

/** Shared loading / empty / error states for API-backed sections. */

export const SectionSpinner = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <span className="loading loading-spinner loading-lg text-primary"></span>
    <p className="text-gray-500">{label}</p>
  </div>
);

export const EmptyState = ({ icon = "🗂️", message = "Nothing here yet.", hint }) => (
  <div className="text-center py-16">
    <p className="text-5xl mb-3">{icon}</p>
    <p className="text-lg font-semibold text-gray-700 mb-1">{message}</p>
    {hint && <p className="text-sm text-gray-500">{hint}</p>}
  </div>
);

export const ErrorState = ({ message = "Failed to load data.", onRetry }) => (
  <div className="text-center py-16">
    <p className="text-5xl mb-3">⚠️</p>
    <p className="text-lg font-semibold text-red-600 mb-1">{message}</p>
    <p className="text-sm text-gray-500 mb-4">
      Check your connection and try again.
    </p>
    {onRetry && (
      <button onClick={onRetry} className="btn btn-outline btn-primary btn-sm">
        Retry
      </button>
    )}
  </div>
);

/**
 * Tiny data-fetching hook used across pages:
 *   const { data, loading, error, reload } = useApiData("/artists/", { category: "singer" });
 */
export { default as useApiData } from "./useApiData";
