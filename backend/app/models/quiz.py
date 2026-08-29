"""
Quiz models — Quiz, QuizQuestion, QuizAttempt.
"""
import json
import random
from datetime import datetime

from app.extensions import db


class Quiz(db.Model):
    __tablename__ = "quizzes"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)

    title = db.Column(db.String(200), nullable=False)
    duration_minutes = db.Column(db.Integer, default=10)
    shuffle_questions = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    questions = db.relationship("QuizQuestion", backref="quiz", lazy="dynamic", cascade="all, delete-orphan")
    attempts = db.relationship("QuizAttempt", backref="quiz", lazy="dynamic", cascade="all, delete-orphan")

    @property
    def question_count(self) -> int:
        return self.questions.count()

    @property
    def attempt_count(self) -> int:
        return self.attempts.count()

    def get_randomized_questions(self):
        qs = list(self.questions)
        if self.shuffle_questions:
            random.shuffle(qs)
        return qs

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "event_id": self.event_id,
            "event_title": self.event.title if self.event else None,
            "title": self.title,
            "duration_minutes": self.duration_minutes,
            "shuffle_questions": self.shuffle_questions,
            "question_count": self.question_count,
            "attempt_count": self.attempt_count,
        }


class QuizQuestion(db.Model):
    __tablename__ = "quiz_questions"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)

    question_text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(300), nullable=False)
    option_b = db.Column(db.String(300), nullable=False)
    option_c = db.Column(db.String(300), nullable=True)
    option_d = db.Column(db.String(300), nullable=True)

    # 'a' | 'b' | 'c' | 'd'
    correct_option = db.Column(db.String(1), nullable=False)
    points = db.Column(db.Integer, default=10)

    def to_dict(self, include_answer: bool = False) -> dict:
        data = {
            "id": self.id,
            "quiz_id": self.quiz_id,
            "question_text": self.question_text,
            "option_a": self.option_a,
            "option_b": self.option_b,
            "option_c": self.option_c,
            "option_d": self.option_d,
            "points": self.points,
        }
        if include_answer:
            data["correct_option"] = self.correct_option
        return data


class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    score = db.Column(db.Integer, default=0)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    submitted_at = db.Column(db.DateTime, nullable=True)

    # JSON-encoded { question_id: chosen_option }
    answers_json = db.Column(db.Text, default="{}")

    @property
    def answers(self) -> dict:
        try:
            return json.loads(self.answers_json)
        except (TypeError, ValueError):
            return {}

    @answers.setter
    def answers(self, value: dict):
        self.answers_json = json.dumps(value)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "quiz_id": self.quiz_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else None,
            "score": self.score,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
        }