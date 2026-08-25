"""
Photo routes — event gallery: list all/by-event, upload (organizer/admin only).
"""
import os
import uuid

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.photo import Photo
from app.models.event import Event
from app.utils.decorators import jwt_required_custom, role_required, get_current_user_id

photo_bp = Blueprint("photo", __name__)

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
    gallery_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], "gallery")
    os.makedirs(gallery_dir, exist_ok=True)
    filepath = os.path.join(gallery_dir, filename)
    file_storage.save(filepath)
    return f"/uploads/gallery/{filename}"


@photo_bp.get("")
def list_photos():
    event_id = request.args.get("event_id", type=int)
    query = Photo.query
    if event_id:
        query = query.filter_by(event_id=event_id)
    photos = query.order_by(Photo.uploaded_at.desc()).all()
    return jsonify({"photos": [p.to_dict() for p in photos]}), 200


@photo_bp.post("")
@jwt_required_custom
@role_required("organizer", "admin")
def upload_photo():
    event_id = request.form.get("event_id", type=int)
    if not event_id:
        return jsonify({"error": "event_id is required"}), 400
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    if "photo" not in request.files:
        return jsonify({"error": "photo file is required"}), 400
    photo_url = _save_photo(request.files["photo"])
    if not photo_url:
        return jsonify({"error": "Invalid or missing photo file"}), 400

    user_id = get_current_user_id()
    photo = Photo(
        event_id=event_id,
        uploaded_by=user_id,
        photo_url=photo_url,
        caption=request.form.get("caption"),
    )
    db.session.add(photo)
    db.session.commit()
    return jsonify({"photo": photo.to_dict()}), 201


@photo_bp.delete("/<int:photo_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def delete_photo(photo_id):
    photo = Photo.query.get(photo_id)
    if not photo:
        return jsonify({"error": "Photo not found"}), 404
    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo deleted"}), 200
