import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import "./Auth.css";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel animate-scale-in">
        {resetToken ? <ResetPasswordForm token={resetToken} navigate={navigate} /> : <RequestResetForm />}
      </div>
    </div>
  );
}

function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <span className="brand-mark auth-brand-mark" />
        <h2>Forgot password?</h2>
        <p>Enter your email and we'll send you a reset link</p>
      </div>

      {sent ? (
        <div className="auth-success-banner">
          If an account exists for that email, a reset link is on its way.
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error-banner">{error}</div>}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth loading={loading}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="auth-footer-text">
        Remembered it? <Link to="/login" className="auth-link">Back to login</Link>
      </p>
    </>
  );
}

function ResetPasswordForm({ token, navigate }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <span className="brand-mark auth-brand-mark" />
        <h2>Set a new password</h2>
        <p>Choose a strong password for your account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-error-banner">{error}</div>}
        <Input
          label="New password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" fullWidth loading={loading}>
          Reset password
        </Button>
      </form>
    </>
  );
}