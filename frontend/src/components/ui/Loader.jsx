import "./Loader.css";

/**
 * size: "sm" | "md" | "lg"
 * fullScreen: centers in a full-viewport overlay (route/page loading)
 */
export default function Loader({ size = "md", fullScreen = false, label }) {
  const spinner = (
    <div className={`loader loader-${size}`}>
      <span className="loader-ring" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {spinner}
        {label && <p className="loader-label">{label}</p>}
      </div>
    );
  }

  return (
    <div className="loader-inline">
      {spinner}
      {label && <span className="loader-label">{label}</span>}
    </div>
  );
}