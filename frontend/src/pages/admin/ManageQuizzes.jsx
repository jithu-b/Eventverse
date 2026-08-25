import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const res = await adminApi.listAllQuizzes();
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="admin-page stagger-down">
      <h1>All Quizzes</h1>
      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Event</th>
              <th>Active</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.title}</td>
                <td>{quiz.event_title || "—"}</td>
                <td>
                  <Badge variant={quiz.is_active ? "success" : "default"}>
                    {quiz.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>{quiz.attempt_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
