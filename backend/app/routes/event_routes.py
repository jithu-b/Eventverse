"""
Event routes — list/detail, create/update/delete (with banner upload),
registration, and per-organizer event listing.
"""
import os
import uuid
from datetime import datetime

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from marshmallow import ValidationError

from app.extensions import db
from app.models.event import Event
from app.models.registration import Registration
from app.models.user import User
from app.models.game import Game, VALID_GAME_TYPES
from app.schemas.event_schema import EventCreateSchema, EventUpdateSchema
from app.utils.decorators import jwt_required_custom, role_required, get_current_user, get_current_user_id
from app.services.email_service import send_registration_confirmation_email
from app.services.qr_service import generate_qr_base64, build_qr_payload

event_bp = Blueprint("event", __name__)

create_schema = EventCreateSchema()
update_schema = EventUpdateSchema()

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _parse_datetime(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", ""))
    except ValueError:
        return None


def _save_banner(file_storage):
    if not file_storage or file_storage.filename == "":
        return None
    if not _allowed_file(file_storage.filename):
        return None
    ext = file_storage.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
    banners_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "banners")
    os.makedirs(banners_dir, exist_ok=True)
    filepath = os.path.join(banners_dir, filename)
    file_storage.save(filepath)
    return f"/uploads/banners/{filename}"


def _enabled_games_for_event(event):
    games = Game.query.filter_by(event_id=event.id, enabled=True).all()
    return [{"slug": g.game_type, "name": g.game_type.replace("-", " ").title()} for g in games]


@event_bp.get("")
def list_events():
    current_user_id = get_current_user_id()
    events = Event.query.order_by(Event.start_time.desc().nullslast()).all()
    return jsonify({"events": [e.to_dict(current_user_id) for e in events]}), 200


@event_bp.get("/stats")
def event_stats():
    return jsonify({
        "active_members": User.query.count(),
        "events_hosted": Event.query.count(),
    }), 200


@event_bp.get("/my-registrations")
@jwt_required_custom
def my_registrations():
    user_id = get_current_user_id()
    regs = Registration.query.filter_by(user_id=user_id).order_by(Registration.registered_at.desc()).all()
    return jsonify({"registrations": [r.to_dict() for r in regs]}), 200


@event_bp.get("/organized-by-me")
@jwt_required_custom
@role_required("organizer", "admin")
def organized_by_me():
    user_id = get_current_user_id()
    events = Event.query.filter_by(organizer_id=user_id).order_by(Event.created_at.desc()).all()
    return jsonify({"events": [e.to_dict(user_id) for e in events]}), 200


@event_bp.get("/<int:event_id>")
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    current_user_id = get_current_user_id()
    data = event.to_dict(current_user_id)
    data["enabled_games"] = _enabled_games_for_event(event)
    return jsonify({"event": data}), 200


@event_bp.post("")
@jwt_required_custom
@role_required("organizer", "admin")
def create_event():
    try:
        data = create_schema.load(request.form.to_dict())
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    user = get_current_user()

    event = Event(
        organizer_id=user.id,
        title=data["title"],
        description=data.get("description", ""),
        start_time=_parse_datetime(data.get("start_time")),
        end_time=_parse_datetime(data.get("end_time")),
        registration_limit=data.get("registration_limit", 50),
        quiz_enabled=data.get("quiz_enabled", False),
        games_enabled=data.get("games_enabled", False),
        certificate_enabled=data.get("certificate_enabled", False),
    )

    if "banner" in request.files:
        banner_url = _save_banner(request.files["banner"])
        if banner_url:
            event.banner_url = banner_url

    db.session.add(event)
    db.session.commit()

    if event.games_enabled:
        for game_type in VALID_GAME_TYPES:
            db.session.add(Game(event_id=event.id, game_type=game_type, enabled=True))
        db.session.commit()

    return jsonify({"event": event.to_dict(user.id)}), 201


@event_bp.put("/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def update_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    user = get_current_user()
    if event.organizer_id != user.id and user.role != "admin":
        return jsonify({"error": "You do not have permission to edit this event"}), 403

    try:
        data = update_schema.load(request.form.to_dict())
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    for field in ["title", "description", "registration_limit", "quiz_enabled", "games_enabled", "certificate_enabled"]:
        if field in data:
            setattr(event, field, data[field])

    if "start_time" in data:
        event.start_time = _parse_datetime(data["start_time"])
    if "end_time" in data:
        event.end_time = _parse_datetime(data["end_time"])

    if "banner" in request.files:
        banner_url = _save_banner(request.files["banner"])
        if banner_url:
            event.banner_url = banner_url

    db.session.commit()
    return jsonify({"event": event.to_dict(user.id)}), 200


@event_bp.delete("/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    user = get_current_user()
    if event.organizer_id != user.id and user.role != "admin":
        return jsonify({"error": "You do not have permission to delete this event"}), 403

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"}), 200


@event_bp.post("/<int:event_id>/register")
@jwt_required_custom
def register_for_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    user = get_current_user()

    existing = Registration.query.filter_by(event_id=event_id, user_id=user.id).first()
    if existing:
        return jsonify({"error": "Already registered for this event"}), 409

    if event.registration_count >= event.registration_limit:
        return jsonify({"error": "Event is full"}), 409

    registration = Registration(event_id=event_id, user_id=user.id, status="registered")
    db.session.add(registration)
    db.session.commit()

    send_registration_confirmation_email(user.email, user.name, event.title)

    return jsonify({"registration": registration.to_dict()}), 201


@event_bp.get("/<int:event_id>/qr")
@jwt_required_custom
def get_event_qr(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    user_id = get_current_user_id()
    registration = Registration.query.filter_by(event_id=event_id, user_id=user_id).first()
    if not registration:
        return jsonify({"error": "You must be registered for this event to view its QR code"}), 403

    payload = build_qr_payload(event.id, event.qr_secret)
    qr_image = generate_qr_base64(payload)
    return jsonify({"payload": payload, "qr_image": qr_image}), 200
