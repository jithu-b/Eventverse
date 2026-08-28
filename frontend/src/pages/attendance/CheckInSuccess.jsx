import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card.jsx";
import "./Attendance.css";

export default function CheckInSuccess() {
  const { id: eventId } = useParams();

  return (
    <div className="page container checkin-success-page">
      <Card className="quiz-results-card animate-scale-in">
        <Card.Body className="text-center">
          <div className="checkin-success-icon">
            <CheckIcon />
          </div>
          <h2>You're checked in!</h2>
          <p className="text-secondary mt-2">
            Your attendance has been recorded. Enjoy the event!
          </p>
          <Link to={`/events/${eventId}`} className="btn btn-primary mt-5">
            Back to Event
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}