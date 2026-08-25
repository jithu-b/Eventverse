import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventApi } from "../../api/eventApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Dashboard.css";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const regRes = await eventApi.myRegistrations();
        setRegistrations(regRes.data.registrations || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="dashboard-page stagger-down">
      <h1 className="dashboard-heading">Welcome back, {user?.name || "there"} 👋</h1>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>My Registered Events</h2>
          <Link to="/events" className="dashboard-link">Browse more events →</Link>
        </div>

        {registrations.length === 0 ? (
          <Card className="dashboard-empty-card">
            <p>You haven't registered for any events yet.</p>
          </Card>
        ) : (
          <div className="dashboard-grid">
            {registrations.map((event) => (
              <Card key={event.id} className="dashboard-event-card">
                <h3>{event.title}</h3>
                <p className="dashboard-event-meta">{event.location}</p>
                <Badge variant="primary">{event.category}</Badge>
                <Link to={`/events/${event.id}`} className="dashboard-card-link">View details →</Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
