import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { api, errorMessage } from "../../services/api";

/**
 * Request a password-reset email. The server always answers 200 with a
 * generic message so this page never reveals whether an email exists.
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setFieldError("Email is required.");
      return;
    }
    setFieldError("");
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password/", { email: email.trim() });
      setSent(true);
    } catch (err) {
      toast.error(errorMessage(err, "Could not send the reset email."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Forgot password</h1>
        <p className="text-gray-600 text-sm mb-6">
          Enter your admin email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            If that email exists, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="you@example.com"
              />
              {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center text-gray-600">
          <Link to="/admin/login" className="text-primary font-semibold hover:underline">
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
