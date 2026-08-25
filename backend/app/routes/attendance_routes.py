"""
Attendance routes — QR check-in, manual check-in, and per-event attendance list.
"""
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.event import Event
from app.models.registration import Registration
from app.models.attendance import Attendance
from app.utils.decorators import jwt_required_custom, role_required
from app.services.qr_service import verify_qr_code

attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.post("/event/<int:event_id>/check-in")
@jwt_required_custom
@role_required("organizer", "admin")
def check_in(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    body = request.get_json(force=True) or {}
    code = body.get("code", "")
    if not verify_qr_code(code, event):
        return jsonify({"error": "Invalid or expired QR code"}), 400

    payload_user_id = body.get("user_id")
    if not payload_user_id:
        return jsonify({"error": "Missing participant identifier in scan payload"}), 400

    registration = Registration.query.filter_by(event_id=event_id, user_id=payload_user_id).first()
    if not registration:
        return jsonify({"error": "This user is not registered for the event"}), 404

    existing = Attendance.query.filter_by(event_id=event_id, user_id=payload_user_id).first()
    if existing:
        return jsonify({"error": "Already checked in"}), 409

    attendance = Attendance(event_id=event_id, user_id=payload_user_id, method="qr")
    db.session.add(attendance)
    registration.status = "attended"
    db.session.commit()

    return jsonify(attendance.to_dict()), 201


@attendance_bp.get("/event/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def get_event_attendance(event_id):
    records = Attendance.query.filter_by(event_id=event_id).order_by(Attendance.checked_in_at.desc()).all()
    return jsonify({"attendance": [a.to_dict() for a in records]}), 200


@attendance_bp.post("/event/<int:event_id>/manual")
@jwt_required_custom
@role_required("organizer", "admin")
def manual_check_in(event_id):
    data = request.get_json(force=True) or {}
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    registration = Registration.query.filter_by(event_id=event_id, user_id=user_id).first()
    if not registration:
        return jsonify({"error": "This user is not registered for the event"}), 404

    existing = Attendance.query.filter_by(event_id=event_id, user_id=user_id).first()
    if existing:
        return jsonify({"error": "Already checked in"}), 409

    attendance = Attendance(event_id=event_id, user_id=user_id, method="manual")
    db.session.add(attendance)
    registration.status = "attended"
    db.session.commit()

    return jsonify(attendance.to_dict()), 201
