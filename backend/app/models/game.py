"""
Game models — Game (per-event game instance) and GameScore.
"""
from datetime import datetime

from app.extensions import db

VALID_GAME_TYPES = (
    "click-frenzy",
    "reaction-test",
    "falling-blocks",
    "memory-number",
    "color-match",
    "whack-a-mole",
    "pattern-memory",
    "balloon-pop",
    "speed-typing",
    "puzzle-slider",
)


class Game(db.Model):
    __tablename__ = "games"
    __table_args__ = (db.UniqueConstraint("event_id", "game_type", name="uq_event_game_type"),)

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)

    game_type = db.Column(db.String(30), nullable=False)
    enabled = db.Column(db.Boolean, default=True)

    scores = db.relationship("GameScore", backref="game", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "game_type": self.game_type,
            "enabled": self.enabled,
        }


class GameScore(db.Model):
    __tablename__ = "game_scores"

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    score = db.Column(db.Integer, nullable=False)
    time_taken = db.Column(db.Integer, nullable=True)

    played_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "game_id": self.game_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "score": self.score,
            "time_taken": self.time_taken,
            "played_at": self.played_at.isoformat() if self.played_at else None,
        }
