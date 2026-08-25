"""
Quiz routes — CRUD for quizzes/questions, timed attempts, auto-scoring, leaderboard.
"""
from datetime import datetime

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.event import Event
from app.models.user import User
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.schemas.quiz_schema import (
    QuizCreateSchema,
    QuizUpdateSchema,
    QuestionCreateSchema,
    QuestionUpdateSchema,
    SubmitAnswersSchema,
)
from app.utils.decorators import jwt_required_custom, role_required, get_current_user_id
from app.services.scoring_service import score_quiz_attempt, upsert_leaderboard_entry, get_leaderboard

quiz_bp = Blueprint("quiz", __name__)

quiz_create_schema = QuizCreateSchema()
quiz_update_schema = QuizUpdateSchema()
question_create_schema = QuestionCreateSchema()
question_update_schema = QuestionUpdateSchema()
submit_schema = SubmitAnswersSchema()


@quiz_bp.get("/event/<int:event_id>")
def get_quiz_by_event(event_id):
    quiz = Quiz.query.filter_by(event_id=event_id).first()
    if not quiz:
        return jsonify({"error": "No quiz found for this event"}), 404
    return jsonify({"quiz": quiz.to_dict()}), 200


@quiz_bp.post("/event/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def create_quiz(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    try:
        data = quiz_create_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    quiz = Quiz(event_id=event_id, **data)
    db.session.add(quiz)
    event.quiz_enabled = True
    db.session.commit()

    return jsonify({"quiz": quiz.to_dict()}), 201


@quiz_bp.put("/<int:quiz_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def update_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    try:
        data = quiz_update_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    for field, value in data.items():
        setattr(quiz, field, value)
    db.session.commit()

    return jsonify({"quiz": quiz.to_dict()}), 200


@quiz_bp.delete("/<int:quiz_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def delete_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    db.session.delete(quiz)
    db.session.commit()
    return jsonify({"message": "Quiz deleted"}), 200


@quiz_bp.get("/<int:quiz_id>/questions")
@jwt_required_custom
@role_required("organizer", "admin")
def list_questions(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    questions = [q.to_dict(include_answer=True) for q in quiz.questions]
    return jsonify({"questions": questions}), 200


@quiz_bp.post("/<int:quiz_id>/questions")
@jwt_required_custom
@role_required("organizer", "admin")
def add_question(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    try:
        data = question_create_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    question = QuizQuestion(quiz_id=quiz_id, **data)
    db.session.add(question)
    db.session.commit()

    return jsonify({"question": question.to_dict(include_answer=True)}), 201


@quiz_bp.put("/questions/<int:question_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def update_question(question_id):
    question = QuizQuestion.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    try:
        data = question_update_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    for field, value in data.items():
        setattr(question, field, value)
    db.session.commit()

    return jsonify({"question": question.to_dict(include_answer=True)}), 200


@quiz_bp.delete("/questions/<int:question_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def delete_question(question_id):
    question = QuizQuestion.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404
    db.session.delete(question)
    db.session.commit()
    return jsonify({"message": "Question deleted"}), 200


@quiz_bp.post("/<int:quiz_id>/start")
@jwt_required_custom
def start_attempt(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    user_id = get_current_user_id()

    attempt = QuizAttempt(quiz_id=quiz_id, user_id=user_id, started_at=datetime.utcnow())
    db.session.add(attempt)
    db.session.commit()

    questions = quiz.get_randomized_questions()
    return jsonify({
        "attempt_id": attempt.id,
        "duration_minutes": quiz.duration_minutes,
        "quiz_title": quiz.title,
        "questions": [q.to_dict(include_answer=False) for q in questions],
    }), 201


@quiz_bp.post("/attempts/<int:attempt_id>/submit")
@jwt_required_custom
def submit_attempt(attempt_id):
    attempt = QuizAttempt.query.get(attempt_id)
    if not attempt:
        return jsonify({"error": "Attempt not found"}), 404

    user_id = get_current_user_id()
    if attempt.user_id != user_id:
        return jsonify({"error": "This attempt does not belong to you"}), 403

    if attempt.submitted_at:
        return jsonify({"error": "This attempt has already been submitted"}), 409

    try:
        data = submit_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    result = score_quiz_attempt(attempt.quiz, data["answers"])

    attempt.answers = data["answers"]
    attempt.score = result["score"]
    attempt.submitted_at = datetime.utcnow()
    db.session.commit()

    upsert_leaderboard_entry(attempt.quiz.event_id, user_id, "quiz", result["score"])

    return jsonify(result), 200


@quiz_bp.get("/attempts/<int:attempt_id>")
@jwt_required_custom
def get_attempt_results(attempt_id):
    attempt = QuizAttempt.query.get(attempt_id)
    if not attempt:
        return jsonify({"error": "Attempt not found"}), 404

    user_id = get_current_user_id()
    if attempt.user_id != user_id:
        return jsonify({"error": "This attempt does not belong to you"}), 403

    result = score_quiz_attempt(attempt.quiz, attempt.answers)
    return jsonify(result), 200


@quiz_bp.get("/<int:quiz_id>/leaderboard")
def quiz_leaderboard(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    entries = get_leaderboard(quiz.event_id, "quiz")
    leaderboard = [{"id": e.user_id, "name": e.user.name if e.user else "Unknown", "score": e.score} for e in entries]
    return jsonify({"leaderboard": leaderboard}), 200
