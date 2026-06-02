# LakeBridge

One Postgres endpoint. Two worlds of data.

LakeBridge is a Postgres-native lakehouse access platform that lets your team query Postgres tables and S3/R2 lake data from a single SQL endpoint — without moving data, duplicating pipelines, or blocking production.

---

## Overview

- **Single SQL endpoint** — standard Postgres wire protocol, no new tools
- **Isolated workers** — lake scans run outside your production database
- **Parquet + Iceberg** — S3, R2, MinIO support out of the box
- **Query limits & cost controls** — bytes scanned, timeout, per-user concurrency
- **Audit logs** — every query logged with full metadata
- **Multi-layer cache** — result cache, metadata cache, hot partition cache
- **Dark/Light theme** — full theme toggle support
- **Docs & Blog** — built-in `/docs` and `/blog` pages

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion, next-themes |
| Backend | FastAPI (Python 3.11+), Motor (async MongoDB) |
| Database | MongoDB |
| Email | Resend (optional, graceful fallback) |

---

## Project Structure

```
/
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # Navbar, Hero, Features, Architecture, etc.
│   │   ├── pages/         # DocsPage, BlogPage
│   │   └── App.js
│   ├── public/
│   ├── .env.example
│   └── package.json
├── backend/               # FastAPI API
│   ├── server.py          # Main API + waitlist endpoint
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+, Python 3.11+, MongoDB, `yarn`

### 1. Clone

```bash
git clone https://github.com/AbhiYadv/LakeBridge.git
cd LakeBridge
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # fill in MONGO_URL, DB_NAME
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # set REACT_APP_BACKEND_URL=http://localhost:8001
yarn install
yarn start
```

App → `http://localhost:3000` | API → `http://localhost:8001/api`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | MongoDB database name |
| `CORS_ORIGINS` | No | Allowed origins (default: `*`) |
| `RESEND_API_KEY` | No | Resend key for waitlist emails |
| `SENDER_EMAIL` | No | From address for confirmation emails |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_BACKEND_URL` | Yes | Full URL of the backend |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Health check |
| POST | `/api/waitlist` | Join the waitlist (email) |
| GET | `/api/waitlist/count` | Signup count |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/docs` | Extension quickstart + architecture |
| `/blog` | Blog and changelog |

---

## Optional: Email (Resend)

Add to `backend/.env`:
```
RESEND_API_KEY=re_your_key_here
SENDER_EMAIL=noreply@yourdomain.com
```
Without a key the API works normally — emails are silently skipped.

---

## License

MIT — Built for Postgres teams.
