import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await adminApi.listAllEvents();
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await adminApi.deleteAnyEvent(eventId);
      showToast("Event deleted", "success");
      loadEvents();
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="admin-page stagger-down">
      <h1>Manage Events</h1>
      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td><Badge variant="primary">{event.category}</Badge></td>
                <td>{event.is_published ? "Yes" : "No"}</td>
                <td className="admin-table-actions">
                  <Link to={`/events/${event.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
