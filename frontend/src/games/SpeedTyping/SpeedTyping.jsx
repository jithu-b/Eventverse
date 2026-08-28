import { useState, useEffect, useRef, useCallback } from "react";
import GameShell from "../GameShell.jsx";
import "./SpeedTyping.css";

const DURATION = 45;
const SNIPPETS = [
  "the quick brown fox jumps over the lazy dog",
  "tinkerhub builds a community of passionate makers",
  "practice makes progress not perfection every single day",
  "great things are built one small step at a time",
  "stay curious keep learning and never stop building",
  "code with purpose and design with empathy always",
];

export default function SpeedTyping() {
  return (
    <GameShell
      gameSlug="speed-typing"
      gameName="Speed Typing"
      instructions="Type the given sentence as fast and accurately as possible. Your score is based on words-per-minute and accuracy. Finish a sentence to get a new one instantly."
      durationSeconds={DURATION}
      scoreLabel="wpm"
    >
      {(gameProps) => <SpeedTypingBoard {...gameProps} />}
    </GameShell>
  );
}

function pickSnippet(exclude) {
  const options = SNIPPETS.filter((s) => s !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function SpeedTypingBoard({ timeLeft, setTimeLeft, currentScore, registerScore, endGame, durationSeconds }) {
  const [target, setTarget] = useState(SNIPPETS[0]);
  const [typed, setTyped] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      const minutes = durationSeconds / 60;
      const wordsTyped = correctChars / 5;
      const wpm = Math.max(0, Math.round(wordsTyped / minutes));
      endGame(wpm);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, setTimeLeft, endGame, durationSeconds, correctChars]);

  const handleChange = (e) => {
    const value = e.target.value;
    setTyped(value);

    if (value === target) {
      const newCorrect = correctChars + target.length;
      const newTotal = totalChars + target.length;
      setCorrectChars(newCorrect);
      setTotalChars(newTotal);

      const elapsedMin = (durationSeconds - timeLeft) / 60 || 0.001;
      const liveWpm = Math.round(newCorrect / 5 / elapsedMin);
      registerScore(liveWpm);

      setTarget(pickSnippet(target));
      setTyped("");
    }
  };

  return (
    <div className="game-play-area speed-typing-board">
      <div className="game-hud">
        <span className="game-hud-score">{currentScore} wpm</span>
        <span className="game-hud-timer">{timeLeft}s</span>
      </div>

      <div className="typing-target">
        {target.split("").map((char, i) => {
          let cls = "";
          if (i < typed.length) {
            cls = typed[i] === char ? "char-correct" : "char-wrong";
          }
          return (
            <span key={i} className={cls}>
              {char}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        className="typing-input"
        value={typed}
        onChange={handleChange}
        placeholder="Start typing here..."
        rows={2}
      />
    </div>
  );
}