from app.extensions import db

class ExecomMember(db.Model):
    __tablename__ = "execom_members"
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(10))
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(120), nullable=False)
    class_name = db.Column(db.String(50))
    department = db.Column(db.String(150))
    image = db.Column(db.String(500))
    hover_image = db.Column(db.String(500))
    hover_caption = db.Column(db.String(200))
    description = db.Column(db.Text)
    quote = db.Column(db.Text)
    key_initiatives = db.Column(db.JSON, default=list)
    skills = db.Column(db.JSON, default=list)
    social = db.Column(db.JSON, default=dict)

    def to_dict(self):
        return {
            "id": self.id,
            "number": self.number or "",
            "name": self.name,
            "role": self.role,
            "class": self.class_name or "",
            "department": self.department or "",
            "image": self.image or "",
            "hoverImage": self.hover_image or "",
            "hoverCaption": self.hover_caption or "",
            "description": self.description or "",
            "quote": self.quote or "",
            "keyInitiatives": self.key_initiatives or [],
            "skills": self.skills or [],
            "social": self.social or {"instagram": "", "github": "", "linkedin": "", "email": ""},
        }
