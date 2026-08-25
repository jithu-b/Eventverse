import { Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./Attendance.css";

export default function CheckInSuccess() {
  return (
    <div className="attendance-page stagger-down">
      <Card className="attendance-card attendance-success-card">
        <div className="attendance-success-icon">✅</div>
        <h1>You're checked in!</h1>
        <p className="attendance-sub">Enjoy the event. Your attendance has been recorded.</p>
        <Link to="/events">
          <Button variant="primary">Back to Events</Button>
        </Link>
      </Card>
    </div>
  );
}
