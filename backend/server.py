from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import asyncio
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="LakeBridge API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Resend configuration — set RESEND_API_KEY in .env to enable emails
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY
    logger.info("Resend email integration enabled")
else:
    logger.warning("RESEND_API_KEY not set — waitlist emails will be skipped. Add key to .env to enable.")


# ─── Models ─────────────────────────────────────────────────────────────────

class WaitlistCreate(BaseModel):
    email: str

class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    email_sent: bool = False

class WaitlistResponse(BaseModel):
    message: str
    status: str
    email_sent: bool = False


# ─── Email helper ─────────────────────────────────────────────────────────

async def send_waitlist_confirmation(email: str) -> bool:
    """Send waitlist confirmation email via Resend. Returns True on success."""
    if not RESEND_API_KEY:
        logger.info(f"Email skipped (no RESEND_API_KEY): {email}")
        return False

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;padding:0 20px;">
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0"
            style="background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:40px;">
            <tr><td>
              <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:32px;">
                <div style="width:28px;height:28px;background:#3B82F6;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;color:white;font-size:10px;text-align:center;line-height:28px;">LB</div>
                <span style="font-weight:700;font-size:16px;color:white;">LakeBridge</span>
              </div>
              <h1 style="color:white;font-size:24px;font-weight:800;margin:0 0 12px;line-height:1.2;">
                You're on the list.
              </h1>
              <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Thanks for joining the LakeBridge private beta waitlist. We're onboarding Postgres-first teams now and we'll reach out as soon as your spot is ready.
              </p>
              <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="color:#93c5fd;font-size:13px;margin:0;line-height:1.5;">
                  <strong style="color:#60a5fa;">What to expect:</strong><br>
                  A single email when your beta access is ready. No newsletter, no updates, no spam.
                </p>
              </div>
              <p style="color:#a1a1aa;font-size:13px;margin:0 0 8px;">
                While you wait, you can explore the open-source extension or read the docs.
              </p>
              <div style="margin-top:24px;display:flex;gap:12px;">
                <a href="https://github.com/lakebridge" style="display:inline-block;padding:10px 20px;background:rgba(255,255,255,0.1);color:white;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;">View on GitHub</a>
                <a href="https://query-bridge-2.preview.emergentagent.com/docs" style="display:inline-block;padding:10px 20px;background:white;color:black;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Read the docs</a>
              </div>
              <p style="color:#52525b;font-size:12px;margin:32px 0 0;">
                You signed up with: {email}<br>
                LakeBridge, Inc. · Built for Postgres teams.
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """

    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "You're on the LakeBridge waitlist",
            "html": html_content,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Confirmation email sent to {email}, id={result.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send confirmation email to {email}: {e}")
        return False


# ─── Routes ─────────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "LakeBridge API is running", "version": "0.1.0"}


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate):
    email = payload.email.strip().lower()

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=422, detail="Invalid email address")

    existing = await db.waitlist.find_one({"email": email})
    if existing:
        return WaitlistResponse(
            message="You're already on the waitlist! We'll be in touch soon.",
            status="existing"
        )

    entry = WaitlistEntry(email=email)
    doc = entry.model_dump()

    # Send confirmation email (non-blocking; don't fail if email errors)
    email_sent = await send_waitlist_confirmation(email)
    doc["email_sent"] = email_sent

    await db.waitlist.insert_one(doc)
    logger.info(f"New waitlist signup: {email} (email_sent={email_sent})")

    return WaitlistResponse(
        message="You're on the list! We'll reach out when your spot is ready.",
        status="success",
        email_sent=email_sent
    )


@api_router.get("/waitlist/count")
async def get_waitlist_count():
    count = await db.waitlist.count_documents({})
    return {"count": count}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
