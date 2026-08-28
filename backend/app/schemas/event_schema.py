"""
Marshmallow schemas for Event create/update payloads.
Note: banner file itself is handled separately via multipart/form-data,
not through this schema (Marshmallow validates the text fields only).
List/dict fields (speakers, what_you_will_learn, prerequisites, schedule, tags)
arrive as JSON-encoded strings since the request is multipart/form-data;
they are json.loads'd in the route, not here.
"""
from marshmallow import Schema, fields, validate


class EventCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    subtitle = fields.Str(required=False, load_default="")
    description = fields.Str(required=False, load_default="")
    detailed_about = fields.Str(required=False, load_default="")
    category = fields.Str(required=False, load_default="")
    status = fields.Str(required=False, load_default="upcoming")
    featured = fields.Bool(required=False, load_default=False)
    location = fields.Str(required=False, load_default="")
    location_details = fields.Str(required=False, load_default="")
    start_time = fields.Str(required=False, allow_none=True)
    end_time = fields.Str(required=False, allow_none=True)
    registration_limit = fields.Int(required=False, load_default=50, validate=validate.Range(min=1))
    speakers = fields.Str(required=False, load_default="[]")
    what_you_will_learn = fields.Str(required=False, load_default="[]")
    prerequisites = fields.Str(required=False, load_default="[]")
    schedule = fields.Str(required=False, load_default="[]")
    tags = fields.Str(required=False, load_default="[]")
    organizer_role = fields.Str(required=False, load_default="")
    organizer_avatar = fields.Str(required=False, load_default="")
    quiz_enabled = fields.Bool(required=False, load_default=False)
    games_enabled = fields.Bool(required=False, load_default=False)
    certificate_enabled = fields.Bool(required=False, load_default=False)


class EventUpdateSchema(Schema):
    title = fields.Str(required=False, validate=validate.Length(min=1, max=200))
    subtitle = fields.Str(required=False)
    description = fields.Str(required=False)
    detailed_about = fields.Str(required=False)
    category = fields.Str(required=False)
    status = fields.Str(required=False)
    featured = fields.Bool(required=False)
    location = fields.Str(required=False)
    location_details = fields.Str(required=False)
    start_time = fields.Str(required=False, allow_none=True)
    end_time = fields.Str(required=False, allow_none=True)
    registration_limit = fields.Int(required=False, validate=validate.Range(min=1))
    speakers = fields.Str(required=False)
    what_you_will_learn = fields.Str(required=False)
    prerequisites = fields.Str(required=False)
    schedule = fields.Str(required=False)
    tags = fields.Str(required=False)
    organizer_role = fields.Str(required=False)
    organizer_avatar = fields.Str(required=False)
    quiz_enabled = fields.Bool(required=False)
    games_enabled = fields.Bool(required=False)
    certificate_enabled = fields.Bool(required=False)
