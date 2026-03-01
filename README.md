# Gemini Web App (React + FastAPI + SQLite)

A minimal web app that:
- Takes a prompt in the React UI
- Sends it to a FastAPI backend
- Calls Gemini (Google AI Studio API) and returns text output
- Stores prompt/response into SQLite
- Lets you fetch and display history as a table

## Folder structure

```
app.zip
  |-frontend
  |-backend
  |-README.md
  |-.env
```

## Prerequisites

- Node.js 18+ (recommended)
- Python 3.10+

## 1) Setup environment variables

Edit the root `.env` and set:

- `GEMINI_API_KEY=...`

> You can create an API key from Google AI Studio and enable the Gemini API there.

## 2) Run backend (FastAPI)

```bash
cd backend

python -m venv .venv
source .venv/bin/activate  # (Windows: .venv\Scripts\activate)

pip install -r requirements.txt

# Run (reads ../.env)
uvicorn main:app --reload
```

Backend will start at:
- `http://127.0.0.1:8000`

SQLite DB file is created at:
- `backend/app.db`

### API

- `POST /generate`
  - body: `{ "prompt": "..." }`
  - returns: `{ "text": "..." }`
- `GET /history`
  - returns: `{ "items": [ ... ] }`

## 3) Run frontend (React)

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at:
- `http://127.0.0.1:5173`

## Notes

- No advanced error handling by design (as requested).
- CORS is open for local development simplicity.
