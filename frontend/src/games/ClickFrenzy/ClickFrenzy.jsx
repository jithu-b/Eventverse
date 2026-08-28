import { useState, useEffect, useCallback, useRef } from "react";
import GameShell from "../GameShell.jsx";
import "./ClickFrenzy.css";

const DURATION = 20;

export default function ClickFrenzy() {
  return (
    <GameShell
      gameSlug="click-frenzy"
      gameName="Click Frenzy"
      instructions="Targets will pop up randomly on the board. Click as many as you can before time runs out. Speed matters!"
      durationSeconds={DURATION}
      scoreLabel="clicks"
    >
      {(gameProps) => <ClickFrenzyBoard {...gameProps} />}
    </GameShell>
  );
}

function ClickFrenzyBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame, durationSeconds }) {
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const boardRef = useRef(null);
  const scoreRef = useRef(0);

  const moveTarget = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const { width, height } = board.getBoundingClientRect();
    const size = 56;
    const x = Math.random() * (width - size);
    const y = Math.random() * (height - size);
    setTargetPos({ x, y });
  }, []);

  useEffect(() => {
    moveTarget();
  }, [moveTarget]);

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      endGame(scoreRef.current);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame]);

  const handleClick = () => {
    scoreRef.current += 1;
    registerScore(scoreRef.current);
    moveTarget();
  };

  return (
    <div className="game-play-area click-frenzy-board" ref={boardRef}>
      <div className="game-hud">
        <span className="game-hud-score">{currentScore} clicks</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>
      <button
        className="click-frenzy-target"
        style={{ left: targetPos.x, top: targetPos.y }}
        onClick={handleClick}
        aria-label="Target"
      />
    </div>
  );
}