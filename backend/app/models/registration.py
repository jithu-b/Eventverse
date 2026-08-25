"""
Registration model — links a user to an event they've signed up for.
"""
from datetime import datetime

from app.extensions import db


class Registration(db.Model):
    __tablename__ = "registrations"
    __table_args__ = (db.UniqueConstraint("event_id", "user_id", name="uq_event_user_registration"),)

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    status = db.Column(db.String(20), default="registered")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "event_title": self.event.title if self.event else None,
            "event_date": self.event.start_time.isoformat() if self.event and self.event.start_time else None,
            "user_id": self.user_id,
            "status": self.status,
            "registered_at": self.registered_at.isoformat() if self.registered_at else None,
        }

    def __repr__(self) -> str:
        return f"<Registration event={self.event_id} user={self.user_id}>"
