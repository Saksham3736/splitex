## SplitEX Frontend (Next.js)

Frontend for SplitEX built with **Next.js (App Router)**, **Tailwind**, **shadcn/ui**, **TanStack Query**, **Zustand**, and **Socket.IO**.

## Requirements
- Node.js (LTS recommended)
- Backend running (default: `http://localhost:5000/api`)

## Environment variables
Create a `.env.local` in `frontend/`:

```bash
# REST API base (from docs/api-spec.md)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Socket.IO server base (defaults to API_BASE_URL without /api)
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Getting started
Install deps and run dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts
- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run lint`: eslint
