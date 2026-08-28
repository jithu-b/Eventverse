import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import "./Events.css";

export default function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    eventApi
      .list()
      .then((res) => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page container">
      <div className="events-hero animate-fade-in-up">
        <h1>Discover Events</h1>
        <p>Quizzes, games, and unforgettable experiences — all in one place.</p>
        <div className="events-search">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {(user?.role === "organizer" || user?.role === "admin") && (
          <Link to="/events/new" className="btn btn-primary mt-4">
            + Create Event
          </Link>
        )}
      </div>

      {loading ? (
        <Loader label="Loading events..." />
      ) : filtered.length === 0 ? (
        <div className="events-empty glass-panel">
          <p>No events found{search ? ` for "${search}"` : ""}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 stagger mt-6">
          {filtered.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id}>
              <Card hoverable className="event-card">
                <div
                  className="event-card-banner"
                  style={{
                    backgroundImage: event.banner_url
                      ? `url(${event.banner_url})`
                      : "var(--brand-gradient)",
                  }}
                >
                  <div className="event-card-badges">
                    {event.quiz_enabled && <Badge variant="brand">Quiz</Badge>}
                    {event.games_enabled && <Badge variant="info">Games</Badge>}
                  </div>
                </div>
                <Card.Body>
                  <h4>{event.title}</h4>
                  <p className="text-secondary mt-2 event-card-desc">{event.description}</p>
                  <div className="event-card-meta mt-4">
                    <span>{event.start_time}</span>
                    <span>
                      {event.registration_count}/{event.registration_limit} spots
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}