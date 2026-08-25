"""
Email service — sends transactional emails (password reset, notifications).

In development, if MAIL_USERNAME/MAIL_PASSWORD aren't configured, emails are
logged to the console instead of actually being sent, so auth flows work
out-of-the-box without SMTP setup.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import current_app


def _send_email(to_email: str, subject: str, html_body: str) -> bool:
    mail_username = current_app.config.get("MAIL_USERNAME")
    mail_password = current_app.config.get("MAIL_PASSWORD")
    sender = current_app.config.get("MAIL_SENDER", "noreply@eventverse.local")

    if not mail_username or not mail_password:
        # Dev fallback — no SMTP configured, just log it.
        print("=" * 60)
        print(f"[DEV EMAIL] To: {to_email}")
        print(f"[DEV EMAIL] Subject: {subject}")
        print(f"[DEV EMAIL] Body:\n{html_body}")
        print("=" * 60)
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        server = smtplib.SMTP(current_app.config["MAIL_SERVER"], current_app.config["MAIL_PORT"])
        if current_app.config.get("MAIL_USE_TLS"):
            server.starttls()
        server.login(mail_username, mail_password)
        server.sendmail(sender, [to_email], msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {to_email}: {e}")
        return False


def send_password_reset_email(to_email: str, user_name: str, reset_url: str) -> bool:
    subject = "Reset your EventVerse password"
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Hi {user_name},</p>
        <p>We received a request to reset your EventVerse password. Click the button below to choose a new one:</p>
        <p><a href="{reset_url}" style="display:inline-block;padding:12px 24px;background:#7C5CFF;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a></p>
        <p>This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
    """
    return _send_email(to_email, subject, html_body)


def send_registration_confirmation_email(to_email: str, user_name: str, event_title: str) -> bool:
    subject = f"You're registered for {event_title}!"
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>You're in! 🎉</h2>
        <p>Hi {user_name},</p>
        <p>Your registration for <strong>{event_title}</strong> is confirmed. See you there!</p>
    </div>
    """
    return _send_email(to_email, subject, html_body)


def send_certificate_ready_email(to_email: str, user_name: str, event_title: str, certificate_url: str) -> bool:
    subject = f"Your certificate for {event_title} is ready"
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Certificate ready 🏆</h2>
        <p>Hi {user_name},</p>
        <p>Your certificate of participation for <strong>{event_title}</strong> is ready to download.</p>
        <p><a href="{certificate_url}" style="display:inline-block;padding:12px 24px;background:#7C5CFF;color:#fff;text-decoration:none;border-radius:8px;">Download Certificate</a></p>
    </div>
    """
    return _send_email(to_email, subject, html_body)