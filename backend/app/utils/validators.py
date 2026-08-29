"""
Lightweight input validators shared across route blueprints.
Kept dependency-free (no external validation library needed beyond email-validator).
"""
import re
from email_validator import validate_email as _validate_email, EmailNotValidError

from app.models.user import User

PASSWORD_MIN_LENGTH = 6


def validate_email_format(email: str) -> tuple[bool, str]:
    if not email:
        return False, "Email is required"
    try:
        _validate_email(email, check_deliverability=False)
        return True, ""
    except EmailNotValidError:
        return False, "Invalid email format"


def validate_password_strength(password: str) -> tuple[bool, str]:
    if not password or len(password) < PASSWORD_MIN_LENGTH:
        return False, f"Password must be at least {PASSWORD_MIN_LENGTH} characters"
    return True, ""


def validate_role(role: str) -> tuple[bool, str]:
    if role not in User.VALID_ROLES:
        return False, f"Role must be one of {', '.join(User.VALID_ROLES)}"
    return True, ""


def validate_required_fields(data: dict, fields: list[str]) -> tuple[bool, str]:
    missing = [f for f in fields if not data.get(f)]
    if missing:
        return False, f"Missing required field(s): {', '.join(missing)}"
    return True, ""


def is_valid_datetime_string(value: str) -> bool:
    """Accepts ISO-8601-ish strings, e.g. from <input type='datetime-local'>."""
    if not value:
        return True  # optional field
    pattern = r"^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?)?$"
    return bool(re.match(pattern, value))