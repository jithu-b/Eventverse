import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

const ROLES = ["admin", "organizer", "participant"];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    adminApi
      .listUsers()
      .then((res) => setUsers(res.data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      /* silently ignore, could add toast here */
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm("Deactivate this user? They will lose access.")) return;
    try {
      await adminApi.deactivateUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      /* ignore */
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page container">
      <div className="dashboard-section-header">
        <div>
          <h1>Manage Users</h1>
          <p className="text-secondary mt-2">{users.length} total users</p>
        </div>
        <div style={{ width: 280 }}>
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading users..." />
      ) : (
        <Card>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td className="text-secondary">{u.email}</td>
                    <td>
                      <select
                        className="admin-role-select"
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-secondary">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="admin-action-danger" onClick={() => handleDeactivate(u.id)}>
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-secondary text-center" style={{ padding: "var(--space-6)" }}>No users found.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}