#!/usr/bin/env python3
"""
Monroe Car Wash - Local server with email support
Serves static files + handles contact form POST → sends email via Gmail SMTP
"""

import http.server
import socketserver
import json
import smtplib
import urllib.parse
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# ─── CONFIG ────────────────────────────────────────────────────────────────────
PORT        = 5500
TO_EMAIL    = "asharqasmani@gmail.com"
FROM_EMAIL  = "asharqasmani@gmail.com"   # Gmail account that sends the email
APP_PASSWORD = "lnvj gcfl cvjx yohe"     # Gmail App Password (16 chars, no spaces needed)
# ───────────────────────────────────────────────────────────────────────────────


def send_email(fields: dict) -> bool:
    """Send a nicely formatted HTML email with the form data."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "📬 New Message from Monroe Car Wash Website"
    msg["From"]    = FROM_EMAIL
    msg["To"]      = TO_EMAIL

    first = fields.get("First Name", "")
    last  = fields.get("Last Name", "")
    phone = fields.get("Phone Number", "N/A")
    email = fields.get("email", "N/A")
    make  = fields.get("Vehicle Make", "N/A")
    model = fields.get("Vehicle Model", "N/A")
    service = fields.get("Service Interested In", "N/A")
    message = fields.get("Message", "N/A")

    html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background:#f4f6fb; margin:0; padding:0; }}
    .wrap {{ max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.10); }}
    .header {{ background:linear-gradient(135deg,#0a1660,#0f1f7e); padding:32px 40px; }}
    .header h1 {{ color:#fff; margin:0; font-size:22px; font-weight:800; }}
    .header p  {{ color:rgba(255,255,255,0.6); margin:6px 0 0; font-size:13px; }}
    .body {{ padding:36px 40px; }}
    .label {{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#8888aa; margin-bottom:4px; }}
    .value {{ font-size:15px; color:#1a1a2e; font-weight:600; margin-bottom:20px; }}
    .divider {{ border:none; border-top:1px solid #e2e6f0; margin:4px 0 20px; }}
    .message-box {{ background:#f4f6fb; border-radius:8px; padding:18px 20px; margin-top:4px; }}
    .message-box p {{ margin:0; color:#4a4a6a; font-size:14px; line-height:1.7; }}
    .footer {{ background:#0a1660; padding:20px 40px; text-align:center; }}
    .footer p {{ color:rgba(255,255,255,0.45); font-size:12px; margin:0; }}
    .badge {{ display:inline-block; background:#f0b429; color:#1a1a2e; font-size:11px; font-weight:800;
              padding:4px 12px; border-radius:100px; margin-bottom:20px; letter-spacing:0.5px; }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>🚗 Monroe Car Wash &amp; Detail Center</h1>
      <p>New contact form submission received</p>
    </div>
    <div class="body">
      <div class="badge">New Message</div>

      <div class="label">Customer Name</div>
      <div class="value">{first} {last}</div>
      <hr class="divider">

      <div class="label">Phone Number</div>
      <div class="value">{phone}</div>
      <hr class="divider">

      <div class="label">Email Address</div>
      <div class="value"><a href="mailto:{email}" style="color:#0f1f7e;">{email}</a></div>
      <hr class="divider">

      <div class="label">Vehicle</div>
      <div class="value">{make} {model}</div>
      <hr class="divider">

      <div class="label">Service Interested In</div>
      <div class="value">{service}</div>
      <hr class="divider">

      <div class="label">Message</div>
      <div class="message-box"><p>{message}</p></div>
    </div>
    <div class="footer">
      <p>Sent from Monroe Car Wash website &nbsp;|&nbsp; 178 Main Street, Monroe, CT &nbsp;|&nbsp; 203-261-4870</p>
    </div>
  </div>
</body>
</html>
"""

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(FROM_EMAIL, APP_PASSWORD)
        server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())

    return True


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

    def do_POST(self):
        if self.path == "/send-email":
            length = int(self.headers.get("Content-Length", 0))
            raw    = self.rfile.read(length).decode("utf-8")
            fields = urllib.parse.parse_qs(raw, keep_blank_values=True)
            # Flatten single-value lists
            flat   = {k: v[0] if len(v) == 1 else v for k, v in fields.items()}

            try:
                send_email(flat)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": True}).encode())
                print(f"✅  Email sent to {TO_EMAIL}")
            except Exception as e:
                print(f"❌  Email error: {e}")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(e)}).encode())
        else:
            self.send_error(404)

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} — {fmt % args}")


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n🚗  Monroe Car Wash server running at http://localhost:{PORT}")
        print(f"📧  Contact form → {TO_EMAIL}\n")
        httpd.serve_forever()
