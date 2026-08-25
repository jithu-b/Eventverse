from app import create_app
from app.models.quiz import QuizAttempt

app = create_app()
with app.app_context():
    attempts = QuizAttempt.query.filter_by(quiz_id=1).order_by(QuizAttempt.id.desc()).limit(5).all()
    for a in attempts:
        print("Attempt id=" + str(a.id) + " user_id=" + str(a.user_id) + " score=" + str(a.score))
        print("  answers_json:", a.answers_json)
