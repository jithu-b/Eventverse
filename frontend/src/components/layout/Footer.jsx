import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer glass-nav">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" />
          <span>EventVerse</span>
        </div>

        <nav className="footer-links">
          <Link to="/events">Events</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </nav>

        <p className="footer-copy">
          © {year} EventVerse · Built for TinkerHub
        </p>
      </div>
    </footer>
  );
}