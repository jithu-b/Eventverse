import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const dashboardPath = user
    ? user.role === "admin"
      ? "/dashboard/admin"
      : user.role === "organizer"
      ? "/dashboard/organizer"
      : "/dashboard/participant"
    : "/login";

  return (
    <header className="navbar glass-nav">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" />
          <span className="brand-text">EventVerse</span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/events" className="nav-link" onClick={() => setMenuOpen(false)}>
            Events
          </NavLink>

          {user && (
            <NavLink to={dashboardPath} className="nav-link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin/reports" className="nav-link" onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}

          {/* mobile-only auth actions */}
          <div className="navbar-mobile-auth">
            {user ? (
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="navbar-user">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="navbar-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}