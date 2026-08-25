"""
Marshmallow schemas for Event create/update payloads.
Note: banner file itself is handled separately via multipart/form-data,
not through this schema (Marshmallow validates the text fields only).
"""
from marshmallow import Schema, fields, validate


class EventCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(required=False, load_default="")
    start_time = fields.Str(required=False, allow_none=True)
    end_time = fields.Str(required=False, allow_none=True)
    registration_limit = fields.Int(required=False, load_default=50, validate=validate.Range(min=1))
    quiz_enabled = fields.Bool(required=False, load_default=False)
    games_enabled = fields.Bool(required=False, load_default=False)
    certificate_enabled = fields.Bool(required=False, load_default=False)


class EventUpdateSchema(Schema):
    title = fields.Str(required=False, validate=validate.Length(min=1, max=200))
    description = fields.Str(required=False)
    start_time = fields.Str(required=False, allow_none=True)
    end_time = fields.Str(required=False, allow_none=True)
    registration_limit = fields.Int(required=False, validate=validate.Range(min=1))
    quiz_enabled = fields.Bool(required=False)
    games_enabled = fields.Bool(required=False)
    certificate_enabled = fields.Bool(required=False)