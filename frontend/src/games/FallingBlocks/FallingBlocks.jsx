import { useState, useEffect, useRef, useCallback } from "react";
import GameShell from "../GameShell.jsx";
import "./FallingBlocks.css";

const DURATION = 30;
const SPAWN_INTERVAL_MS = 800;

export default function FallingBlocks() {
  return (
    <GameShell
      gameSlug="falling-blocks"
      gameName="Falling Blocks"
      instructions="Blocks fall from the top. Click the GOOD blocks (blue) for points, and avoid clicking BAD blocks (red) or they'll cost you points. Missed good blocks are fine — just don't click bad ones!"
      durationSeconds={DURATION}
      scoreLabel="pts"
    >
      {(gameProps) => <FallingBlocksBoard {...gameProps} />}
    </GameShell>
  );
}

let blockIdCounter = 0;

function FallingBlocksBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame }) {
  const [blocks, setBlocks] = useState([]);
  const boardRef = useRef(null);
  const scoreRef = useRef(0);
  const spawnRef = useRef(null);
  const fallRef = useRef(null);

  const spawnBlock = useCallback(() => {
    const isGood = Math.random() > 0.35;
    const id = ++blockIdCounter;
    const xPercent = 8 + Math.random() * 84;
    setBlocks((prev) => [...prev, { id, isGood, x: xPercent, y: -10 }]);
  }, []);

  useEffect(() => {
    spawnRef.current = setInterval(spawnBlock, SPAWN_INTERVAL_MS);
    fallRef.current = setInterval(() => {
      setBlocks((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y + 2.2 }))
          .filter((b) => b.y < 110)
      );
    }, 40);
    return () => {
      clearInterval(spawnRef.current);
      clearInterval(fallRef.current);
    };
  }, [spawnBlock]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(spawnRef.current);
      clearInterval(fallRef.current);
      endGame(Math.max(0, scoreRef.current));
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame]);

  const handleBlockClick = (id, isGood) => {
    scoreRef.current += isGood ? 10 : -15;
    registerScore(Math.max(0, scoreRef.current));
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="game-play-area falling-blocks-board" ref={boardRef}>
      <div className="game-hud">
        <span className="game-hud-score">{Math.max(0, currentScore)} pts</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>
      {blocks.map((b) => (
        <button
          key={b.id}
          className={`falling-block ${b.isGood ? "is-good" : "is-bad"}`}
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          onClick={() => handleBlockClick(b.id, b.isGood)}
        />
      ))}
    </div>
  );
}