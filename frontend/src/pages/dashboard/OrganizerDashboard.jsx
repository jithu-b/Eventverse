import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { eventApi } from "../../api/eventApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Dashboard.css";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi
      .organizedByMe()
      .then((res) => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registration_count || 0), 0);
  const activeEvents = events.filter((e) => e.is_active).length;

  return (
    <div className="page container stagger-down">
      <div className="dashboard-section-header animate-fade-in-up">
        <div>
          <h1>Organizer Dashboard</h1>
          <p className="text-secondary mt-2">Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>
        <Link to="/events/new">
          <Button icon={<PlusIcon />}>New Event</Button>
        </Link>
      </div>

      <div className="dashboard-stats grid grid-cols-3">
        <StatCard label="Total events" value={events.length} />
        <StatCard label="Active now" value={activeEvents} />
        <StatCard label="Total registrations" value={totalRegistrations} />
      </div>

      <div className="section-title mt-6">
        <h2>Your Events</h2>
        <p>Manage schedules, quizzes, and attendance</p>
      </div>

      {loading ? (
        <Loader label="Loading your events..." />
      ) : events.length === 0 ? (
        <Card className="dashboard-empty">
            <p>You haven't created any events yet.</p>
            <Link to="/events/new" className="btn btn-primary mt-4">
              Create your first event
            </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-3 stagger">
          {events.map((ev) => (
            <Card key={ev.id} hoverable>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant={ev.is_active ? "success" : "default"}>
                    {ev.is_active ? "Active" : "Ended"}
                  </Badge>
                  <span className="text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
                    {ev.registration_count}/{ev.registration_limit} registered
                  </span>
                </div>
                <h4>{ev.title}</h4>
                <p className="text-secondary mt-2">{ev.start_time}</p>
                <Link to={`/events/${ev.id}/edit`} className="btn btn-outline btn-sm">
                  Edit
                </Link>
                <Link to={`/events/${ev.id}/scan`} className="btn btn-primary btn-sm">
                  Scan attendance
                </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card glass-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}