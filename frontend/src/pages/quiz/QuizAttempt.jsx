import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizApi } from "../../api/quizApi.js";
import { useToast } from "../../components/ui/Toast.jsx";
import { useTimer, formatTime } from "../../hooks/useTimer.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import CountdownTimer from "../../components/shared/CountdownTimer.jsx";
import "./Quiz.css";

const OPTION_KEYS = ["a", "b", "c", "d"];

export default function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { seconds, start, reset } = useTimer({ mode: "down", onComplete: handleTimeUp });

  useEffect(() => {
    let ignore = false;
    async function startQuiz() {
      setLoading(true);
      try {
        const res = await quizApi.startAttempt(quizId);
        if (ignore) return;
        setAttemptId(res.data.attempt_id);
        setQuizTitle(res.data.quiz_title || "Quiz");
        setQuestions(res.data.questions || []);
        const totalSeconds = (res.data.duration_minutes || 10) * 60;
        reset(totalSeconds);
        start();
      } catch (err) {
        if (ignore) return;
        showToast(err.response?.data?.error || "Could not start quiz", "error");
        navigate(-1);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    startQuiz();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const selectAnswer = (questionId, optionKey) => {
    console.log("SELECT_ANSWER", questionId, optionKey);
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionKey };
      console.log("ANSWERS_STATE_NOW", next);
      return next;
    });
  };

  async function handleSubmit() {
    console.log("SUBMIT_CLICKED", { attemptId: attemptId, submitting: submitting, answers: answers });
    if (submitting || !attemptId) return;
    setSubmitting(true);
    try {
      const res = await quizApi.submitAttempt(attemptId, answers);
      showToast("Quiz submitted!", "success");
      navigate(`/quiz/${quizId}/results`, { state: { result: res.data } });
    } catch (err) {
      showToast(err.response?.data?.error || "Submission failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader fullScreen />;

  return (
    <div className="quiz-page stagger-down">
      <div className="quiz-header">
        <h1>{quizTitle}</h1>
        <CountdownTimer formatted={formatTime(seconds)} seconds={seconds} />
      </div>

      <div className="quiz-questions">
        {questions.map((q, idx) => (
          <Card key={q.id} className="quiz-question-card">
            <p className="quiz-question-number">Question {idx + 1}</p>
            <h3 className="quiz-question-text">{q.question_text}</h3>
            <div className="quiz-options">
              {OPTION_KEYS.map((key) => {
                const optionText = q[`option_${key}`];
                if (!optionText) return null;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`quiz-option ${answers[q.id] === key ? "quiz-option-selected" : ""}`}
                    onClick={() => selectAnswer(q.id, key)}
                  >
                    {optionText}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <Button variant="primary" size="lg" onClick={handleSubmit} loading={submitting} className="quiz-submit-btn">
        Submit Quiz
      </Button>
    </div>
  );
}
