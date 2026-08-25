"""
Leaderboard routes — event, quiz, game, and overall rankings.
"""
from flask import Blueprint, jsonify

from app.models.quiz import Quiz
from app.models.game import Game
from app.services.scoring_service import get_leaderboard

leaderboard_bp = Blueprint("leaderboard", __name__)


def _format_entries(entries):
    return [{"id": e.user_id, "name": e.user.name if e.user else "Unknown", "score": e.score} for e in entries]


@leaderboard_bp.get("/event/<int:event_id>")
def event_leaderboard(event_id):
    entries = get_leaderboard(event_id, "overall")
    return jsonify({"leaderboard": _format_entries(entries)}), 200


@leaderboard_bp.get("/quiz/<int:quiz_id>")
def quiz_leaderboard_route(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    entries = get_leaderboard(quiz.event_id, "quiz")
    return jsonify({"leaderboard": _format_entries(entries)}), 200


@leaderboard_bp.get("/game/<int:game_id>")
def game_leaderboard_route(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    entries = get_leaderboard(game.event_id, "game")
    return jsonify({"leaderboard": _format_entries(entries)}), 200


@leaderboard_bp.get("/overall/<int:event_id>")
def overall_leaderboard(event_id):
    entries = get_leaderboard(event_id, "overall")
    return jsonify({"leaderboard": _format_entries(entries)}), 200
