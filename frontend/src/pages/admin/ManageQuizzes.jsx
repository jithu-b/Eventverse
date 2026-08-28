import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .listAllQuizzes()
      .then((res) => setQuizzes(res.data.quizzes || []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page container">
      <div className="dashboard-section-header">
        <div>
          <h1>Manage Quizzes</h1>
          <p className="text-secondary mt-2">{quizzes.length} quizzes across all events</p>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading quizzes..." />
      ) : (
        <Card>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Event</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Attempts</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.title}</td>
                    <td className="text-secondary">{q.event_title}</td>
                    <td>{q.question_count}</td>
                    <td>{q.duration_minutes} min</td>
                    <td>
                      <Badge variant="brand">{q.attempt_count} attempts</Badge>
                    </td>
                    <td>
                      <Link to={`/events/${q.event_id}/quiz/leaderboard`} className="admin-action-danger" style={{ color: "var(--brand-500)" }}>
                        View leaderboard
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quizzes.length === 0 && <p className="text-secondary text-center" style={{ padding: "var(--space-6)" }}>No quizzes found.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}