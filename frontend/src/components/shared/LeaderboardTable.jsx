import "./LeaderboardTable.css";

export default function LeaderboardTable({ entries = [], currentUserId, scoreLabel = "Score" }) {
  if (!entries.length) {
    return <p className="leaderboard-empty">No entries yet — be the first!</p>;
  }

  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>{scoreLabel}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr
            key={entry.rank}
            className={entry.user_id === currentUserId ? "leaderboard-row-self" : ""}
          >
            <td>
              {entry.rank === 1 && "🥇"}
              {entry.rank === 2 && "🥈"}
              {entry.rank === 3 && "🥉"}
              {entry.rank > 3 && `#${entry.rank}`}
            </td>
            <td>{entry.name || `User ${entry.user_id}`}</td>
            <td>{entry.score ?? entry.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
