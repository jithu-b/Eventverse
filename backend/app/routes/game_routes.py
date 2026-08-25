"""
Game routes — list games for an event, submit scores, personal best, leaderboard.
"""
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.game import Game, GameScore, VALID_GAME_TYPES
from app.utils.decorators import jwt_required_custom, role_required, get_current_user_id
from app.services.scoring_service import upsert_leaderboard_entry

game_bp = Blueprint("game", __name__)


@game_bp.get("/event/<int:event_id>")
def get_games_by_event(event_id):
    games = Game.query.filter_by(event_id=event_id, enabled=True).all()
    return jsonify({"games": [g.to_dict() for g in games]}), 200


@game_bp.post("/event/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def enable_game_for_event(event_id):
    data = request.get_json(force=True) or {}
    game_type = data.get("game_type")

    if game_type not in VALID_GAME_TYPES:
        return jsonify({"error": f"game_type must be one of {', '.join(VALID_GAME_TYPES)}"}), 400

    game = Game.query.filter_by(event_id=event_id, game_type=game_type).first()
    if game:
        game.enabled = True
    else:
        game = Game(event_id=event_id, game_type=game_type, enabled=True)
        db.session.add(game)

    db.session.commit()
    return jsonify({"game": game.to_dict()}), 201


@game_bp.post("/<int:game_id>/score")
@jwt_required_custom
def submit_score(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json(force=True) or {}
    score = data.get("score")
    time_taken = data.get("time_taken")

    if score is None:
        return jsonify({"error": "score is required"}), 400

    user_id = get_current_user_id()

    game_score = GameScore(game_id=game_id, user_id=user_id, score=score, time_taken=time_taken)
    db.session.add(game_score)
    db.session.commit()

    best_for_this_game = (
        GameScore.query.filter_by(game_id=game_id, user_id=user_id)
        .order_by(GameScore.score.desc())
        .first()
    )
    if best_for_this_game:
        upsert_leaderboard_entry(game.event_id, user_id, "game", best_for_this_game.score)

    return jsonify({"score": game_score.to_dict()}), 201


@game_bp.get("/<int:game_id>/my-best")
@jwt_required_custom
def my_personal_best(game_id):
    user_id = get_current_user_id()
    best = (
        GameScore.query.filter_by(game_id=game_id, user_id=user_id)
        .order_by(GameScore.score.desc())
        .first()
    )
    return jsonify({"best_score": best.score if best else None}), 200


@game_bp.get("/<int:game_id>/leaderboard")
def game_leaderboard(game_id):
    game = Game.query.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    subquery_scores = GameScore.query.filter_by(game_id=game_id).all()
    best_per_user = {}
    for s in subquery_scores:
        if s.user_id not in best_per_user or s.score > best_per_user[s.user_id].score:
            best_per_user[s.user_id] = s

    ranked = sorted(best_per_user.values(), key=lambda s: s.score, reverse=True)[:50]
    leaderboard = [{"id": s.user_id, "name": s.user.name, "score": s.score} for s in ranked]

    return jsonify({"leaderboard": leaderboard}), 200
