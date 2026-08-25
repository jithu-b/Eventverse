"""
Certificate model — tracks generated PDF certificates for event participants.
"""
from datetime import datetime

from app.extensions import db


class Certificate(db.Model):
    __tablename__ = "certificates"
    __table_args__ = (db.UniqueConstraint("event_id", "user_id", name="uq_event_user_certificate"),)

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    file_path = db.Column(db.String(300), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "event_title": self.event.title if self.event else None,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "file_path": self.file_path,
            "issued_at": self.issued_at.isoformat() if self.issued_at else None,
        }

    def __repr__(self) -> str:
        return f"<Certificate event={self.event_id} user={self.user_id}>"
