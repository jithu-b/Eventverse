"""
Marshmallow schemas for Quiz / QuizQuestion create-update payloads and
quiz attempt submission.
"""
from marshmallow import Schema, fields, validate


class QuizCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    duration_minutes = fields.Int(required=False, load_default=10, validate=validate.Range(min=1, max=180))
    shuffle_questions = fields.Bool(required=False, load_default=True)


class QuizUpdateSchema(Schema):
    title = fields.Str(required=False, validate=validate.Length(min=1, max=200))
    duration_minutes = fields.Int(required=False, validate=validate.Range(min=1, max=180))
    shuffle_questions = fields.Bool(required=False)


class QuestionCreateSchema(Schema):
    question_text = fields.Str(required=True, validate=validate.Length(min=1))
    option_a = fields.Str(required=True)
    option_b = fields.Str(required=True)
    option_c = fields.Str(required=False, allow_none=True)
    option_d = fields.Str(required=False, allow_none=True)
    correct_option = fields.Str(required=True, validate=validate.OneOf(["a", "b", "c", "d"]))
    points = fields.Int(required=False, load_default=10, validate=validate.Range(min=1))


class QuestionUpdateSchema(Schema):
    question_text = fields.Str(required=False)
    option_a = fields.Str(required=False)
    option_b = fields.Str(required=False)
    option_c = fields.Str(required=False, allow_none=True)
    option_d = fields.Str(required=False, allow_none=True)
    correct_option = fields.Str(required=False, validate=validate.OneOf(["a", "b", "c", "d"]))
    points = fields.Int(required=False, validate=validate.Range(min=1))


class SubmitAnswersSchema(Schema):
    # dict of { question_id (as string): chosen_option }
    answers = fields.Dict(required=True)