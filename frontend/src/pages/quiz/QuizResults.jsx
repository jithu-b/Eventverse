import { useLocation, useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import "./Quiz.css";

export default function QuizResults() {
  const { id: eventId } = useParams();
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="page container quiz-results-page">
        <div className="events-empty glass-panel">
          <p>No result to show. Attempt the quiz first.</p>
          <Link to={`/events/${eventId}/quiz`} className="btn btn-primary mt-4">
            Go to Quiz
          </Link>
        </div>
      </div>
    );
  }

  const { score, total_questions, correct_count, percentage } = result;

  return (
    <div className="page container quiz-results-page">
      <Card className="quiz-results-card animate-scale-in">
        <Card.Body>
          <h2>Quiz Complete!</h2>
          <div className="quiz-score-ring">
            <span className="score-value">{percentage}%</span>
          </div>

          <div className="quiz-results-stats">
            <div className="quiz-results-stat">
              <strong>{score}</strong>
              <span>Points</span>
            </div>
            <div className="quiz-results-stat">
              <strong>{correct_count}/{total_questions}</strong>
              <span>Correct</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-4">
            <Link to={`/events/${eventId}/quiz/leaderboard`} className="btn btn-primary">
              View Leaderboard
            </Link>
            <Link to={`/events/${eventId}`} className="btn btn-outline">
              Back to Event
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}