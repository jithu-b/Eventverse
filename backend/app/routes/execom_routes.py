import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models.execom import ExecomMember
from app.utils.decorators import jwt_required_custom, role_required

execom_bp = Blueprint("execom", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def _apply_fields(member, data):
    member.number = data.get("number", member.number)
    member.name = data.get("name", member.name)
    member.role = data.get("role", member.role)
    member.class_name = data.get("class", member.class_name)
    member.department = data.get("department", member.department)
    member.image = data.get("image", member.image)
    member.hover_image = data.get("hoverImage", member.hover_image)
    member.hover_caption = data.get("hoverCaption", member.hover_caption)
    member.description = data.get("description", member.description)
    member.quote = data.get("quote", member.quote)
    member.key_initiatives = data.get("keyInitiatives", member.key_initiatives)
    member.skills = data.get("skills", member.skills)
    member.social = data.get("social", member.social)

@execom_bp.get("")
def list_execom():
    members = ExecomMember.query.order_by(ExecomMember.number).all()
    return jsonify({"members": [m.to_dict() for m in members]}), 200

@execom_bp.post("")
@jwt_required_custom
@role_required("admin")
def create_execom():
    data = request.get_json() or {}
    if not data.get("name") or not data.get("role"):
        return jsonify({"error": "name and role are required"}), 400
    m = ExecomMember(name=data["name"], role=data["role"])
    _apply_fields(m, data)
    db.session.add(m)
    db.session.commit()
    return jsonify({"member": m.to_dict()}), 201

@execom_bp.put("/bulk")
@jwt_required_custom
@role_required("admin")
def bulk_save_execom():
    data = request.get_json() or {}
    members_data = data.get("members", [])
    try:
        ExecomMember.query.delete()
        saved = []
        for idx, md in enumerate(members_data):
            m = ExecomMember(
                name=(md.get("name") or "")[:120],
                role=(md.get("role") or "")[:120],
            )
            _apply_fields(m, md)
            if m.image and len(m.image) > 500:
                m.image = m.image[:500]
            if m.hover_image and len(m.hover_image) > 500:
                m.hover_image = m.hover_image[:500]
            if m.class_name and len(m.class_name) > 50:
                m.class_name = m.class_name[:50]
            if m.department and len(m.department) > 150:
                m.department = m.department[:150]
            if m.hover_caption and len(m.hover_caption) > 200:
                m.hover_caption = m.hover_caption[:200]
            db.session.add(m)
            saved.append(m)
        db.session.commit()
        return jsonify({"members": [m.to_dict() for m in saved]}), 200
    except Exception as exc:
        db.session.rollback()
        current_app.logger.exception("bulk_save_execom failed")
        return jsonify({"error": "bulk save failed", "detail": str(exc)}), 500

@execom_bp.delete("/<int:member_id>")
@jwt_required_custom
@role_required("admin")
def delete_execom(member_id):
    m = ExecomMember.query.get(member_id)
    if not m:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(m)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@execom_bp.post("/upload-image")
@jwt_required_custom
@role_required("admin")
def upload_execom_image():
    file_storage = request.files.get("image")
    if not file_storage or file_storage.filename == "":
        return jsonify({"error": "No image provided"}), 400
    if not _allowed_file(file_storage.filename):
        return jsonify({"error": "Invalid file type"}), 400
    ext = file_storage.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
    execom_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "execom")
    os.makedirs(execom_dir, exist_ok=True)
    file_storage.save(os.path.join(execom_dir, filename))
    return jsonify({"url": f"/uploads/execom/{filename}"}), 201
