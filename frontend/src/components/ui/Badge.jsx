import "./Badge.css";

/**
 * Small status/label pill.
 * variant: "default" | "success" | "warning" | "danger" | "info" | "brand"
 */
export default function Badge({ children, variant = "default", dot = false, className = "" }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}