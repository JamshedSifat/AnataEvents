import { Link, isRouteErrorResponse, useRouteError } from 'react-router';

import NotFound from '../pages/NotFound/NotFound';

/**
 * Router-level errorElement: replaces the blank screen react-router shows by
 * default (and the blank `/admin` route the old router rendered).
 */
const RouteError = () => {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  if (is404) {
    return (
      <div className="min-h-screen bg-base-100">
        <NotFound />
      </div>
    );
  }

  const message =
    (isRouteErrorResponse(error) && (error.data?.detail || error.statusText)) ||
    error?.message ||
    'An unexpected error occurred.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-playfair font-bold text-base-content mb-4">Something went wrong</h1>
        <p className="text-base-content/70 mb-8">{message}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <Link to="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RouteError;
