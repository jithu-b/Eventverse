"""
Execom routes — public list, admin-only create/update/delete with photo upload.
"""
import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models.execom import ExecomMember
from app.utils.decorators import jwt_required_custom, role_required

execom_bp = Blueprint("execom", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _save_photo(file_storage):
    if not file_storage or file_storage.filename == "":
        return None
    if not _allowed_file(file_storage.filename):
        return None
    ext = file_storage.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
    execom_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "execom")
    os.makedirs(execom_dir, exist_ok=True)
    filepath = os.path.join(execom_dir, filename)
    file_storage.save(filepath)
    return f"/uploads/execom/{filename}"


@execom_bp.get("")
def list_members():
    members = ExecomMember.query.order_by(
        ExecomMember.display_order.asc(), ExecomMember.id.asc()
    ).all()
    return jsonify({"members": [m.to_dict() for m in members]}), 200


@execom_bp.post("")
@jwt_required_custom
@role_required("admin")
def create_member():
    name = request.form.get("name")
    position = request.form.get("position")
    if not name or not position:
        return jsonify({"error": "name and position are required"}), 400

    photo_url = None
    if "photo" in request.files:
        photo_url = _save_photo(request.files["photo"])

    member = ExecomMember(
        name=name,
        position=position,
        year=request.form.get("year"),
        photo_url=photo_url,
        display_order=request.form.get("display_order", type=int, default=0),
    )
    db.session.add(member)
    db.session.commit()
    return jsonify({"member": member.to_dict()}), 201


@execom_bp.put("/<int:member_id>")
@jwt_required_custom
@role_required("admin")
def update_member(member_id):
    member = ExecomMember.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    if "name" in request.form:
        member.name = request.form.get("name")
    if "position" in request.form:
        member.position = request.form.get("position")
    if "year" in request.form:
        member.year = request.form.get("year")
    if "display_order" in request.form:
        member.display_order = request.form.get("display_order", type=int)
    if "photo" in request.files:
        new_photo_url = _save_photo(request.files["photo"])
        if new_photo_url:
            member.photo_url = new_photo_url

    db.session.commit()
    return jsonify({"member": member.to_dict()}), 200


@execom_bp.delete("/<int:member_id>")
@jwt_required_custom
@role_required("admin")
def delete_member(member_id):
    member = ExecomMember.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"}), 200
