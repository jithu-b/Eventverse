"""
Auth routes — register, login, forgot-password, reset-password, current-user profile.
"""
from datetime import timedelta

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError

from app.extensions import db
from app.models.user import User
from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
)
from app.utils.decorators import jwt_required_custom, get_current_user
from app.services.email_service import send_password_reset_email

auth_bp = Blueprint("auth", __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()
forgot_schema = ForgotPasswordSchema()
reset_schema = ResetPasswordSchema()


def _issue_token(user: User) -> str:
    return create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
        expires_delta=timedelta(seconds=current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES", 86400)),
    )


@auth_bp.post("/register")
def register():
    try:
        data = register_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    if User.query.filter_by(email=data["email"].lower()).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    user = User(name=data["name"], email=data["email"].lower(), role=data.get("role", "participant"))
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    token = _issue_token(user)
    return jsonify({"access_token": token, "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    try:
        data = login_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    user = User.query.filter_by(email=data["email"].lower()).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = _issue_token(user)
    return jsonify({"access_token": token, "user": user.to_dict()}), 200


@auth_bp.post("/forgot-password")
def forgot_password():
    try:
        data = forgot_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    user = User.query.filter_by(email=data["email"].lower()).first()
    # Always return 200 to avoid leaking which emails are registered.
    if user:
        token = user.generate_reset_token()
        db.session.commit()
        reset_url = f"{current_app.config['FRONTEND_URL']}/forgot-password?token={token}"
        send_password_reset_email(user.email, user.name, reset_url)

    return jsonify({"message": "If an account exists for that email, a reset link has been sent."}), 200


@auth_bp.post("/reset-password")
def reset_password():
    try:
        data = reset_schema.load(request.get_json(force=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    user = User.query.filter_by(reset_token=data["token"]).first()
    if not user or not user.is_reset_token_valid(data["token"]):
        return jsonify({"error": "Reset link is invalid or has expired"}), 400

    user.set_password(data["new_password"])
    user.clear_reset_token()
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200


@auth_bp.get("/me")
@jwt_required_custom
def me():
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200