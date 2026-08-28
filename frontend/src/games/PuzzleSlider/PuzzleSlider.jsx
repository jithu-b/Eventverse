import { useState, useEffect, useCallback, useRef } from "react";
import GameShell from "../GameShell.jsx";
import "./PuzzleSlider.css";

const GRID = 3; // 3x3 = 8 tiles + 1 blank
const DURATION = 90;

function createSolvedBoard() {
  return Array.from({ length: GRID * GRID }, (_, i) => (i === GRID * GRID - 1 ? null : i + 1));
}

function shuffleBoard(board) {
  let shuffled = [...board];
  // perform many valid random moves to guarantee solvability
  let blankIndex = shuffled.indexOf(null);
  for (let i = 0; i < 200; i++) {
    const neighbors = getNeighbors(blankIndex);
    const move = neighbors[Math.floor(Math.random() * neighbors.length)];
    [shuffled[blankIndex], shuffled[move]] = [shuffled[move], shuffled[blankIndex]];
    blankIndex = move;
  }
  return shuffled;
}

function getNeighbors(index) {
  const row = Math.floor(index / GRID);
  const col = index % GRID;
  const neighbors = [];
  if (row > 0) neighbors.push(index - GRID);
  if (row < GRID - 1) neighbors.push(index + GRID);
  if (col > 0) neighbors.push(index - 1);
  if (col < GRID - 1) neighbors.push(index + 1);
  return neighbors;
}

export default function PuzzleSlider() {
  return (
    <GameShell
      gameSlug="puzzle-slider"
      gameName="Puzzle Slider"
      instructions="Slide tiles into the empty space to arrange numbers 1-8 in order. Solve it as fast as possible — your score is based on speed and move efficiency."
      durationSeconds={DURATION}
      scoreLabel="pts"
    >
      {(gameProps) => <PuzzleSliderBoard {...gameProps} />}
    </GameShell>
  );
}

function PuzzleSliderBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame, durationSeconds }) {
  const [board, setBoard] = useState(() => shuffleBoard(createSolvedBoard()));
  const [moves, setMoves] = useState(0);
  const solvedRef = useRef(false);

  const solved = JSON.stringify(board) === JSON.stringify(createSolvedBoard());

  useEffect(() => {
    if (solved && !solvedRef.current) {
      solvedRef.current = true;
      const timeUsed = durationSeconds - timeLeft;
      const score = Math.max(50, 1000 - timeUsed * 5 - moves * 3);
      endGame(score);
    }
  }, [solved, durationSeconds, timeLeft, moves, endGame]);

  useEffect(() => {
    if (solvedRef.current) return;
    if (timeLeft <= 0) {
      endGame(Math.max(0, currentScore));
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame, currentScore]);

  const handleTileClick = (index) => {
    if (solvedRef.current) return;
    const blankIndex = board.indexOf(null);
    if (getNeighbors(index).includes(blankIndex)) {
      const next = [...board];
      [next[index], next[blankIndex]] = [next[blankIndex], next[index]];
      setBoard(next);
      setMoves((m) => m + 1);
      registerScore(moves + 1);
    }
  };

  return (
    <div className="game-play-area puzzle-slider-board">
      <div className="game-hud">
        <span className="game-hud-score">{moves} moves</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>
      <div className="puzzle-grid">
        {board.map((tile, i) => (
          <button
            key={i}
            className={`puzzle-tile ${tile === null ? "is-blank" : ""}`}
            onClick={() => handleTileClick(i)}
            disabled={tile === null}
          >
            {tile}
          </button>
        ))}
      </div>
    </div>
  );
}