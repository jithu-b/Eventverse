import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { quizApi } from "../../api/quizApi.js";
import { eventApi } from "../../api/eventApi.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./QuizManage.css";

const emptyQuizForm = {
  title: "",
  duration_minutes: 10,
  shuffle_questions: true,
};

const emptyQuestionForm = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "a",
  points: 10,
};

export default function QuizManage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [addingQuestion, setAddingQuestion] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const eventRes = await eventApi.getById(eventId);
        setEvent(eventRes.data.event || null);
      } catch (err) {
        console.error("Failed to load event:", err);
      }
      try {
        const quizRes = await quizApi.getByEvent(eventId);
        const loadedQuiz = quizRes.data.quiz || null;
        if (loadedQuiz) {
          try {
            const questionsRes = await quizApi.getQuestions(loadedQuiz.id);
            loadedQuiz.questions = questionsRes.data.questions || [];
          } catch (err) {
            loadedQuiz.questions = [];
          }
        }
        setQuiz(loadedQuiz);
      } catch (err) {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  const handleQuizFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setCreatingQuiz(true);
    try {
      const payload = {
        title: quizForm.title,
        duration_minutes: Number(quizForm.duration_minutes) || 10,
        shuffle_questions: quizForm.shuffle_questions,
      };
      const res = await quizApi.createForEvent(eventId, payload);
      setQuiz(res.data.quiz);
      showToast("Quiz created", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to create quiz", "error");
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleQuestionFormChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!quiz) return;
    setAddingQuestion(true);
    try {
      const payload = {
        question_text: questionForm.question_text,
        option_a: questionForm.option_a,
        option_b: questionForm.option_b,
        option_c: questionForm.option_c || null,
        option_d: questionForm.option_d || null,
        correct_option: questionForm.correct_option,
        points: Number(questionForm.points) || 10,
      };
      const res = await quizApi.addQuestion(quiz.id, payload);
      setQuiz((q) => ({
        ...q,
        question_count: (q.question_count || 0) + 1,
        questions: [...(q.questions || []), res.data.question],
      }));
      setQuestionForm(emptyQuestionForm);
      showToast("Question added", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add question", "error");
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await quizApi.deleteQuestion(questionId);
      setQuiz((q) => ({
        ...q,
        question_count: Math.max((q.question_count || 1) - 1, 0),
        questions: (q.questions || []).filter((qq) => qq.id !== questionId),
      }));
      showToast("Question removed", "success");
    } catch (err) {
      showToast("Failed to remove question", "error");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="quiz-manage-page stagger-down">
      <div className="quiz-manage-header">
        <div>
          <Link to={`/events/${eventId}`} className="quiz-manage-back-link">
            ← Back to event
          </Link>
          <h1>Quiz for {event ? event.title : "Event"}</h1>
        </div>
      </div>

      {!quiz ? (
        <Card className="quiz-manage-card">
          <h2>Create a quiz</h2>
          <p className="quiz-manage-subtitle">
            This event doesn't have a quiz yet. Set one up below.
          </p>
          <form className="auth-form" onSubmit={handleCreateQuiz}>
            <Input
              label="Quiz title"
              name="title"
              value={quizForm.title}
              onChange={handleQuizFormChange}
              required
            />
            <Input
              label="Duration (minutes)"
              type="number"
              name="duration_minutes"
              value={quizForm.duration_minutes}
              onChange={handleQuizFormChange}
              min={1}
              max={180}
            />
            <label className="quiz-manage-checkbox-row">
              <input
                type="checkbox"
                name="shuffle_questions"
                checked={quizForm.shuffle_questions}
                onChange={handleQuizFormChange}
              />
              Shuffle questions for each attempt
            </label>
            <Button type="submit" loading={creatingQuiz} fullWidth>
              Create Quiz
            </Button>
          </form>
        </Card>
      ) : (
        <>
          <Card className="quiz-manage-card">
            <div className="quiz-manage-summary">
              <div>
                <h2>{quiz.title}</h2>
                <p className="quiz-manage-subtitle">
                  {quiz.duration_minutes} min · {quiz.question_count ?? (quiz.questions || []).length} question(s)
                  {quiz.shuffle_questions ? " · shuffled" : ""}
                </p>
              </div>
              <Link to={`/quiz/${quiz.id}/leaderboard`}>
                <Button variant="secondary">View Leaderboard</Button>
              </Link>
            </div>
          </Card>

          <Card className="quiz-manage-card">
            <h2>Add a question</h2>
            <form className="auth-form" onSubmit={handleAddQuestion}>
              <div className="input-group">
                <label className="input-label">Question text</label>
                <textarea
                  className="event-textarea"
                  name="question_text"
                  rows={3}
                  value={questionForm.question_text}
                  onChange={handleQuestionFormChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Option A"
                  name="option_a"
                  value={questionForm.option_a}
                  onChange={handleQuestionFormChange}
                  required
                />
                <Input
                  label="Option B"
                  name="option_b"
                  value={questionForm.option_b}
                  onChange={handleQuestionFormChange}
                  required
                />
                <Input
                  label="Option C (optional)"
                  name="option_c"
                  value={questionForm.option_c}
                  onChange={handleQuestionFormChange}
                />
                <Input
                  label="Option D (optional)"
                  name="option_d"
                  value={questionForm.option_d}
                  onChange={handleQuestionFormChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">Correct option</label>
                  <select
                    className="quiz-manage-select"
                    name="correct_option"
                    value={questionForm.correct_option}
                    onChange={handleQuestionFormChange}
                  >
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </div>
                <Input
                  label="Points"
                  type="number"
                  name="points"
                  value={questionForm.points}
                  onChange={handleQuestionFormChange}
                  min={1}
                />
              </div>
              <Button type="submit" loading={addingQuestion} fullWidth>
                Add Question
              </Button>
            </form>
          </Card>

          <Card className="quiz-manage-card">
            <h2>Questions ({(quiz.questions || []).length})</h2>
            {(quiz.questions || []).length === 0 ? (
              <p className="quiz-manage-subtitle">No questions added yet.</p>
            ) : (
              <ul className="quiz-manage-question-list">
                {(quiz.questions || []).map((q, idx) => (
                  <li key={q.id} className="quiz-manage-question-item">
                    <div>
                      <strong>{idx + 1}. {q.question_text}</strong>
                      <div className="quiz-manage-question-meta">
                        Correct: {q.correct_option?.toUpperCase()} · {q.points} pts
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
