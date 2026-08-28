import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import "./Admin.css";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    adminApi
      .getReports()
      .then((res) => setReport(res.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async (type) => {
    setExporting(true);
    try {
      const res = await adminApi.exportReport(type);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `eventverse-${type}-report.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loader fullScreen label="Compiling reports..." />;
  if (!report) {
    return (
      <div className="page container">
        <div className="events-empty glass-panel">No report data available.</div>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="dashboard-section-header">
        <div>
          <h1>Reports</h1>
          <p className="text-secondary mt-2">Platform-wide analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-4 stagger">
        <ReportStat label="Total events" value={report.total_events} />
        <ReportStat label="Total participants" value={report.total_participants} />
        <ReportStat label="Quiz attempts" value={report.total_quiz_attempts} />
        <ReportStat label="Certificates issued" value={report.total_certificates} />
      </div>

      <div className="section-title mt-6">
        <h2>Export Data</h2>
        <p>Download CSV reports for offline analysis</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => handleExport("users")} loading={exporting}>
          Export Users
        </Button>
        <Button variant="outline" onClick={() => handleExport("events")} loading={exporting}>
          Export Events
        </Button>
        <Button variant="outline" onClick={() => handleExport("attendance")} loading={exporting}>
          Export Attendance
        </Button>
      </div>

      {report.top_events && (
        <>
          <div className="section-title mt-6">
            <h2>Top Events by Registrations</h2>
          </div>
          <Card>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Registrations</th>
                    <th>Attendance rate</th>
                  </tr>
                </thead>
                <tbody>
                  {report.top_events.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 600 }}>{e.title}</td>
                      <td>{e.registration_count}</td>
                      <td>{e.attendance_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function ReportStat({ label, value }) {
  return (
    <div className="stat-card glass-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}