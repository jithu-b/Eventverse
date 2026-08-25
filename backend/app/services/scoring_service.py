"""
Scoring service — auto-scores quiz attempts and aggregates leaderboards.
"""
from app.extensions import db
from app.models.leaderboard import LeaderboardEntry


def score_quiz_attempt(quiz, answers):
    questions = list(quiz.questions)
    total_questions = len(questions)
    correct_count = 0
    score = 0

    for question in questions:
        chosen = answers.get(str(question.id)) or answers.get(question.id)
        if chosen and chosen == question.correct_option:
            correct_count += 1
            score += question.points

    percentage = round((correct_count / total_questions) * 100) if total_questions else 0

    return {
        "score": score,
        "total_questions": total_questions,
        "correct_count": correct_count,
        "quiz_id": quiz.id,
        "percentage": percentage,
    }


def upsert_leaderboard_entry(event_id, user_id, category, score):
    entry = LeaderboardEntry.query.filter_by(
        event_id=event_id, user_id=user_id, category=category
    ).first()

    if entry:
        if score > entry.score:
            entry.score = score
    else:
        entry = LeaderboardEntry(event_id=event_id, user_id=user_id, category=category, score=score)
        db.session.add(entry)

    db.session.commit()
    recompute_overall_leaderboard(event_id, user_id)


def recompute_overall_leaderboard(event_id, user_id):
    quiz_entry = LeaderboardEntry.query.filter_by(
        event_id=event_id, user_id=user_id, category="quiz"
    ).first()
    game_entries = LeaderboardEntry.query.filter_by(
        event_id=event_id, user_id=user_id, category="game"
    ).all()

    total = (quiz_entry.score if quiz_entry else 0) + sum(g.score for g in game_entries)

    overall_entry = LeaderboardEntry.query.filter_by(
        event_id=event_id, user_id=user_id, category="overall"
    ).first()

    if overall_entry:
        overall_entry.score = total
    else:
        overall_entry = LeaderboardEntry(event_id=event_id, user_id=user_id, category="overall", score=total)
        db.session.add(overall_entry)

    db.session.commit()


def get_leaderboard(event_id, category, limit=50):
    return (
        LeaderboardEntry.query.filter_by(event_id=event_id, category=category)
        .order_by(LeaderboardEntry.score.desc())
        .limit(limit)
        .all()
    )
