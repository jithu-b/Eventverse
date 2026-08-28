"""
Application factory — creates and configures the Flask app.
"""
import os
from flask import Flask, send_from_directory
from config import Config
from app.extensions import db, jwt, bcrypt, cors


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # ---- init extensions ----
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    # ---- import models so db.create_all() registers every table ----
    from app import models  # noqa: F401

    # ---- register blueprints ----
    from app.routes.auth_routes import auth_bp
    from app.routes.event_routes import event_bp
    from app.routes.quiz_routes import quiz_bp
    from app.routes.game_routes import game_bp
    from app.routes.leaderboard_routes import leaderboard_bp
    from app.routes.attendance_routes import attendance_bp
    from app.routes.certificate_routes import certificate_bp
    from app.routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(event_bp, url_prefix="/api/events")
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
    app.register_blueprint(game_bp, url_prefix="/api/games")
    app.register_blueprint(leaderboard_bp, url_prefix="/api/leaderboard")
    app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
    app.register_blueprint(certificate_bp, url_prefix="/api/certificates")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    from app.routes.photo_routes import photo_bp
    app.register_blueprint(photo_bp, url_prefix="/api/photos")


    from app.routes.execom_routes import execom_bp
    app.register_blueprint(execom_bp, url_prefix="/api/execom")

    # ---- create tables (dev convenience; use migrations in prod) ----
    with app.app_context():
        db.create_all()

    # ---- static file serving for banners/certificates ----
    @app.get("/uploads/<path:filename>")
    def serve_uploads(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # ---- health check ----
    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "EventVerse API"}

    # ---- serve built React frontend (production) ----
    frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        target = os.path.join(frontend_dist, path)
        if path and os.path.isfile(target):
            return send_from_directory(frontend_dist, path)
        return send_from_directory(frontend_dist, "index.html")

    # ---- global error handlers ----
    @app.errorhandler(404)
    def not_found(_err):
        return {"error": "Resource not found"}, 404

    @app.errorhandler(500)
    def server_error(_err):
        return {"error": "Internal server error"}, 500

    return app
