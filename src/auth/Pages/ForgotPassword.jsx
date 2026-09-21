import { useState } from 'react';
import { Link } from 'react-router';

import Seo from '../../components/Seo';
import { forgotPassword } from '../../services/auth';

/**
 * Request a reset link. The API never reveals whether an address exists, so the
 * UI shows the same confirmation either way (no user enumeration).
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email.trim());
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Seo title="Forgot password" noIndex />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">Reset your password</h1>
        <p className="text-gray-600 mb-6">
          Enter the email address of your admin account and we will send a single-use reset link (valid for 60
          minutes).
        </p>

        {sent ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-800" role="status">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox and spam
            folder.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="forgot-email">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="username"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <Link to="/admin/login" className="block text-center text-sm text-primary mt-6 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
