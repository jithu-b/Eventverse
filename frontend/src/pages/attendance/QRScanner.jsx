import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { attendanceApi } from "../../api/attendanceApi.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import "./Attendance.css";

export default function QRScanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const eventId = location.state?.eventId || "";
  const [form, setForm] = useState({ eventId, code: "", userId: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await attendanceApi.checkIn(form.eventId, form.code);
      showToast("Checked in successfully!", "success");
      navigate("/attendance/success");
    } catch (err) {
      showToast(err.response?.data?.error || "Check-in failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="attendance-page stagger-down">
      <Card className="attendance-card">
        <h1>Event Check-In</h1>
        <p className="attendance-sub">
          Enter (or scan) the event's QR code to check in.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Event ID"
            name="eventId"
            value={form.eventId}
            onChange={handleChange}
            required
          />
          <Input
            label="QR Code Value"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Paste scanned QR value here"
            required
          />
          <Button type="submit" variant="primary" size="lg" loading={submitting} className="attendance-submit">
            Check In
          </Button>
        </form>
      </Card>
    </div>
  );
}
