"""
Attendance model — records QR/manual check-ins for an event.
"""
from datetime import datetime

from app.extensions import db


class Attendance(db.Model):
    __tablename__ = "attendance"
    __table_args__ = (db.UniqueConstraint("event_id", "user_id", name="uq_event_user_attendance"),)

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    checked_in_at = db.Column(db.DateTime, default=datetime.utcnow)

    method = db.Column(db.String(10), default="qr")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "method": self.method,
            "checked_in_at": self.checked_in_at.isoformat() if self.checked_in_at else None,
        }

    def __repr__(self) -> str:
        return f"<Attendance event={self.event_id} user={self.user_id}>"
