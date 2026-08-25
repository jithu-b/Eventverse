import "./Card.css";

export default function Card({ children, className = "", glass = true, onClick, ...rest }) {
  return (
    <div
      className={`card ${glass ? "glass-panel" : ""} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}
