import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Events.css";

const CATEGORIES = ["workshop", "hackathon", "seminar", "meetup", "competition", "other"];

export default function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await eventApi.list(params);
        setEvents(res.data.events || []);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(loadEvents, 300);
    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="events-page stagger-down">
      <div className="events-header">
        <h1>Discover Events</h1>
        {(user?.role === "organizer" || user?.role === "admin") && (
          <Link to="/events/new">
            <Button variant="primary">+ Create Event</Button>
          </Link>
        )}
      </div>

      <div className="events-filters">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="events-search"
        />
        <select
          className="events-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader fullScreen={false} />
      ) : events.length === 0 ? (
        <Card className="events-empty-card">
          <p>No events found. Check back soon!</p>
        </Card>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="events-card-link">
              <Card className="events-card">
                {event.banner_url && (
                  <img src={event.banner_url} alt={event.title} className="events-card-banner" />
                )}
                <div className="events-card-body">
                  <Badge variant="primary">{event.category}</Badge>
                  <h3>{event.title}</h3>
                  <p className="events-card-meta">{event.location}</p>
                  <p className="events-card-meta">
                    {event.start_time ? new Date(event.start_time).toLocaleString() : "TBA"}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
