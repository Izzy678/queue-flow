# QueueFlow Monorepo

A queue management SaaS platform with a Next.js landing page and NestJS API backed by PostgreSQL.

## Structure

```
queueflow/
├── apps/
│   ├── web/          # Next.js 16 landing page
│   └── api/          # NestJS REST API
├── packages/
│   └── shared/       # Shared TypeScript types (placeholder)
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## Quick start

```bash
npm install
npm run db:up
cp apps/api/.env.example apps/api/.env
npm run dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:3001/api/health

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web + API concurrently |
| `npm run dev:web` | Start Next.js only |
| `npm run dev:api` | Start NestJS only |
| `npm run build` | Build API and web |
| `npm run db:up` | Start Postgres via Docker |
| `npm run db:down` | Stop Postgres |
