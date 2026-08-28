import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import QRCodeBox from "../../components/shared/QRCodeBox.jsx";
import "./Events.css";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    eventApi
      .getById(id)
      .then((res) => setEvent(res.data.event))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    setError("");
    try {
      const res = await eventApi.register(id);
      setEvent((prev) => ({ ...prev, is_registered: true, registration_count: prev.registration_count + 1 }));
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading event..." />;
  if (error && !event) return <div className="page container"><div className="events-empty glass-panel">{error}</div></div>;
  if (!event) return null;

  const isOwner = user?.id === event.organizer_id;
  const isFull = event.registration_count >= event.registration_limit;
  const canManage = isOwner || user?.role === "admin";

  return (
    <div className="page container">
      <div
        className="event-detail-banner"
        style={{
          backgroundImage: event.banner_url ? `url(${event.banner_url})` : "var(--brand-gradient)",
        }}
      />

      <div className="event-detail-layout animate-fade-in-up">
        <div className="event-detail-main">
          <div className="flex items-center gap-2 mb-3">
            {event.quiz_enabled && <Badge variant="brand">Quiz enabled</Badge>}
            {event.games_enabled && <Badge variant="info">Games enabled</Badge>}
            {event.certificate_enabled && <Badge variant="success">Certificates</Badge>}
          </div>

          <h1>{event.title}</h1>
          <p className="mt-4">{event.description}</p>

          <div className="event-detail-schedule mt-6">
            <div className="event-schedule-item">
              <strong>Starts:</strong> <span>{event.start_time}</span>
            </div>
            <div className="event-schedule-item">
              <strong>Ends:</strong> <span>{event.end_time}</span>
            </div>
          </div>

          {event.quiz_enabled && (
            <div className="mt-6">
              <h3>Quiz</h3>
              <p className="text-secondary mt-2">Test your knowledge and climb the leaderboard.</p>
              <Link to={`/events/${id}/quiz`} className="btn btn-primary mt-3">
                Enter Quiz
              </Link>
            </div>
          )}

          {event.games_enabled && (
            <div className="mt-6">
              <h3>Games</h3>
              <p className="text-secondary mt-2">Play mini-games and compete for the top spot.</p>
              <div className="event-feature-list mt-3">
                {(event.enabled_games || []).map((g) => (
                  <Link key={g.slug} to={`/events/${id}/games/${g.slug}`} className="event-feature-pill">
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="event-detail-sidebar">
          <Card>
            <Card.Body>
              {error && <div className="auth-error-banner mb-3">{error}</div>}
              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary">Spots</span>
                <strong>{event.registration_count}/{event.registration_limit}</strong>
              </div>

              {!user ? (
                <Button fullWidth onClick={() => navigate("/login")}>
                  Log in to register
                </Button>
              ) : event.is_registered ? (
                <Button fullWidth variant="secondary" disabled>
                  ✓ Registered
                </Button>
              ) : (
                <Button fullWidth onClick={handleRegister} loading={registering} disabled={isFull}>
                  {isFull ? "Event Full" : "Register Now"}
                </Button>
              )}

              {canManage && (
                <div className="flex gap-2 mt-3">
                  <Link to={`/events/${id}/edit`} className="btn btn-outline btn-sm w-full">
                    Edit
                  </Link>
                  <Link to={`/events/${id}/scan`} className="btn btn-outline btn-sm w-full">
                    Scan QR
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>

          {event.is_registered && (
            <QRCodeBox value={`${event.id}:${event.qr_secret}`} label="Your check-in QR" size={180} />
          )}
        </div>
      </div>
    </div>
  );
}