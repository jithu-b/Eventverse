"""
Certificate routes — generate, fetch, download (PDF blob), and list-my-certificates.
"""
import os

from flask import Blueprint, request, jsonify, current_app, send_from_directory

from app.extensions import db
from app.models.event import Event
from app.models.user import User
from app.models.attendance import Attendance
from app.models.certificate import Certificate
from app.utils.decorators import jwt_required_custom, role_required, get_current_user_id
from app.services.pdf_service import generate_certificate_pdf
from app.services.email_service import send_certificate_ready_email

certificate_bp = Blueprint("certificate", __name__)


@certificate_bp.get("/<int:certificate_id>")
@jwt_required_custom
def get_certificate(certificate_id):
    cert = Certificate.query.get(certificate_id)
    if not cert:
        return jsonify({"error": "Certificate not found"}), 404
    return jsonify({"certificate": cert.to_dict()}), 200


@certificate_bp.get("/<int:certificate_id>/download")
@jwt_required_custom
def download_certificate(certificate_id):
    cert = Certificate.query.get(certificate_id)
    if not cert:
        return jsonify({"error": "Certificate not found"}), 404

    certificates_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "certificates")
    filename = os.path.basename(cert.file_path)

    return send_from_directory(
        certificates_dir,
        filename,
        as_attachment=True,
        download_name=f"eventverse-certificate-{cert.id}.pdf",
        mimetype="application/pdf",
    )


@certificate_bp.get("/my-certificates")
@jwt_required_custom
def my_certificates():
    user_id = get_current_user_id()
    certs = Certificate.query.filter_by(user_id=user_id).order_by(Certificate.issued_at.desc()).all()
    return jsonify({"certificates": [c.to_dict() for c in certs]}), 200


@certificate_bp.post("/event/<int:event_id>/generate")
@jwt_required_custom
@role_required("organizer", "admin")
def generate_certificate(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    if not event.certificate_enabled:
        return jsonify({"error": "Certificates are not enabled for this event"}), 400

    data = request.get_json(force=True) or {}
    target_user_id = data.get("user_id")
    if not target_user_id:
        return jsonify({"error": "user_id is required"}), 400

    user = User.query.get(target_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    attended = Attendance.query.filter_by(event_id=event_id, user_id=target_user_id).first()
    if not attended:
        return jsonify({"error": "User did not attend this event, cannot issue certificate"}), 400

    existing = Certificate.query.filter_by(event_id=event_id, user_id=target_user_id).first()
    if existing:
        return jsonify({"certificate": existing.to_dict()}), 200

    issued_date_str = attended.checked_in_at.strftime("%B %d, %Y")
    relative_path, verification_code = generate_certificate_pdf(
        user_name=user.name,
        event_title=event.title,
        issued_date=issued_date_str,
        upload_folder=current_app.config["UPLOAD_FOLDER"],
    )

    certificate = Certificate(event_id=event_id, user_id=target_user_id, file_path=relative_path)
    db.session.add(certificate)
    db.session.commit()

    cert_url = f"{current_app.config['FRONTEND_URL']}/certificates/{certificate.id}"
    send_certificate_ready_email(user.email, user.name, event.title, cert_url)

    return jsonify({"certificate": certificate.to_dict()}), 201
