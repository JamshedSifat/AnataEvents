import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { api, errorMessage, fieldErrors } from "../../services/api";

/**
 * Choose a new password. The emailed link lands here with
 * ?uid=...&token=... which the API requires to validate the request.
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (password.length < 12) next.new_password = "Password must be at least 12 characters.";
    if (password !== confirm) next.confirm = "Passwords do not match.";
    if (!uid || !token) next.detail = "This reset link is invalid or incomplete. Request a new one.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password/", { uid, token, new_password: password });
      toast.success("Password updated. Please sign in with your new password.");
      navigate("/admin/login", { replace: true });
    } catch (err) {
      const serverFields = fieldErrors(err);
      setErrors(
        Object.keys(serverFields).length > 0
          ? serverFields
          : { detail: errorMessage(err, "Could not reset the password.") }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Reset password</h1>
        <p className="text-gray-600 text-sm mb-6">Choose a strong password (min 12 characters).</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.confirm && <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
          </div>
          {errors.detail && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {errors.detail}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Update password"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          <Link to="/admin/forgot-password" className="text-primary font-semibold hover:underline">
            Request a new link
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
