import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizApi } from "../../api/quizApi.js";
import { useTimer } from "../../hooks/useTimer.js";
import CountdownTimer from "../../components/shared/CountdownTimer.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Quiz.css";

export default function QuizAttempt() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    quizApi
      .getByEvent(eventId)
      .then((res) => setQuiz(res.data.quiz))
      .catch(() => setError("No quiz found for this event."))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      const res = await quizApi.submitAttempt(attemptId, answers);
      navigate(`/events/${eventId}/quiz/results`, { state: { result: res.data } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit quiz.");
      setSubmitting(false);
    }
  }, [attemptId, answers, eventId, navigate, submitting]);

  const timer = useTimer({
    initialSeconds: quiz ? quiz.duration_minutes * 60 : 0,
    mode: "down",
    onComplete: handleSubmit,
  });

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await quizApi.startAttempt(quiz.id);
      setAttemptId(res.data.attempt_id);
      setQuestions(res.data.questions);
      timer.reset(quiz.duration_minutes * 60);
      timer.start();
    } catch (err) {
      setError(err.response?.data?.error || "Could not start quiz.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  if (loading) return <Loader fullScreen label="Loading quiz..." />;
  if (error && !questions.length) {
    return <div className="page container"><div className="events-empty glass-panel">{error}</div></div>;
  }
  if (!quiz) return null;

  // ---- Pre-start screen ----
  if (!attemptId) {
    return (
      <div className="page container quiz-intro-page">
        <Card className="quiz-intro-card animate-scale-in">
          <Card.Body>
            <h2>{quiz.title}</h2>
            <p className="text-secondary mt-3">
              {quiz.question_count} questions · {quiz.duration_minutes} minutes · Questions are shuffled
            </p>
            <ul className="quiz-rules mt-5">
              <li>Once started, the timer cannot be paused.</li>
              <li>The quiz auto-submits when time runs out.</li>
              <li>Each question is scored automatically.</li>
            </ul>
            <Button fullWidth className="mt-6" onClick={handleStart}>
              Start Quiz
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="page container quiz-attempt-page">
      <div className="quiz-attempt-header">
        <div className="quiz-progress">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <CountdownTimer
          formatted={timer.formatted}
          seconds={timer.seconds}
          totalSeconds={quiz.duration_minutes * 60}
          warnAt={30}
        />
      </div>

      {error && <div className="auth-error-banner mb-4">{error}</div>}

      <Card className="quiz-question-card animate-fade-in-up" key={question.id}>
        <Card.Body>
          <h3>{question.question_text}</h3>
          <div className="quiz-options mt-5">
            {["a", "b", "c", "d"].map((key) => {
              const text = question[`option_${key}`];
              if (!text) return null;
              const isSelected = answers[question.id] === key;
              return (
                <button
                  key={key}
                  className={`quiz-option ${isSelected ? "is-selected" : ""}`}
                  onClick={() => selectAnswer(question.id, key)}
                >
                  <span className="quiz-option-key">{key.toUpperCase()}</span>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      <div className="quiz-nav-buttons">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Previous
        </Button>
        {isLast ? (
          <Button onClick={handleSubmit} loading={submitting}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={() => setCurrentIndex((i) => i + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}