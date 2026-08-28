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
    subtitle = db.Column(db.String(300), nullable=True)
    description = db.Column(db.Text, nullable=True)
    detailed_about = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(30), default="upcoming")
    featured = db.Column(db.Boolean, default=False)

    banner_url = db.Column(db.String(300), nullable=True)
    thumbnail_url = db.Column(db.String(300), nullable=True)

    location = db.Column(db.String(200), nullable=True)
    location_details = db.Column(db.String(300), nullable=True)

    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)

    registration_limit = db.Column(db.Integer, default=50)

    speakers = db.Column(db.JSON, default=list)
    what_you_will_learn = db.Column(db.JSON, default=list)
    prerequisites = db.Column(db.JSON, default=list)
    schedule = db.Column(db.JSON, default=list)
    tags = db.Column(db.JSON, default=list)

    organizer_role = db.Column(db.String(100), nullable=True)
    organizer_avatar = db.Column(db.String(300), nullable=True)

    quiz_enabled = db.Column(db.Boolean, default=False)
    games_enabled = db.Column(db.Boolean, default=False)
    certificate_enabled = db.Column(db.Boolean, default=False)

    qr_secret = db.Column(db.String(64), unique=True, nullable=False, default=lambda: secrets.token_hex(16))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    registrations = db.relationship("Registration", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    attendances = db.relationship("Attendance", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    quizzes = db.relationship("Quiz", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    games = db.relationship("Game", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    certificates = db.relationship("Certificate", backref="event", lazy="dynamic", cascade="all, delete-orphan")
    photos = db.relationship("Photo", backref="event", lazy="dynamic", cascade="all, delete-orphan")

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
            "organizer_role": self.organizer_role,
            "organizer_avatar": self.organizer_avatar,
            "organizer_email": self.organizer.email if self.organizer else None,
            "title": self.title,
            "subtitle": self.subtitle,
            "description": self.description,
            "detailed_about": self.detailed_about,
            "category": self.category,
            "status": self.status,
            "featured": self.featured,
            "banner_url": self.banner_url,
            "thumbnail_url": self.thumbnail_url or self.banner_url,
            "location": self.location,
            "location_details": self.location_details,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "registration_limit": self.registration_limit,
            "registration_count": self.registration_count,
            "speakers": self.speakers or [],
            "what_you_will_learn": self.what_you_will_learn or [],
            "prerequisites": self.prerequisites or [],
            "schedule": self.schedule or [],
            "tags": self.tags or [],
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
