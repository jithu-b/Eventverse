# EventVerse

A production-grade event management platform built for TinkerHub.

## Stack
- Frontend: React (Vite) + plain CSS (glassmorphism, dark/light theme)
- Backend: Flask + SQLAlchemy + SQLite
- Auth: JWT
- Extras: QR-based registration/attendance, live quiz + leaderboard,
  10 mini-games with leaderboards, PDF certificate generation.

## Roles
- Admin
- Organizer
- Participant

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Project Structure
See `/backend` and `/frontend` for modular structure:
- `backend/app/models` — SQLAlchemy models
- `backend/app/routes` — Flask blueprints (REST API)
- `backend/app/services` — QR, PDF, email, scoring logic
- `frontend/src/pages` — route-level pages
- `frontend/src/components` — reusable UI components
- `frontend/src/games` — 10 self-contained mini-games

## Status
🚧 Scaffolding phase — see project roadmap for build order.

## License
Internal TinkerHub project.
# EventVerse

A production-grade event management platform built for TinkerHub — combining
event management, QR-based registration/attendance, live quizzes, ten mini-games
with leaderboards, and auto-generated PDF certificates.

## Stack

**Frontend:** React (Vite) + plain CSS (glassmorphism, dark/light theme, no UI framework)
**Backend:** Flask + SQLAlchemy + SQLite
**Auth:** JWT (Flask-JWT-Extended)

## Roles

- **Admin** — full platform control (users, events, quizzes, games, reports)
- **Organizer** — creates and manages their own events, quizzes, and games
- **Participant** — registers for events, takes quizzes, plays games, earns certificates

## Core Features

- Authentication (Register / Login / Forgot Password)
- Event management with banner upload, schedule, registration limits
- QR-based registration and attendance check-in
- Timed MCQ quizzes with auto-scoring, randomized questions, and a live leaderboard
- Ten mini-games (Click Frenzy, Reaction Test, Falling Blocks, Memory Number,
  Color Match, Whack-a-Mole, Pattern Memory, Balloon Pop, Speed Typing, Puzzle Slider),
  each with instructions, a timer, restart, personal best, and event leaderboard
- Event / quiz / game / overall leaderboards
- Auto-generated PDF certificates
- Admin panel for users, events, quizzes, games, and reports

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # then fill in real secrets
python run.py
```

The API will be available at `http://localhost:5000/api`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure