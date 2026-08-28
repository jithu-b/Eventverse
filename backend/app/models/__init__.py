"""
Aggregates all SQLAlchemy models so that:
  - `db.create_all()` in the app factory sees every table
  - other modules can do `from app.models import User, Event, ...`
"""
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration
from app.models.attendance import Attendance
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.game import Game, GameScore
from app.models.leaderboard import LeaderboardEntry
from app.models.certificate import Certificate
from app.models.photo import Photo
from app.models.execom import ExecomMember
from app.models.execom import ExecomMember

__all__ = [
    "User",
    "Event",
    "Registration",
    "Attendance",
    "Quiz",
    "QuizQuestion",
    "QuizAttempt",
    "Game",
    "GameScore",
    "LeaderboardEntry",
    "Certificate",
    "Photo",
    "ExecomMember",
]