import { useLocation, useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./Quiz.css";

export default function QuizResults() {
  const { quizId } = useParams();
  const location = useLocation();
  const results = location.state?.result;

  return (
    <div className="quiz-page quiz-results-page stagger-down">
      <Card className="quiz-results-card">
        <h1>Your Results</h1>
        {results ? (
          <>
            <p className="quiz-results-score">
              {results.score} pts &middot; {results.correct_count} / {results.total_questions} correct
            </p>
            <p className="quiz-results-sub">
              {results.percentage}% &mdash; Nice work!
            </p>
          </>
        ) : (
          <p>No results to show. Please retake the quiz from the event page.</p>
        )}
        <div className="quiz-results-actions">
          <Link to={`/quiz/${quizId}/leaderboard`}>
            <Button variant="secondary">View Leaderboard</Button>
          </Link>
          <Link to="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
