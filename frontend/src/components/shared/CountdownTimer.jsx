import "./CountdownTimer.css";

export default function CountdownTimer({ secondsLeft, totalSeconds }) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const percent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  const isUrgent = secondsLeft <= 30;

  return (
    <div className={`countdown-timer ${isUrgent ? "countdown-urgent" : ""}`}>
      <div className="countdown-text">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="countdown-bar-track">
        <div className="countdown-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
