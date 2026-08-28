import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { gameApi } from "../api/gameApi.js";
import { useAuth } from "../hooks/useAuth.js";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Button.jsx";
import LeaderboardTable from "../components/shared/LeaderboardTable.jsx";
import "./GameShell.css";

/**
 * Shared wrapper for all 10 mini-games.
 *
 * Handles: instructions modal, start/restart flow, personal best tracking,
 * score submission, and event leaderboard display. The actual game canvas
 * is rendered via the `children` render-prop function.
 *
 * Usage:
 *   <GameShell
 *     gameSlug="click-frenzy"
 *     gameName="Click Frenzy"
 *     instructions="Click as many targets as you can in 30 seconds."
 *     durationSeconds={30}
 *     scoreLabel="clicks"
 *   >
 *     {({ phase, timeLeft, registerScore, endGame }) => (
 *       <YourGameCanvas phase={phase} timeLeft={timeLeft} onScore={registerScore} />
 *     )}
 *   </GameShell>
 */
export default function GameShell({
  gameSlug,
  gameName,
  instructions,
  durationSeconds = 30,
  scoreLabel = "pts",
  children,
}) {
  const { id: eventId } = useParams();
  const { user } = useAuth();

  const [gameId, setGameId] = useState(null);
  const [phase, setPhase] = useState("instructions"); // instructions | playing | gameover
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [currentScore, setCurrentScore] = useState(0);
  const [personalBest, setPersonalBest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Resolve the game record for this event + fetch personal best
  useEffect(() => {
    gameApi
      .getByEvent(eventId)
      .then((res) => {
        const game = (res.data.games || []).find((g) => g.game_type === gameSlug);
        if (game) {
          setGameId(game.id);
          gameApi
            .getMyPersonalBest(game.id)
            .then((res2) => setPersonalBest(res2.data.best_score ?? null))
            .catch(() => setPersonalBest(null));
        }
      })
      .catch(() => {});
  }, [eventId, gameSlug]);

  const startGame = useCallback(() => {
    setCurrentScore(0);
    setTimeLeft(durationSeconds);
    setPhase("playing");
  }, [durationSeconds]);

  const restartGame = useCallback(() => {
    setPhase("instructions");
  }, []);

  const endGame = useCallback(
    async (finalScore) => {
      setCurrentScore(finalScore);
      setPhase("gameover");

      if (!gameId) return;
      setSubmitting(true);
      try {
        await gameApi.submitScore(gameId, { score: finalScore, time_taken: durationSeconds - timeLeft });
        setPersonalBest((prev) => (prev === null || finalScore > prev ? finalScore : prev));
        const lbRes = await gameApi.getLeaderboard(gameId);
        setLeaderboard(lbRes.data.leaderboard || []);
      } catch {
        /* score submission failed silently; game result still shown locally */
      } finally {
        setSubmitting(false);
      }
    },
    [gameId, durationSeconds, timeLeft]
  );

  // registerScore lets in-progress games report a live running score (e.g. Click Frenzy tally)
  const registerScore = useCallback((score) => setCurrentScore(score), []);

  return (
    <div className="page container game-shell-page">
      <div className="game-shell-header">
        <h2>{gameName}</h2>
        <div className="flex gap-2 items-center">
          {personalBest !== null && (
            <span className="game-personal-best">
              Personal Best: <strong>{personalBest}</strong> {scoreLabel}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowLeaderboard(true)}>
            Leaderboard
          </Button>
        </div>
      </div>

      <div className="game-shell-stage glass-panel">
        {phase === "instructions" && (
          <div className="game-instructions-panel">
            <h3>How to play</h3>
            <p className="mt-3">{instructions}</p>
            <p className="text-tertiary mt-2">Time limit: {durationSeconds} seconds</p>
            <Button className="mt-5" onClick={startGame}>
              Start Game
            </Button>
          </div>
        )}

        {phase === "playing" &&
          children({
            phase,
            timeLeft,
            setTimeLeft,
            currentScore,
            registerScore,
            endGame,
            durationSeconds,
          })}

        {phase === "gameover" && (
          <div className="game-over-panel">
            <h3>Game Over!</h3>
            <div className="game-final-score">
              {currentScore} <span>{scoreLabel}</span>
            </div>
            {submitting && <p className="text-tertiary">Submitting score...</p>}
            {personalBest === currentScore && currentScore > 0 && (
              <p className="game-new-best">🎉 New personal best!</p>
            )}
            <div className="flex gap-3 justify-center mt-5">
              <Button onClick={restartGame}>Play Again</Button>
              <Button variant="outline" onClick={() => setShowLeaderboard(true)}>
                View Leaderboard
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        title={`${gameName} Leaderboard`}
      >
        <LeaderboardTable
          entries={leaderboard}
          currentUserId={user?.id}
          scoreLabel={scoreLabel}
        />
      </Modal>
    </div>
  );
}