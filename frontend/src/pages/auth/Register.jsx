import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import "./Auth.css";

const ROLES = [
  { value: "participant", title: "Participant", desc: "Join & compete in events" },
  { value: "organizer", title: "Organizer", desc: "Create & manage events" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "participant",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const selectRole = (role) => setForm((prev) => ({ ...prev, role }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate(
        user.role === "organizer" ? "/dashboard/organizer" : "/dashboard/participant",
        { replace: true }
      );
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel animate-scale-in">
        <div className="auth-header">
          <span className="brand-mark auth-brand-mark" />
          <h2>Create your account</h2>
          <p>Join EventVerse and start exploring events</p>
        </div>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div>
            <label className="input-label" style={{ marginBottom: "var(--space-2)", display: "block" }}>
              I am a...
            </label>
            <div className="auth-role-select">
              {ROLES.map((r) => (
                <div
                  key={r.value}
                  className={`auth-role-option ${form.role === r.value ? "is-selected" : ""}`}
                  onClick={() => selectRole(r.value)}
                >
                  <span className="role-title">{r.title}</span>
                  <span className="role-desc">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Create account
          </Button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
}