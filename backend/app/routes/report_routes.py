"""
Event Report routes — CRUD for event reports
"""
from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models.report import EventReport, ReportImage
from app.models.event import Event
from app.utils.decorators import jwt_required_custom, role_required
from app.schemas.report_schema import ReportCreateSchema, ReportUpdateSchema

report_bp = Blueprint("reports", __name__)

report_create_schema = ReportCreateSchema()
report_update_schema = ReportUpdateSchema()

@report_bp.get("/events/<int:event_id>")
def get_event_report(event_id):
    """Get report for a specific event"""
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    report = EventReport.query.filter_by(event_id=event_id).first()
    if not report:
        return jsonify({"error": "Report not found"}), 404
    
    return jsonify(report.to_dict()), 200

@report_bp.get("")
def list_all_reports():
    """Get all event reports"""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    
    reports = EventReport.query.order_by(EventReport.created_at.desc()).paginate(
        page=page, per_page=per_page
    )
    
    return jsonify({
        "data": [r.to_dict() for r in reports.items],
        "total": reports.total,
        "pages": reports.pages,
        "current_page": page,
    }), 200

@report_bp.post("/events/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def create_report(event_id):
    """Create a report for an event (Admin only)"""
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    try:
        data = report_create_schema.load(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    # Check if report already exists
    existing = EventReport.query.filter_by(event_id=event_id).first()
    if existing:
        return jsonify({"error": "Report already exists for this event"}), 409
    
    report = EventReport(
        event_id=event_id,
        title=data["title"],
        summary=data["summary"],
        highlights=data.get("highlights", []),
        stats=data.get("stats", {}),
        cover_image=data.get("cover_image"),
    )
    
    db.session.add(report)
    db.session.commit()
    
    return jsonify(report.to_dict()), 201

@report_bp.put("/events/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def update_report(event_id):
    """Update an event report (Admin only)"""
    report = EventReport.query.filter_by(event_id=event_id).first()
    if not report:
        return jsonify({"error": "Report not found"}), 404
    
    try:
        data = report_update_schema.load(request.get_json())
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    report.title = data.get("title", report.title)
    report.summary = data.get("summary", report.summary)
    report.highlights = data.get("highlights", report.highlights)
    report.stats = data.get("stats", report.stats)
    report.cover_image = data.get("cover_image", report.cover_image)
    
    db.session.commit()
    return jsonify(report.to_dict()), 200

@report_bp.post("/events/<int:event_id>/images")
@jwt_required_custom
@role_required("organizer", "admin")
def add_report_image(event_id):
    """Add image to event report"""
    report = EventReport.query.filter_by(event_id=event_id).first()
    if not report:
        return jsonify({"error": "Report not found"}), 404
    
    data = request.get_json()
    image = ReportImage(
        report_id=report.id,
        image_url=data.get("image_url"),
        caption=data.get("caption"),
        order=data.get("order", 0),
    )
    
    db.session.add(image)
    db.session.commit()
    
    return jsonify(image.to_dict()), 201

@report_bp.delete("/events/<int:event_id>/images/<int:image_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def delete_report_image(event_id, image_id):
    """Delete image from report"""
    image = ReportImage.query.get(image_id)
    if not image or image.report.event_id != event_id:
        return jsonify({"error": "Image not found"}), 404
    
    db.session.delete(image)
    db.session.commit()
    
    return jsonify({"message": "Image deleted"}), 200

@report_bp.delete("/events/<int:event_id>")
@jwt_required_custom
@role_required("organizer", "admin")
def delete_report(event_id):
    """Delete event report (Admin only)"""
    report = EventReport.query.filter_by(event_id=event_id).first()
    if not report:
        return jsonify({"error": "Report not found"}), 404
    
    db.session.delete(report)
    db.session.commit()
    
    return jsonify({"message": "Report deleted"}), 200
