import { useState, useEffect, useCallback, useRef } from "react";
import GameShell from "../GameShell.jsx";
import "./MemoryNumber.css";

const START_LENGTH = 3;
const SHOW_MS = 1200;

export default function MemoryNumber() {
  return (
    <GameShell
      gameSlug="memory-number"
      gameName="Memory Number"
      instructions="Memorize the sequence of numbers shown, then type it back in the same order. Each round adds one more digit. Get it wrong and the game ends — your score is the highest round reached."
      durationSeconds={999}
      scoreLabel="rounds"
    >
      {(gameProps) => <MemoryNumberBoard {...gameProps} />}
    </GameShell>
  );
}

function generateSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
}

function MemoryNumberBoard({ currentScore, registerScore, endGame }) {
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState("showing"); // showing | input | wrong
  const [input, setInput] = useState("");
  const [round, setRound] = useState(START_LENGTH);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    beginRound(START_LENGTH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginRound = useCallback((length) => {
    const seq = generateSequence(length);
    setSequence(seq);
    setPhase("showing");
    setInput("");
    setTimeout(() => setPhase("input"), SHOW_MS + length * 250);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = input === sequence.join("");
    if (correct) {
      registerScore(round);
      const nextRound = round + 1;
      setRound(nextRound);
      beginRound(nextRound);
    } else {
      endGame(round - START_LENGTH);
    }
  };

  return (
    <div className="game-play-area memory-number-board">
      <div className="game-hud">
        <span className="game-hud-score">Round {round - START_LENGTH + 1}</span>
      </div>

      {phase === "showing" ? (
        <div className="memory-sequence-display animate-pop">
          {sequence.map((n, i) => (
            <span key={i} className="memory-digit">{n}</span>
          ))}
        </div>
      ) : (
        <form className="memory-input-form" onSubmit={handleSubmit}>
          <p className="text-secondary mb-3">Enter the sequence:</p>
          <input
            className="memory-input"
            type="tel"
            inputMode="numeric"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
            maxLength={sequence.length}
          />
          <button type="submit" className="btn btn-primary mt-4">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}