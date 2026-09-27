from flask import Flask

def add_security_headers(app: Flask):
    """Add security headers to all responses"""
    @app.after_request
    def set_security_headers(response):
        # Prevent clickjacking
        response.headers['X-Frame-Options'] = 'DENY'
        # Prevent MIME sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'
        # Enable XSS protection
        response.headers['X-XSS-Protection'] = '1; mode=block'
        # Content Security Policy
        response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        # Referrer Policy
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        # HTTPS enforcement
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response
    return app
