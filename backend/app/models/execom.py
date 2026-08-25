"""
ExecomMember model — a coding club executive committee member profile.
"""
from datetime import datetime
from app.extensions import db


class ExecomMember(db.Model):
    __tablename__ = "execom_members"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    position = db.Column(db.String(150), nullable=False)
    year = db.Column(db.String(100), nullable=True)
    photo_url = db.Column(db.String(300), nullable=True)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "position": self.position,
            "year": self.year,
            "photo_url": self.photo_url,
            "display_order": self.display_order,
        }

    def __repr__(self) -> str:
        return f"<ExecomMember {self.name} ({self.position})>"
