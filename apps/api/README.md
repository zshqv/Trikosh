# apps/api — Trikosh FastAPI Backend

> **Status: In development — not production-ready.**
> The Next.js frontend (`apps/web`) currently serves data directly from
> PostgreSQL via its own API routes (`app/api/`). This FastAPI layer is
> a work-in-progress that will eventually serve as the primary backend.

## What is here

A FastAPI application (`main.py`) that exposes the Trikosh financial data
through a versioned REST API at `/api/v1/`.

| Endpoint prefix     | Router file              | Status         |
|---------------------|--------------------------|----------------|
| `GET /health`       | `main.py`                | Working        |
| `/api/v1/companies` | `routers/companies.py`   | WIP (mock data)|
| `/api/v1/sectors`   | `routers/sectors.py`     | WIP            |
| `/api/v1/financials`| `routers/financials.py`  | WIP            |
| `/api/v1/ratios`    | `routers/ratios.py`      | WIP            |
| `/api/v1/search`    | `routers/search.py`      | WIP            |
| `/api/v1/kits`      | `routers/kits.py`        | WIP            |

The `/health` endpoint is fully operational and returns:
```json
{ "status": "ok", "version": "1.0.0" }
```

All other endpoints currently serve static mock data while the PostgreSQL
connection and SQLAlchemy models are being wired up.

## Running locally

```bash
cd apps/api
pip install -r requirements.txt
cp ../../infrastructure/scripts/.env .env   # copy DB creds
uvicorn main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

## Architecture

- **FastAPI** + **SQLAlchemy 2.0** (async) + **asyncpg** driver
- **Pydantic v2** schemas in `schemas/`
- **Alembic** for future migrations
- Database session managed in `db/session.py`
