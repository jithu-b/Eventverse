import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi.js";
import Card from "../../components/ui/Card.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminApi.getOverview();
        setStats(res.data);
      } catch (err) {
        console.error("Admin overview load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <Loader fullScreen />;

  const statCards = [
    { label: "Total Users", value: stats?.total_users },
    { label: "Organizers", value: stats?.total_organizers },
    { label: "Participants", value: stats?.total_participants },
    { label: "Total Events", value: stats?.total_events },
    { label: "Registrations", value: stats?.total_registrations },
    { label: "Attendance Records", value: stats?.total_attendance_records },
    { label: "Certificates Issued", value: stats?.total_certificates_issued },
    { label: "Quiz Attempts", value: stats?.total_quiz_attempts },
  ];

  return (
    <div className="dashboard-page stagger-down">
      <h1 className="dashboard-heading">Admin Overview</h1>

      <div className="dashboard-stats-grid">
        {statCards.map((stat) => (
          <Card key={stat.label} className="dashboard-stat-card">
            <p className="dashboard-stat-value">{stat.value ?? "—"}</p>
            <p className="dashboard-stat-label">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="dashboard-admin-links">
        <Link to="/admin/users" className="dashboard-link-card">Manage Users →</Link>
        <Link to="/admin/events" className="dashboard-link-card">Manage Events →</Link>
        <Link to="/admin/quizzes" className="dashboard-link-card">Manage Quizzes →</Link>
        <Link to="/admin/reports" className="dashboard-link-card">View Reports →</Link>
      </div>
    </div>
  );
}
