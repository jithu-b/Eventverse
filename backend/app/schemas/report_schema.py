"""Report validation schemas"""
from marshmallow import Schema, fields, validate

class ReportCreateSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=5, max=255))
    summary = fields.String(required=True, validate=validate.Length(min=10))
    highlights = fields.List(fields.String(), load_default=[])
    stats = fields.Dict(load_default={})
    cover_image = fields.String(allow_none=True)

class ReportUpdateSchema(Schema):
    title = fields.String(validate=validate.Length(min=5, max=255))
    summary = fields.String(validate=validate.Length(min=10))
    highlights = fields.List(fields.String())
    stats = fields.Dict()
    cover_image = fields.String(allow_none=True)
