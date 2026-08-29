"""
LeaderboardEntry model — optional materialized aggregate table.

In practice, most leaderboards (quiz/game/event) are computed on-the-fly
via queries in leaderboard_routes.py / scoring_service.py for correctness
and simplicity with SQLite. This table exists for the "overall" leaderboard,
which aggregates quiz + game performance per event and benefits from being
persisted/recomputed rather than joined live across many tables.
"""
from datetime import datetime

from app.extensions import db

VALID_CATEGORIES = ("quiz", "game", "overall")


class LeaderboardEntry(db.Model):
    __tablename__ = "leaderboard_entries"
    __table_args__ = (
        db.UniqueConstraint("event_id", "user_id", "category", name="uq_event_user_category"),
    )

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    category = db.Column(db.String(10), nullable=False)  # quiz | game | overall
    score = db.Column(db.Integer, default=0)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "name": self.user.name if self.user else None,
            "category": self.category,
            "score": self.score,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }