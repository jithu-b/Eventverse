import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} EventVerse — built for TinkerHub.</p>
    </footer>
  );
}
