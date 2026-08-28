import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { quizApi } from "../../api/quizApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import LeaderboardTable from "../../components/shared/LeaderboardTable.jsx";
import "./Quiz.css";

export default function QuizLeaderboard() {
  const { id: eventId } = useParams();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const fetchLeaderboard = () => {
      quizApi
        .getByEvent(eventId)
        .then((res) => quizApi.getLeaderboard(res.data.quiz.id))
        .then((res) => setEntries(res.data.leaderboard || []))
        .catch(() => setEntries([]))
        .finally(() => setLoading(false));
    };

    fetchLeaderboard();
    // live-ish updates via polling every 5s
    intervalId = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(intervalId);
  }, [eventId]);

  return (
    <div className="page container" style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="section-title text-center">
        <h2>Quiz Leaderboard</h2>
        <p>Live rankings — updates automatically</p>
      </div>

      <LeaderboardTable entries={entries} currentUserId={user?.id} scoreLabel="pts" loading={loading} />

      <div className="text-center mt-5">
        <Link to={`/events/${eventId}`} className="btn btn-outline">
          Back to Event
        </Link>
      </div>
    </div>
  );
}