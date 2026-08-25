"""
Entry point for running the Flask development server.
Production deployments should use gunicorn: `gunicorn run:app`
"""
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=app.config.get("DEBUG", True), host="0.0.0.0", port=5000)