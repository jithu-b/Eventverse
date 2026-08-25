import "./Loader.css";

export default function Loader({ size = "md", fullScreen = false }) {
  const spinner = <div className={`loader loader-${size}`} />;

  if (fullScreen) {
    return <div className="loader-fullscreen">{spinner}</div>;
  }
  return spinner;
}
