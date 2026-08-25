import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quizApi } from "../../api/quizApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import LeaderboardTable from "../../components/shared/LeaderboardTable.jsx";
import Card from "../../components/ui/Card.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Quiz.css";

export default function QuizLeaderboard() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await quizApi.getLeaderboard(quizId);
        setEntries(res.data.leaderboard || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, [quizId]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="quiz-page stagger-down">
      <h1>Quiz Leaderboard</h1>
      <Card>
        <LeaderboardTable entries={entries} currentUserId={user?.id} scoreLabel="Score" />
      </Card>
    </div>
  );
}
