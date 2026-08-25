import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import { quizApi } from "../../api/quizApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Events.css";

export default function EventDetail() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isOrganizerOrAdmin = user?.role === "organizer" || user?.role === "admin";

  const handleQuizClick = async (e) => {
    if (isOrganizerOrAdmin) return;
    e.preventDefault();
    try {
      const res = await quizApi.getByEvent(eventId);
      const quiz = res.data.quiz;
      if (!quiz) {
        showToast("No quiz has been set up for this event yet.", "info");
        return;
      }
      navigate(`/quiz/${quiz.id}/attempt`);
    } catch (err) {
      showToast("No quiz available for this event yet.", "info");
    }
  };

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const res = await eventApi.getById(eventId);
        setEvent(res.data.event);
      } catch (err) {
        showToast("Event not found", "error");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await eventApi.register(eventId);
      showToast("You're registered!", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Registration failed", "error");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!event) return null;

  const isOwner = user && (user.id === event.organizer_id || user.role === "admin");

  return (
    <div className="event-detail-page stagger-down">
      {event.banner_url && (
        <img src={event.banner_url} alt={event.title} className="event-detail-banner" />
      )}

      <div className="event-detail-content">
        <div className="event-detail-header">
          <div>
            <Badge variant="primary">{event.category}</Badge>
            <h1>{event.title}</h1>
            <p className="event-detail-meta">📍 {event.location}</p>
            <p className="event-detail-meta">
              🗓 {event.start_time ? new Date(event.start_time).toLocaleString() : "TBA"}
            </p>
          </div>

          <div className="event-detail-actions">
            {isOwner ? (
              <>
                <Link to={`/events/${event.id}/edit`}>
                  <Button variant="secondary">Edit Event</Button>
                </Link>
                <Link to={`/attendance/scan`} state={{ eventId: event.id }}>
                  <Button variant="ghost">Scan Attendance</Button>
                </Link>
              </>
            ) : (
              user?.role === "participant" && (
                <Button variant="primary" onClick={handleRegister} loading={registering}>
                  Register
                </Button>
              )
            )}
          </div>
        </div>

        <Card className="event-detail-description">
          <h3>About this event</h3>
          <p>{event.description}</p>
        </Card>

        <div className="event-detail-links">
          <Link to={`/quiz/event/${event.id}/manage`} onClick={handleQuizClick} className="event-detail-link-card">
            Quizzes →
          </Link>
          <Link to={`/leaderboard/event/${event.id}`} className="event-detail-link-card">
            Leaderboard →
          </Link>
          <Link to={`/gallery/event/${event.id}`} className="event-detail-link-card">
            Gallery →
          </Link>
        </div>
      </div>
    </div>
  );
}
