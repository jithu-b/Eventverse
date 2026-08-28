import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { eventApi } from "../../api/eventApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Dashboard.css";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi
      .myRegistrations()
      .then((res) => setRegistrations(res.data.registrations || []))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = registrations.filter((r) => r.status !== "attended");
  const attended = registrations.filter((r) => r.status === "attended");

  return (
    <div className="page container">
      <div className="dashboard-header animate-fade-in-up">
        <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p>Here's what's happening with your events.</p>
      </div>

      <div className="dashboard-stats grid grid-cols-3 mt-5">
        <StatCard label="Registered events" value={registrations.length} />
        <StatCard label="Upcoming" value={upcoming.length} />
        <StatCard label="Attended" value={attended.length} />
      </div>

      <div className="section-title mt-6">
        <h2>My Events</h2>
        <p>Events you've registered for</p>
      </div>

      {loading ? (
        <Loader fullScreen={false} label="Loading your events..." />
      ) : registrations.length === 0 ? (
        <Card className="dashboard-empty">
          <Card.Body>
            <p>You haven't registered for any events yet.</p>
            <Link to="/events" className="btn btn-primary mt-4">
              Browse events
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-3 stagger">
          {registrations.map((reg) => (
            <Card key={reg.id} hoverable>
              <Card.Body>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant={reg.status === "attended" ? "success" : "brand"}>
                    {reg.status}
                  </Badge>
                </div>
                <h4>{reg.event_title}</h4>
                <p className="text-secondary mt-2">{reg.event_date}</p>
              </Card.Body>
              <Card.Footer>
                <Link to={`/events/${reg.event_id}`} className="btn btn-outline btn-sm w-full">
                  View event
                </Link>
              </Card.Footer>
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