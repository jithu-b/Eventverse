import "./LeaderboardTable.css";

/**
 * Reusable ranked leaderboard, shared by Event / Quiz / Game / Overall leaderboards.
 *
 * entries: [{ id, name, score, meta }] — already sorted descending by score.
 * currentUserId: highlights the logged-in user's row.
 * scoreLabel: e.g. "pts", "ms", "%"
 */
export default function LeaderboardTable({ entries = [], currentUserId, scoreLabel = "pts", loading = false }) {
  if (loading) {
    return (
      <div className="leaderboard-table glass-panel">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="leaderboard-row skeleton" style={{ height: 48, marginBottom: 8 }} />
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="leaderboard-empty glass-panel">
        <p>No scores yet — be the first to make the board.</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-table glass-panel">
      {entries.map((entry, index) => {
        const rank = index + 1;
        const isCurrentUser = entry.id === currentUserId;
        return (
          <div
            key={entry.id}
            className={`leaderboard-row ${isCurrentUser ? "is-current-user" : ""} ${rank <= 3 ? `rank-${rank}` : ""}`}
          >
            <span className="leaderboard-rank">
              {rank <= 3 ? <MedalIcon rank={rank} /> : rank}
            </span>
            <span className="leaderboard-name">{entry.name}</span>
            {entry.meta && <span className="leaderboard-meta">{entry.meta}</span>}
            <span className="leaderboard-score">
              {entry.score} <span className="leaderboard-score-unit">{scoreLabel}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MedalIcon({ rank }) {
  const colors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
  return (
    <span className="medal-icon" style={{ background: colors[rank] }}>
      {rank}
    </span>
  );
}