from app import create_app
from app.models.quiz import Quiz

app = create_app()
with app.app_context():
    quiz = Quiz.query.get(2)
    if not quiz:
        print("No quiz with id=2 found")
    else:
        print("Quiz:", quiz.title)
        for q in quiz.questions:
            print("  Q id=" + str(q.id) + " text=" + str(q.question_text) + " correct_option=" + str(q.correct_option))
