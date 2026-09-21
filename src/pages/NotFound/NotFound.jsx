import { Link } from 'react-router';
import { SearchX } from 'lucide-react';

/** 404 page used both as a route and as the router's errorElement fallback. */
const NotFound = ({ title = '404 — Page not found', message }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
    <div className="text-center max-w-xl">
      <SearchX className="w-16 h-16 text-primary mx-auto mb-6" aria-hidden="true" />
      <h1 className="text-4xl md:text-5xl font-playfair font-bold text-base-content mb-4">{title}</h1>
      <p className="text-base-content/70 mb-2">
        {message || 'The page you are looking for has moved or never existed.'}
      </p>
      <p className="text-base-content/60 text-sm mb-8">
        Try one of these instead: services, portfolio, media gallery, or contact us.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link to="/services" className="btn btn-outline">
          Our services
        </Link>
        <Link to="/contact" className="btn btn-ghost">
          Contact us
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
