import { Link } from 'react-router';
import { ShieldAlert } from 'lucide-react';

/** 403 page — shown when a signed-in user lacks the required role. */
const Forbidden = ({ message }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center max-w-lg">
      <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" aria-hidden="true" />
      <h1 className="text-4xl font-playfair font-bold text-base-content mb-4">403 — Access denied</h1>
      <p className="text-base-content/70 mb-8">
        {message ||
          'Your account does not have permission to view this page. Contact a super admin if you need access.'}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/admin/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
        <Link to="/" className="btn btn-ghost">
          Go to website
        </Link>
      </div>
    </div>
  </div>
);

export default Forbidden;
