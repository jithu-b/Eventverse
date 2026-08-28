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
    adminApi
      .getOverview()
      .then((res) => setStats(res.data))
      .catch(() =>
        setStats({
          total_users: 0,
          total_events: 0,
          total_quizzes: 0,
          total_games_played: 0,
          total_certificates: 0,
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Loading admin overview..." />;

  return (
    <div className="page container">
      <div className="dashboard-header animate-fade-in-up">
        <h1>Admin Dashboard</h1>
        <p>Platform-wide overview and management</p>
      </div>

      <div className="dashboard-stats grid grid-cols-4">
        <StatCard label="Total users" value={stats.total_users} />
        <StatCard label="Total events" value={stats.total_events} />
        <StatCard label="Quizzes run" value={stats.total_quizzes} />
        <StatCard label="Certificates issued" value={stats.total_certificates} />
      </div>

      <div className="section-title mt-6">
        <h2>Manage Platform</h2>
        <p>Jump into any admin area</p>
      </div>

      <div className="grid grid-cols-4 stagger">
        <AdminLinkCard to="/admin/users" title="Users" desc="View, edit roles, deactivate accounts" />
        <AdminLinkCard to="/admin/events" title="Events" desc="Moderate and manage all events" />
        <AdminLinkCard to="/admin/quizzes" title="Quizzes" desc="Review quiz banks and attempts" />
        <AdminLinkCard to="/admin/reports" title="Reports" desc="Platform analytics and exports" />
      </div>
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

function AdminLinkCard({ to, title, desc }) {
  return (
    <Link to={to}>
      <Card hoverable className="glass-accent">
        <Card.Body>
          <h4>{title}</h4>
          <p className="text-secondary mt-2">{desc}</p>
        </Card.Body>
      </Card>
    </Link>
  );
}