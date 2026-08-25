"""
Central configuration, loaded from environment variables (.env file).
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # ---- Flask core ----
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"

    # ---- JWT ----
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 24  # 24 hours, in seconds

    # ---- Database ----
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///instance/eventverse.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ---- CORS ----
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")

    # ---- File storage ----
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER") or os.path.join(os.path.abspath(os.path.dirname(__file__)), "uploads")
    BANNER_FOLDER = os.path.join(UPLOAD_FOLDER, "banners")
    CERTIFICATE_FOLDER = os.path.join(UPLOAD_FOLDER, "certificates")
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB upload limit

    # ---- Frontend ----
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # ---- Email ----
    MAIL_SENDER = os.getenv("MAIL_SENDER", "noreply@eventverse.local")
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")