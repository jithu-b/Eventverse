import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import Button from "../ui/Button.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "organizer"
      ? "/dashboard/organizer"
      : "/dashboard/participant";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/events" className="navbar-brand">
        EventVerse
      </Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/events" className="navbar-link">Events</Link>
        <Link to="/gallery" className="navbar-link">Gallery</Link>
        <Link to="/execom" className="navbar-link">Execom</Link>
        {user && <Link to={dashboardPath} className="navbar-link">Dashboard</Link>}
        {user && <Link to="/calendar" className="navbar-link">Calendar</Link>}
        {user?.role === "admin" && <Link to="/admin/users" className="navbar-link">Admin</Link>}
      </div>

      <div className="navbar-actions">
        <button className="navbar-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {user ? (
          <Button variant="ghost" size="sm" onClick={handleLogout}>Log out</Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log in</Button>
            <Button variant="primary" size="sm" onClick={() => navigate("/register")}>Sign up</Button>
          </>
        )}
      </div>
    </nav>
  );
}
