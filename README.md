# SplitEX

SplitEX is a full-stack expense sharing application for groups. It helps users create groups, add shared expenses, compute balances, and optimize settlements to minimize the number of transactions required.

## Table of Contents

- Features
- Tech Stack
- Repository Structure
- Prerequisites
- Quick Start
- Environment Variables
- Running the Services
- API Overview
- Common Development Issues
- Scripts
- Future Improvements
- Contributing
- License

## Features

- JWT-based authentication with secure password hashing.
- Group-based expense management with member controls.
- Multiple split modes (equal, exact, percentage).
- Balance netting logic and optimized settlement suggestions.
- Notification workflow for relevant user actions.
- UPI link generation for payment handoff.
- Optional OCR microservice for receipt scanning.

## Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- TanStack Query
- Zustand

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcryptjs

**Additional service**
- Python FastAPI OCR service

## Repository Structure

```text
SplitEX/
|-- frontend/              # Next.js frontend app
|-- backend/               # Node.js/Express API
|-- python-ocr-service/    # OCR microservice
|-- docs/                  # Documentation and specs
|-- shared/                # Shared assets/config
|-- .github/               # CI/CD workflows and templates
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- MongoDB (local or Atlas)
- Python 3.10+ (only if using OCR service)

## Quick Start

1) Clone the repository:

```bash
git clone <your-repo-url>
cd SplitEX
```

2) Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

3) Configure environment variables (see section below).

4) Run backend and frontend in separate terminals.

## Environment Variables

### Backend (`backend/.env`)

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
```

Notes:
- `JWT_SECRET` is required; backend exits if it is missing.
- If `PORT` is busy, backend auto-retries next ports (`3001`, `3002`, ...).

### Frontend (`frontend/.env.local`)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# Optional:
# NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

Important:
- If backend started on another port (for example `3003`), update:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:3003/api`
  - `NEXT_PUBLIC_SOCKET_URL=http://localhost:3003` (if used)

## Running the Services

Run each service in a separate terminal.

### 1) Start backend API

```bash
cd backend
npm run dev
```

Expected logs include:
- `Server is running on port ...`
- `API root: http://localhost:<port>/api`

### 2) Start frontend app

```bash
cd frontend
npm run dev
```

Open:
- App UI: [http://localhost:3000](http://localhost:3000) (or next available frontend port)

### 3) Optional OCR service

```bash
cd python-ocr-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## API Overview

Base path: `/api`

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/user/me` - Fetch current user profile
- `PATCH /api/user/me` - Update profile
- `GET /api/groups` - List groups
- `POST /api/groups` - Create group
- `POST /api/expense` - Add expense
- `POST /api/settlements/optimize` - Get optimized settlement plan
- `GET /api/notifications` - List notifications
- `POST /api/payment/upi-link` - Generate UPI link

## Common Development Issues

### Port conflicts (`EADDRINUSE`)

If backend port `3000` is already in use:
- backend now automatically tries the next ports.
- use the port printed in backend logs and update frontend API URL accordingly.

### UI not showing and JSON appears instead

If you open backend URL directly (`/api`), JSON response is expected.  
Open frontend URL (`http://localhost:3000`) to view the app UI.

### Frontend says `'next' is not recognized`

Run:

```bash
cd frontend
npm install
```

## Scripts

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start in production mode

### Frontend
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build production bundle
- `npm run start` - Serve production bundle
- `npm run lint` - Run ESLint

## Future Improvements

- Add Docker setup for one-command local startup.
- Add full integration test suite.
- Add CI pipeline checks for frontend + backend + OCR.
- Add deployment docs for Vercel + Render/Railway.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request

## License

This project is released under the MIT License (or your preferred license).
