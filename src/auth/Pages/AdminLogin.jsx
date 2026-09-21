import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';

import { useAuth } from '../Context/AuthContext';
import { extractError } from '../../services/api';
import Seo from '../../components/Seo';

/**
 * Real, server-verified login.
 *
 * There are no demo credentials: accounts are created by a super admin from the
 * dashboard (or with `python manage.py create_initial_admin`). Failed attempts
 * are throttled and locked out by django-axes on the server.
 */
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — must stay empty
  const [error, setError] = useState('');
  const [lockedOut, setLockedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin/dashboard';

  if (isAuthenticated) {
    navigate(redirectTo, { replace: true });
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLockedOut(false);

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password, website);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const parsed = extractError(err);
      setLockedOut(parsed.status === 429);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary px-4">
      <Seo title="Admin Login" noIndex />
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-3" aria-hidden="true" />
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Panel</h1>
          <p className="text-gray-600">Sign in with your Ananta Events account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@ananta-events.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Honeypot: hidden from humans and screen readers, ignored when empty. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="admin-website">Website</label>
            <input
              id="admin-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          {error && (
            <div
              className={`border-2 px-4 py-3 rounded ${
                lockedOut ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-red-100 border-red-400 text-red-700'
              }`}
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/admin/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-primary flex gap-3">
          <LockKeyhole className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-gray-600">
            Accounts are provisioned by a super admin. Five failed attempts lock the account for one hour, and every
            login attempt is logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
