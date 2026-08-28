import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    adminApi
      .listAllEvents()
      .then((res) => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Permanently delete this event and all its data?")) return;
    try {
      await adminApi.deleteAnyEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="page container">
      <div className="dashboard-section-header">
        <div>
          <h1>Manage Events</h1>
          <p className="text-secondary mt-2">{events.length} total events</p>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading events..." />
      ) : (
        <Card>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Organizer</th>
                  <th>Registrations</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <Link to={`/events/${ev.id}`} style={{ fontWeight: 600 }}>
                        {ev.title}
                      </Link>
                    </td>
                    <td className="text-secondary">{ev.organizer_name}</td>
                    <td>
                      {ev.registration_count}/{ev.registration_limit}
                    </td>
                    <td>
                      <Badge variant={ev.is_active ? "success" : "default"}>
                        {ev.is_active ? "Active" : "Ended"}
                      </Badge>
                    </td>
                    <td>
                      <button className="admin-action-danger" onClick={() => handleDelete(ev.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && <p className="text-secondary text-center" style={{ padding: "var(--space-6)" }}>No events found.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}