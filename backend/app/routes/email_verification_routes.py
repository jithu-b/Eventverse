"""Email verification routes"""
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User

verify_bp = Blueprint("verify", __name__)

@verify_bp.route("/confirm", methods=["GET"])
def confirm_email():
    """Confirm email verification"""
    token = request.args.get("token")
    email = request.args.get("email", "").lower()
    
    if not token or not email:
        return jsonify({"error": "Invalid verification link"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.email_verified:
        return jsonify({"message": "Email already verified"}), 200
    
    if not user.is_email_verification_token_valid(token):
        return jsonify({"error": "Invalid or expired token"}), 401
    
    user.verify_email()
    db.session.commit()
    
    return jsonify({"message": "Email verified! You can now log in."}), 200
