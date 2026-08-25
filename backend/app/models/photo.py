"""
Photo model — a single gallery photo attached to an event.
"""
from datetime import datetime

from app.extensions import db


class Photo(db.Model):
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    photo_url = db.Column(db.String(300), nullable=False)
    caption = db.Column(db.String(200), nullable=True)

    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "event_title": self.event.title if self.event else None,
            "photo_url": self.photo_url,
            "caption": self.caption,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
        }

    def __repr__(self) -> str:
        return f"<Photo event={self.event_id} id={self.id}>"
