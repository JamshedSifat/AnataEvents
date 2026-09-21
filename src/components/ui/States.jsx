import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export const LoadingScreen = ({ message = 'Loading…' }) => (
  <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 py-16">
    <Loader2 className="w-10 h-10 animate-spin text-primary" aria-hidden="true" />
    <p className="text-base-content/70">{message}</p>
    <span className="sr-only" role="status">
      {message}
    </span>
  </div>
);

export const LoadingSpinner = ({ className = 'loading loading-spinner loading-lg text-primary' }) => (
  <span className={className} role="status" aria-label="Loading" />
);

export const ErrorState = ({ title = 'Could not load this content', message, onRetry }) => (
  <div className="max-w-xl mx-auto text-center py-12 px-4" role="alert">
    <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" aria-hidden="true" />
    <h2 className="text-2xl font-semibold text-base-content mb-2">{title}</h2>
    <p className="text-base-content/70 mb-6">{message || 'Please try again in a moment.'}</p>
    {onRetry && (
      <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export const EmptyState = ({ title = 'Nothing here yet', message, icon: Icon = Inbox }) => (
  <div className="text-center py-12 px-4">
    <Icon className="w-12 h-12 text-base-content/40 mx-auto mb-4" aria-hidden="true" />
    <h3 className="text-xl font-semibold text-base-content mb-2">{title}</h3>
    {message && <p className="text-base-content/60">{message}</p>}
  </div>
);
