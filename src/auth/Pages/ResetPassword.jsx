import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

import Seo from '../../components/Seo';
import { extractError } from '../../services/api';
import { resetPassword } from '../../services/auth';

/** Consume a single-use reset token (`/admin/reset-password?token=…`). */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await resetPassword({ token, ...form });
      toast.success('Password updated. Please sign in.');
      navigate('/admin/login', { replace: true });
    } catch (err) {
      const parsed = extractError(err);
      setErrors(parsed.fieldErrors || {});
      toast.error(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Seo title="Reset password" noIndex />
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Invalid reset link</h1>
          <p className="text-gray-600 mb-6">
            This link is missing its token. Please request a new password reset email.
          </p>
          <Link to="/admin/forgot-password" className="btn btn-primary">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Seo title="Set a new password" noIndex />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">Set a new password</h1>
        <p className="text-gray-600 mb-6">Minimum 12 characters. The link can only be used once.</p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="reset-new">
              New password
            </label>
            <input
              id="reset-new"
              type="password"
              minLength={12}
              autoComplete="new-password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              value={form.new_password}
              onChange={setField('new_password')}
            />
            {errors.new_password && <p className="text-sm text-red-600 mt-1">{errors.new_password}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="reset-confirm">
              Confirm password
            </label>
            <input
              id="reset-confirm"
              type="password"
              minLength={12}
              autoComplete="new-password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              value={form.confirm_password}
              onChange={setField('confirm_password')}
            />
            {errors.confirm_password && <p className="text-sm text-red-600 mt-1">{errors.confirm_password}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Saving…' : 'Set new password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
