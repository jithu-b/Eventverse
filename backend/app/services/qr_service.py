"""
QR service — generates QR code images and verifies scanned check-in codes.

Each Event has a unique `qr_secret`. The QR payload encoded on the frontend
is "{event_id}:{qr_secret}". This service verifies that payload server-side
during check-in, and can also generate a QR PNG (base64) if needed server-side
(e.g. for emailing a ticket).
"""
import base64
import io

import qrcode


def build_qr_payload(event_id: int, qr_secret: str) -> str:
    return f"{event_id}:{qr_secret}"


def parse_qr_payload(code: str) -> tuple[int | None, str | None]:
    """Returns (event_id, qr_secret) or (None, None) if malformed."""
    if not code or ":" not in code:
        return None, None
    parts = code.split(":", 1)
    try:
        event_id = int(parts[0])
        qr_secret = parts[1]
        return event_id, qr_secret
    except (ValueError, IndexError):
        return None, None


def verify_qr_code(code: str, event) -> bool:
    """
    Verifies a scanned code belongs to the given Event.
    `event` is a models.event.Event instance.
    """
    event_id, qr_secret = parse_qr_payload(code)
    if event_id is None or qr_secret is None:
        return False
    return event_id == event.id and qr_secret == event.qr_secret


def generate_qr_base64(payload: str) -> str:
    """Generates a QR code PNG and returns it as a base64 data URI string."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=8,
        border=4,
    )
    qr.add_data(payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"