# flyrank-be-04

BE-04: Containerize your stack — FlyRank AI Internship (Backend AI Engineering)

## What this is

Node.js HTTP server connected to a PostgreSQL database running in Docker. The full stack starts with one command.

## Stack

- Node.js (built-in `http` module + `pg` for Postgres)
- PostgreSQL 16 (Alpine, running in Docker with a named volume)
- Docker Compose (orchestrates app + db with health checks)

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /health | Returns server status + DB connectivity check |
| GET | /hello | Inserts a greeting into Postgres and returns the row |
| GET | /greetings | Returns all greetings from Postgres |

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/TEJSARISA/flyrank-be-04.git
cd flyrank-be-04

# 2. Copy env file
cp .env.example .env

# 3. Start everything
docker compose up
```

App runs on http://localhost:3000

## Test with curl

```bash
curl http://localhost:3000/health
# {"status":"ok","db":"connected"}

curl http://localhost:3000/hello
# {"id":1,"message":"Hello, World!","created_at":"..."}

curl http://localhost:3000/greetings
# [{"id":1,"message":"Hello, World!","created_at":"..."}]
```

## Persistence check

To prove data survives a container restart:

```bash
# 1. Hit /hello to insert a row
curl http://localhost:3000/hello

# 2. Stop and remove the containers (NOT the volume)
docker compose down

# 3. Start again
docker compose up

# 4. Check greetings - data is still there
curl http://localhost:3000/greetings
```

Data persists because Postgres uses a named Docker volume (`pgdata`). The volume is NOT deleted by `docker compose down` — only by `docker compose down -v`.

## Architecture decision

The connection string is managed via `.env` (gitignored). A `.env.example` is committed so anyone cloning the repo knows exactly what variables to set. The Postgres repo replaces the in-memory store — the HTTP routes (`/hello`, `/health`) are unchanged.
