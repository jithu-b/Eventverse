"""
PDF service — generates landscape PDF certificates of participation.
"""
import os
import uuid

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas


BRAND_PURPLE = HexColor("#7C5CFF")
DARK_TEXT = HexColor("#0F0F14")
GRAY_TEXT = HexColor("#55555F")


def generate_certificate_pdf(user_name, event_title, issued_date, upload_folder):
    certificates_dir = os.path.join(upload_folder, "certificates")
    os.makedirs(certificates_dir, exist_ok=True)

    verification_code = uuid.uuid4().hex[:12].upper()
    filename = f"certificate_{verification_code}.pdf"
    filepath = os.path.join(certificates_dir, filename)

    page_size = landscape(A4)
    width, height = page_size
    c = canvas.Canvas(filepath, pagesize=page_size)

    c.setStrokeColor(BRAND_PURPLE)
    c.setLineWidth(3)
    c.rect(15 * mm, 15 * mm, width - 30 * mm, height - 30 * mm)
    c.setLineWidth(0.75)
    c.rect(19 * mm, 19 * mm, width - 38 * mm, height - 38 * mm)

    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(width / 2, height - 55 * mm, "CERTIFICATE OF PARTICIPATION")

    c.setFont("Helvetica-Bold", 34)
    c.setFillColor(BRAND_PURPLE)
    c.drawCentredString(width / 2, height - 80 * mm, user_name)

    c.setFont("Helvetica", 14)
    c.setFillColor(DARK_TEXT)
    c.drawCentredString(width / 2, height - 95 * mm, "has successfully participated in")

    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(DARK_TEXT)
    c.drawCentredString(width / 2, height - 110 * mm, event_title)

    c.setFont("Helvetica", 11)
    c.setFillColor(GRAY_TEXT)
    c.drawCentredString(width / 2, height - 130 * mm, f"Issued on {issued_date}")
    c.drawCentredString(width / 2, 25 * mm, f"Verification code: {verification_code}")

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(BRAND_PURPLE)
    c.drawCentredString(width / 2, 20 * mm, "EventVerse · TinkerHub")

    c.save()

    relative_path = os.path.join("certificates", filename)
    return relative_path, verification_code
