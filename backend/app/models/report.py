"""
Event Report model — stores event reports, images, and summaries
"""
from datetime import datetime
from app.extensions import db

class EventReport(db.Model):
    __tablename__ = "event_reports"
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    highlights = db.Column(db.JSON, default=[])  # List of key highlights
    stats = db.Column(db.JSON, default={})  # {attendees: 100, duration: "4 hours", etc}
    cover_image = db.Column(db.String(255), nullable=True)  # Main report image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    event = db.relationship("Event", backref="report")
    gallery_images = db.relationship("ReportImage", backref="report", lazy="dynamic", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "title": self.title,
            "summary": self.summary,
            "highlights": self.highlights,
            "stats": self.stats,
            "cover_image": self.cover_image,
            "gallery_images": [img.to_dict() for img in self.gallery_images],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class ReportImage(db.Model):
    __tablename__ = "report_images"
    
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("event_reports.id"), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(255), nullable=True)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "caption": self.caption,
            "order": self.order,
        }
