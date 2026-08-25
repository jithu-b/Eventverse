import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

export default function Reports() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await adminApi.getReports();
        setRows(res.data.rows || []);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await adminApi.exportReport("events");
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "eventverse_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast("Export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="admin-page stagger-down">
      <div className="admin-page-header">
        <h1>Reports</h1>
        <Button variant="secondary" onClick={handleExport} loading={exporting}>
          Export CSV
        </Button>
      </div>

      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Registrations</th>
              <th>Attendance</th>
              <th>Attendance %</th>
              <th>Certificates</th>
              <th>Quiz Attempts</th>
              <th>Avg Quiz Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.event_id}>
                <td>{row.event_title}</td>
                <td>{row.registrations}</td>
                <td>{row.attendance}</td>
                <td>{row.attendance_rate_pct}%</td>
                <td>{row.certificates_issued}</td>
                <td>{row.quiz_attempts}</td>
                <td>{row.average_quiz_score ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
