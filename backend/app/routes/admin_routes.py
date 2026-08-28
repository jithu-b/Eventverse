"""
Admin routes — platform overview, user/event/quiz management, and reports.
All routes require the admin role.
"""
import csv
import io
from datetime import datetime

from flask import Blueprint, request, jsonify, Response

from app.extensions import db
from app.models.user import User
from app.models.event import Event
from app.models.quiz import Quiz, QuizAttempt
from app.models.attendance import Attendance
from app.models.certificate import Certificate
from app.models.registration import Registration
from app.utils.decorators import jwt_required_custom, role_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/overview")
@jwt_required_custom
@role_required("admin")
def overview():
    total_users = User.query.count()
    total_registrations = Registration.query.count()
    total_attendance = Attendance.query.count()
    attendance_rate = round((total_attendance / total_registrations * 100), 1) if total_registrations else 0.0
    return jsonify({
        "total_users": total_users,
        "total_events": Event.query.count(),
        "total_quizzes": Quiz.query.count(),
        "total_registrations": total_registrations,
        "attendance_rate": attendance_rate,
        "total_games_played": 0,  # see reports for a full breakdown by game
        "total_certificates": Certificate.query.count(),
    }), 200


@admin_bp.get("/activity")
@jwt_required_custom
@role_required("admin")
def recent_activity():
    items = []
    for r in Registration.query.order_by(Registration.registered_at.desc()).limit(15).all():
        if r.user and r.event and r.registered_at:
            items.append({"id": f"reg-{r.id}", "user": r.user.name, "action": "registered for",
                           "target": r.event.title, "timestamp": r.registered_at, "type": "registration"})
    for a in Attendance.query.order_by(Attendance.checked_in_at.desc()).limit(15).all():
        if a.user and a.event and a.checked_in_at:
            items.append({"id": f"att-{a.id}", "user": a.user.name, "action": "scanned QR attendance for",
                           "target": a.event.title, "timestamp": a.checked_in_at, "type": "attendance"})
    for qa in QuizAttempt.query.filter(QuizAttempt.submitted_at.isnot(None)).order_by(QuizAttempt.submitted_at.desc()).limit(15).all():
        if qa.user and qa.quiz and qa.submitted_at:
            items.append({"id": f"quiz-{qa.id}", "user": qa.user.name, "action": f"scored {qa.score}% on",
                           "target": qa.quiz.title, "timestamp": qa.submitted_at, "type": "quiz"})
    for c in Certificate.query.order_by(Certificate.issued_at.desc()).limit(15).all():
        if c.user and c.event and c.issued_at:
            items.append({"id": f"cert-{c.id}", "user": c.user.name, "action": "earned a certificate for",
                           "target": c.event.title, "timestamp": c.issued_at, "type": "certificate"})
    for e in Event.query.order_by(Event.created_at.desc()).limit(10).all():
        if e.created_at:
            items.append({"id": f"evt-{e.id}", "user": (e.organizer.name if e.organizer else "Organizer"),
                           "action": "published new event", "target": e.title, "timestamp": e.created_at,
                           "type": "event_created"})
    items.sort(key=lambda x: x["timestamp"], reverse=True)
    items = items[:15]

    def humanize(dt):
        seconds = (datetime.utcnow() - dt).total_seconds()
        if seconds < 60:
            return "Just now"
        minutes = int(seconds // 60)
        if minutes < 60:
            return f"{minutes} min{'s' if minutes != 1 else ''} ago"
        hours = int(minutes // 60)
        if hours < 24:
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        days = int(hours // 24)
        return f"{days} day{'s' if days != 1 else ''} ago"

    result = [{
        "id": it["id"], "user": it["user"],
        "userAvatar": f"https://ui-avatars.com/api/?name={it['user'].replace(' ', '+')}&background=EC4899&color=fff",
        "action": it["action"], "target": it["target"], "timestamp": humanize(it["timestamp"]), "type": it["type"],
    } for it in items]

    return jsonify({"activities": result}), 200


@admin_bp.get("/users")
@jwt_required_custom
@role_required("admin")
def list_users():
    search = request.args.get("search", "")
    query = User.query
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    users = query.order_by(User.created_at.desc()).all()
    return jsonify({"users": [u.to_dict() for u in users]}), 200


@admin_bp.put("/users/<int:user_id>/role")
@jwt_required_custom
@role_required("admin")
def update_user_role(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_role = (request.get_json(force=True) or {}).get("role")
    if new_role not in User.VALID_ROLES:
        return jsonify({"error": f"Role must be one of {', '.join(User.VALID_ROLES)}"}), 400

    user.role = new_role
    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@admin_bp.delete("/users/<int:user_id>")
@jwt_required_custom
@role_required("admin")
def deactivate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User removed"}), 200


@admin_bp.get("/events")
@jwt_required_custom
@role_required("admin")
def list_all_events():
    events = Event.query.order_by(Event.created_at.desc()).all()
    return jsonify({"events": [e.to_dict() for e in events]}), 200


@admin_bp.delete("/events/<int:event_id>")
@jwt_required_custom
@role_required("admin")
def delete_any_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"}), 200


@admin_bp.get("/quizzes")
@jwt_required_custom
@role_required("admin")
def list_all_quizzes():
    quizzes = Quiz.query.order_by(Quiz.created_at.desc()).all()
    return jsonify({"quizzes": [q.to_dict() for q in quizzes]}), 200


@admin_bp.get("/reports")
@jwt_required_custom
@role_required("admin")
def reports():
    events = Event.query.all()
    rows = []
    for e in events:
        reg_count = e.registration_count
        attended_count = Attendance.query.filter_by(event_id=e.id).count()
        attendance_rate = round((attended_count / reg_count) * 100) if reg_count else 0
        certificates_issued = Certificate.query.filter_by(event_id=e.id).count()
        quiz_ids = [q.id for q in Quiz.query.filter_by(event_id=e.id).all()]
        quiz_attempts_q = QuizAttempt.query.filter(QuizAttempt.quiz_id.in_(quiz_ids)) if quiz_ids else None
        quiz_attempts_count = quiz_attempts_q.count() if quiz_attempts_q else 0
        avg_score = None
        if quiz_attempts_q and quiz_attempts_count:
            scores = [a.score for a in quiz_attempts_q.all()]
            avg_score = round(sum(scores) / len(scores), 1)
        rows.append({
            "event_id": e.id,
            "event_title": e.title,
            "registrations": reg_count,
            "attendance": attended_count,
            "attendance_rate_pct": attendance_rate,
            "certificates_issued": certificates_issued,
            "quiz_attempts": quiz_attempts_count,
            "average_quiz_score": avg_score,
        })
    rows.sort(key=lambda x: x["registrations"], reverse=True)
    return jsonify({"rows": rows}), 200


@admin_bp.get("/reports/export")
@jwt_required_custom
@role_required("admin")
def export_report():
    report_type = request.args.get("type", "users")

    output = io.StringIO()
    writer = csv.writer(output)

    if report_type == "users":
        writer.writerow(["id", "name", "email", "role", "created_at"])
        for u in User.query.all():
            writer.writerow([u.id, u.name, u.email, u.role, u.created_at])
    elif report_type == "events":
        writer.writerow(["id", "title", "organizer", "registrations", "limit", "start_time"])
        for e in Event.query.all():
            writer.writerow([e.id, e.title, e.organizer.name if e.organizer else "", e.registration_count, e.registration_limit, e.start_time])
    elif report_type == "attendance":
        writer.writerow(["id", "event", "user", "method", "checked_in_at"])
        for a in Attendance.query.all():
            writer.writerow([a.id, a.event.title if a.event else "", a.user.name if a.user else "", a.method, a.checked_in_at])
    else:
        return jsonify({"error": "Unknown report type"}), 400

    csv_data = output.getvalue()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename=eventverse-{report_type}-report.csv"},
    )