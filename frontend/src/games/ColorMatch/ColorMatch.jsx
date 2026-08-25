import { useState, useEffect, useCallback, useRef } from "react";
import GameShell from "../GameShell.jsx";
import "./ColorMatch.css";

const DURATION = 30;
const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#f59e0b" },
  { name: "Purple", hex: "#7c5cff" },
];

export default function ColorMatch() {
  return (
    <GameShell
      gameSlug="color-match"
      gameName="Color Match"
      instructions='A color word appears, styled in a (possibly different) color. Click "MATCH" if the word and its color match, or "NO MATCH" if they don\'t. Answer as many as you can before time runs out.'
      durationSeconds={DURATION}
      scoreLabel="pts"
    >
      {(gameProps) => <ColorMatchBoard {...gameProps} />}
    </GameShell>
  );
}

function generateRound() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  const isMatch = Math.random() > 0.5;
  const displayColor = isMatch
    ? word
    : COLORS.filter((c) => c.name !== word.name)[
        Math.floor(Math.random() * (COLORS.length - 1))
      ];
  return { word: word.name, colorHex: displayColor.hex, isMatch };
}

function ColorMatchBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame }) {
  const [round, setRound] = useState(generateRound());
  const [feedback, setFeedback] = useState(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      endGame(Math.max(0, scoreRef.current));
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame]);

  const answer = (choseMatch) => {
    const correct = choseMatch === round.isMatch;
    scoreRef.current += correct ? 10 : -5;
    registerScore(Math.max(0, scoreRef.current));
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      setRound(generateRound());
    }, 250);
  };

  return (
    <div className="game-play-area color-match-board">
      <div className="game-hud">
        <span className="game-hud-score">{Math.max(0, currentScore)} pts</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>

      <div className={`color-match-word feedback-${feedback}`} style={{ color: round.colorHex }}>
        {round.word}
      </div>

      <div className="color-match-actions">
        <button className="btn btn-primary" onClick={() => answer(true)}>
          Match
        </button>
        <button className="btn btn-outline" onClick={() => answer(false)}>
          No Match
        </button>
      </div>
    </div>
  );
}