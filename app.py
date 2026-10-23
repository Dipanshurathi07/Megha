"""Flask app for a little multi-page love website."""

import base64
import binascii
import json
import os
from pathlib import Path

from flask import Flask, abort, jsonify, send_from_directory
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(Path(__file__).resolve().parent / ".env")

app = Flask(__name__)

PAGES = {
    "home": "index.html",
    "goodbye": "welcome.html",
    "love": "love.html",
    "question": "question.html",
    "memories": "memories.html",
    "reasons": "reasons.html",
    "surprise": "surprise.html",
    "quiz": "quiz.html",
    "rate": "rate.html",
    "game": "game.html",
    "promise": "promise.html",
    "sorry": "sorry.html",
    "garba": "garba.html",
}

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = (
    os.getenv("SUPABASE_PUBLISHABLE_KEY")
    or os.getenv("SUPABASE_KEY")
    or ""
).strip()


def _is_publishable_key(key):
    if key.startswith("sb_publishable_"):
        return True

    parts = key.split(".")
    if len(parts) != 3:
        return False

    try:
        payload = parts[1] + "=" * (-len(parts[1]) % 4)
        claims = json.loads(base64.urlsafe_b64decode(payload))
    except (binascii.Error, UnicodeDecodeError, json.JSONDecodeError, ValueError):
        return False

    return isinstance(claims, dict) and claims.get("role") == "anon"


supabase_client = None
if SUPABASE_URL and SUPABASE_KEY and _is_publishable_key(SUPABASE_KEY):
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
elif SUPABASE_KEY:
    app.logger.error(
        "Supabase key is not a publishable/anon key; album config will not be exposed."
    )

app.extensions["supabase"] = supabase_client


@app.get("/")
def home():
    return send_from_directory(app.root_path, "welcome.html")


@app.get("/<page>")
def show_page(page):
    filename = PAGES.get(page)
    if filename is None:
        abort(404)
    return send_from_directory(app.root_path, filename)


@app.get("/api/config")
def public_config():
    if supabase_client is None:
        response = jsonify(
            configured=False,
            message="Supabase is not configured with a publishable key.",
        )
        response.status_code = 503
    else:
        response = jsonify(
            configured=True,
            supabaseUrl=SUPABASE_URL,
            supabaseAnonKey=SUPABASE_KEY,
        )
    response.headers["Cache-Control"] = "no-store"
    return response


if __name__ == "__main__":
    print("Megha's little love website: http://127.0.0.1:8000")
    app.run(host="127.0.0.1", port=8000, debug=False)
