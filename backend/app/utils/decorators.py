"""
Auth/role decorators shared across all route blueprints.
"""
from functools import wraps

from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt

from app.models.user import User


def jwt_required_custom(fn):
    """Verifies JWT is present and valid; attaches nothing extra (use get_current_user)."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        return fn(*args, **kwargs)

    return wrapper


def get_current_user():
    """Call inside a jwt_required-protected route to fetch the User row."""
    user_id = get_jwt_identity()
    return User.query.get(int(user_id)) if user_id else None


def role_required(*allowed_roles):
    """
    Usage:
        @role_required("admin")
        @role_required("organizer", "admin")
    Must be stacked UNDER @jwt_required_custom (or any @jwt_required) so the
    JWT has already been verified before this decorator runs.
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role")
            if role not in allowed_roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def get_current_user_id():
    """Lightweight helper: just the integer user id from the JWT, or None."""
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        return int(identity) if identity else None
    except Exception:
        return None