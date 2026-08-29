"""
Event model — core event entity with schedule, banner, and feature toggles.
"""
import secrets
from datetime import datetime

from app.extensions import db


class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    banner_url = db.Column(db.String(300), nullable=True)

    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)

    registration_limit = db.Column(db.Integer, default=50)

    quiz_enabled = db.Column(db.Boolean, default=False)
    games_enabled = db.Column(db.Boolean, default=False)
    certificate_enabled = db.Column(db.Boolean, default=False)

    # unique secret embedded in the event's QR code for registration/attendance
    qr_secret = db.Column(db.String(64), unique=True, nullable=False, default=lambda: secrets.token_hex(16))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ---- relationships ----
    registrations = db.relationship("Registration", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    attendances = db.relationship("Attendance", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    quizzes = db.relationship("Quiz", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    games = db.relationship("Game", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    certificates = db.relationship("Certificate", backref="event", lazy="dynamic", cascade="all, delete-orphan")

    @property
    def registration_count(self) -> int:
        return self.registrations.count()

    @property
    def is_active(self) -> bool:
        if not self.end_time:
            return True
        return datetime.utcnow() <= self.end_time

    def to_dict(self, current_user_id=None) -> dict:
        data = {
            "id": self.id,
            "organizer_id": self.organizer_id,
            "organizer_name": self.organizer.name if self.organizer else None,
            "title": self.title,
            "description": self.description,
            "banner_url": self.banner_url,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "registration_limit": self.registration_limit,
            "registration_count": self.registration_count,
            "quiz_enabled": self.quiz_enabled,
            "games_enabled": self.games_enabled,
            "certificate_enabled": self.certificate_enabled,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if current_user_id:
            data["is_registered"] = self.registrations.filter_by(user_id=current_user_id).count() > 0
            data["qr_secret"] = self.qr_secret if data["is_registered"] else None
        return data

    def __repr__(self) -> str:
        return f"<Event {self.title}>"