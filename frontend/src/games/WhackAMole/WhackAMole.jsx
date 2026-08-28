import { useState, useEffect, useRef, useCallback } from "react";
import GameShell from "../GameShell.jsx";
import "./WhackAMole.css";

const DURATION = 25;
const HOLE_COUNT = 9;
const POP_INTERVAL_MS = 700;

export default function WhackAMole() {
  return (
    <GameShell
      gameSlug="whack-a-mole"
      gameName="Whack-a-Mole"
      instructions="Moles pop up randomly across the grid. Click them before they disappear to score points!"
      durationSeconds={DURATION}
      scoreLabel="pts"
    >
      {(gameProps) => <WhackAMoleBoard {...gameProps} />}
    </GameShell>
  );
}

function WhackAMoleBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame }) {
  const [activeHole, setActiveHole] = useState(null);
  const [whacked, setWhacked] = useState(false);
  const scoreRef = useRef(0);
  const popRef = useRef(null);

  const popMole = useCallback(() => {
    setWhacked(false);
    setActiveHole(Math.floor(Math.random() * HOLE_COUNT));
  }, []);

  useEffect(() => {
    popRef.current = setInterval(popMole, POP_INTERVAL_MS);
    return () => clearInterval(popRef.current);
  }, [popMole]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(popRef.current);
      endGame(scoreRef.current);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame]);

  const handleWhack = (index) => {
    if (index !== activeHole || whacked) return;
    setWhacked(true);
    scoreRef.current += 5;
    registerScore(scoreRef.current);
  };

  return (
    <div className="game-play-area">
      <div className="game-hud">
        <span className="game-hud-score">{currentScore} pts</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>
      <div className="whack-grid">
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <button
            key={i}
            className="whack-hole"
            onClick={() => handleWhack(i)}
          >
            {activeHole === i && (
              <span className={`whack-mole ${whacked ? "is-whacked" : ""}`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}