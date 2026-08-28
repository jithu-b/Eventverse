import { useState, useEffect, useRef, useCallback } from "react";
import GameShell from "../GameShell.jsx";
import "./BalloonPop.css";

const DURATION = 25;
const SPAWN_INTERVAL_MS = 500;

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#7c5cff", "#ec4899"];

export default function BalloonPop() {
  return (
    <GameShell
      gameSlug="balloon-pop"
      gameName="Balloon Pop"
      instructions="Balloons float upward from the bottom. Pop as many as you can by clicking them before they escape off the top!"
      durationSeconds={DURATION}
      scoreLabel="pts"
    >
      {(gameProps) => <BalloonPopBoard {...gameProps} />}
    </GameShell>
  );
}

let balloonIdCounter = 0;

function BalloonPopBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame }) {
  const [balloons, setBalloons] = useState([]);
  const scoreRef = useRef(0);
  const spawnRef = useRef(null);
  const riseRef = useRef(null);

  const spawnBalloon = useCallback(() => {
    const id = ++balloonIdCounter;
    const x = 5 + Math.random() * 85;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setBalloons((prev) => [...prev, { id, x, y: 105, color }]);
  }, []);

  useEffect(() => {
    spawnRef.current = setInterval(spawnBalloon, SPAWN_INTERVAL_MS);
    riseRef.current = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 1.8 })).filter((b) => b.y > -15)
      );
    }, 40);
    return () => {
      clearInterval(spawnRef.current);
      clearInterval(riseRef.current);
    };
  }, [spawnBalloon]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(spawnRef.current);
      clearInterval(riseRef.current);
      endGame(scoreRef.current);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame]);

  const popBalloon = (id) => {
    scoreRef.current += 5;
    registerScore(scoreRef.current);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="game-play-area balloon-pop-board">
      <div className="game-hud">
        <span className="game-hud-score">{currentScore} pts</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>
      {balloons.map((b) => (
        <button
          key={b.id}
          className="balloon"
          style={{ left: `${b.x}%`, top: `${b.y}%`, background: b.color }}
          onClick={() => popBalloon(b.id)}
        />
      ))}
    </div>
  );
}