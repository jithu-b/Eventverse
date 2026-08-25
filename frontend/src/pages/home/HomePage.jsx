import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Home.css";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [statsRes, eventsRes] = await Promise.all([
          eventApi.stats(),
          eventApi.list(),
        ]);
        if (cancelled) return;
        setStats(statsRes.data);
        const now = new Date();
        const upcoming = (eventsRes.data.events || [])
          .filter((e) => !e.start_time || new Date(e.start_time) >= now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .slice(0, 3);
        setEvents(upcoming);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home-page stagger-down">
        <section className="home-hero">
          <h1 className="home-hero-title">
          {["TinkerHub", "SBCE"].map((word, i) => (
            <span
              key={word}
              className={`home-hero-word ${i === 1 ? "home-hero-accent" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="home-hero-tagline">
          Empowering students to build, break, and ship things that matter
          through hackathons, workshops, and hands-on learning.
        </p>
        <div className="home-hero-actions">
          <Link to="/events">
            <Button variant="primary">Explore Events</Button>
          </Link>
          <Link to="/execom">
            <Button variant="ghost">Meet Execom</Button>
          </Link>
        </div>
      </section>

      <section className="home-stats">
        <Card className="home-stat-card">
          <span className="home-stat-label">Active Members</span>
          <span className="home-stat-value">
            {loading ? "…" : `${stats?.active_members ?? 0}+`}
          </span>
        </Card>
        <Card className="home-stat-card">
          <span className="home-stat-label">Events Hosted</span>
          <span className="home-stat-value">
            {loading ? "…" : stats?.events_hosted ?? 0}
          </span>
        </Card>
      </section>

      <section className="home-upcoming">
        <h2>Upcoming Events</h2>
        {loading ? (
          <Loader fullScreen={false} />
        ) : events.length === 0 ? (
          <Card className="home-empty-card">
            <p>All currently scheduled events are completed. Stay tuned for new tracks!</p>
          </Card>
        ) : (
          <div className="home-events-grid">
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="home-event-link">
                <Card className="home-event-card">
                  {event.banner_url && (
                    <img src={event.banner_url} alt={event.title} className="home-event-banner" />
                  )}
                  <div className="home-event-body">
                    <h3>{event.title}</h3>
                    <p className="home-event-meta">
                      {event.start_time ? new Date(event.start_time).toLocaleString() : "TBA"}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
