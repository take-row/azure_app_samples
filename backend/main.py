import os
import sqlite3
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import google.generativeai as genai


# Load env from project root .env (../.env)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))

DB_PATH = os.path.join(os.path.dirname(__file__), "app.db")

# Gemini config
genai.configure(api_key=GEMINI_API_KEY)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")



def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def save_interaction(prompt: str, response: str):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO interactions (prompt, response, created_at) VALUES (?, ?, ?)",
        (prompt, response, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()


def fetch_history(limit: int = 200):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(
        "SELECT id, prompt, response, created_at FROM interactions ORDER BY id DESC LIMIT ?",
        (limit,),
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


init_db()

app = FastAPI(title="Gemini Minimal API")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://xxxxxxxx"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    prompt: str


@app.post("/generate")
def generate(req: GenerateRequest):
    model = genai.GenerativeModel(MODEL_NAME)
    result = model.generate_content(req.prompt)

    # Return only text part
    text = result.text or ""

    # Save to DB
    save_interaction(req.prompt, text)

    return {"text": text}


@app.get("/history")
def history():
    items = fetch_history()
    return {"items": items}
