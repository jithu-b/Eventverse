"""
User model — handles authentication, roles, and password reset.
"""
import uuid
from datetime import datetime, timedelta

from app.extensions import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    # admin | organizer | participant
    role = db.Column(db.String(20), nullable=False, default="participant")

    reset_token = db.Column(db.String(64), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ---- relationships ----
    events_organized = db.relationship(
        "Event", backref="organizer", lazy="dynamic", foreign_keys="Event.organizer_id"
    )
    registrations = db.relationship("Registration", backref="user", lazy="dynamic")
    attendances = db.relationship("Attendance", backref="user", lazy="dynamic")
    quiz_attempts = db.relationship("QuizAttempt", backref="user", lazy="dynamic")
    game_scores = db.relationship("GameScore", backref="user", lazy="dynamic")
    certificates = db.relationship("Certificate", backref="user", lazy="dynamic")
    leaderboard_entries = db.relationship("LeaderboardEntry", backref="user", lazy="dynamic")

    VALID_ROLES = ("admin", "organizer", "participant")

    # ---- password helpers ----
    def set_password(self, raw_password: str) -> None:
        self.password_hash = bcrypt.generate_password_hash(raw_password).decode("utf-8")

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, raw_password)

    # ---- password reset token helpers ----
    def generate_reset_token(self, expires_in_minutes: int = 30) -> str:
        self.reset_token = uuid.uuid4().hex
        self.reset_token_expiry = datetime.utcnow() + timedelta(minutes=expires_in_minutes)
        return self.reset_token

    def is_reset_token_valid(self, token: str) -> bool:
        return (
            self.reset_token is not None
            and self.reset_token == token
            and self.reset_token_expiry is not None
            and self.reset_token_expiry > datetime.utcnow()
        )

    def clear_reset_token(self) -> None:
        self.reset_token = None
        self.reset_token_expiry = None

    # ---- serialization ----
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"