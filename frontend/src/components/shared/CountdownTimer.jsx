import "./CountdownTimer.css";

/**
 * Visual wrapper around the useTimer hook's output.
 * Pass in { formatted, seconds } from useTimer(), plus a warning threshold.
 *
 * Usage:
 *   const timer = useTimer({ initialSeconds: 60, mode: "down", onComplete: handleSubmit });
 *   <CountdownTimer formatted={timer.formatted} seconds={timer.seconds} warnAt={10} />
 */
export default function CountdownTimer({ formatted, seconds, warnAt = 10, totalSeconds }) {
  const isWarning = seconds <= warnAt && seconds > 0;
  const isDone = seconds === 0;

  const progress =
    totalSeconds && totalSeconds > 0
      ? Math.max(0, Math.min(100, (seconds / totalSeconds) * 100))
      : null;

  return (
    <div className={`countdown-timer ${isWarning ? "is-warning" : ""} ${isDone ? "is-done" : ""}`}>
      <span className="countdown-time">{formatted}</span>
      {progress !== null && (
        <div className="countdown-bar-track">
          <div className="countdown-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}