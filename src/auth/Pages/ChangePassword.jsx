import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import Seo from '../../components/Seo';
import { useAuth } from '../Context/AuthContext';
import { extractError } from '../../services/api';
import { changePassword } from '../../services/auth';

const passwordField = 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none';

/** Self-service password change for a signed-in staff user. */
const ChangePassword = () => {
  const { logout } = useAuth();
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const data = await changePassword(form);
      toast.success(data.detail || 'Password updated. Please sign in again.');
      // The server revokes every outstanding token, so force a fresh login.
      await logout();
    } catch (err) {
      const parsed = extractError(err);
      setErrors(parsed.fieldErrors || {});
      toast.error(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Seo title="Change password" noIndex />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-primary mb-2">Change password</h1>
        <p className="text-gray-600 mb-6">
          Minimum 12 characters. All other sessions are signed out after the change.
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="current_password">
              Current password
            </label>
            <input
              id="current_password"
              type="password"
              autoComplete="current-password"
              className={passwordField}
              value={form.current_password}
              onChange={setField('current_password')}
            />
            {errors.current_password && <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="new_password">
              New password
            </label>
            <input
              id="new_password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              className={passwordField}
              value={form.new_password}
              onChange={setField('new_password')}
            />
            {errors.new_password && <p className="text-sm text-red-600 mt-1">{errors.new_password}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="confirm_password">
              Confirm new password
            </label>
            <input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              className={passwordField}
              value={form.confirm_password}
              onChange={setField('confirm_password')}
            />
            {errors.confirm_password && <p className="text-sm text-red-600 mt-1">{errors.confirm_password}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <Link to="/admin/dashboard" className="block text-center text-sm text-primary mt-6 hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default ChangePassword;
