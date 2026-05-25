# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

All frontend work happens inside `apps/web`. Run every command from that directory.

```bash
# Development
npm run dev          # Next.js dev server on localhost:3000

# Build and lint
npm run build        # Production build (also type-checks)
npm run lint         # ESLint
```

Python data pipeline (`infrastructure/scripts/`):

```bash
cd infrastructure/scripts
pip install -r requirements.txt
cp .env.example .env          # fill in DB creds + FMP_API_KEY
python pipeline.py            # fetch → calculate → load all 50 companies
```

Database schema:

```bash
# Against a running PostgreSQL instance:
psql -U <user> -d trikosh -f infrastructure/db/schema.sql
```

---

## Architecture

### Monorepo layout

```
apps/web/               Next.js 14 frontend (the active product)
apps/api/               Empty placeholder — not yet built
infrastructure/
  db/schema.sql         PostgreSQL schema (6 tables)
  scripts/              Python ETL pipeline (FMP API → PostgreSQL)
packages/               Empty placeholders for future shared packages
data/                   raw / processed / schemas — empty, populated by pipeline
```

### Frontend (`apps/web`)

**Routing and pages**

All pages are App Router (`app/`). Every page that needs interactivity is `'use client'`. The pattern is intentionally flat — no nested layouts per route, no server components with data fetching. Pages currently consume `lib/mockData.ts` directly.

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing — hero, stats, feature cards, preview grid |
| `/companies` | `app/companies/page.tsx` | Directory of all 50 companies, filterable |
| `/companies/[ticker]` | `app/companies/[ticker]/page.tsx` | Financials / Ratios / Peers / Overview tabs |
| `/compare` | `app/compare/page.tsx` | Peer comparison with Recharts |
| `/sectors` | `app/sectors/page.tsx` | Sector frameworks from `SECTOR_SNAPSHOTS` |
| `/glossary` | `app/glossary/page.tsx` | |
| `/research` | `app/research/page.tsx` | |

**Auth (Clerk)**

Public routes defined in `middleware.ts`: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/companies(.*)`, `/companies(.*)`. Everything else requires Clerk auth. `UserButton` lives in the Navbar.

**Data layer — current state**

`lib/db.ts` is a stub (exports nothing). All pages pull from `lib/mockData.ts`, which exports:
- `COMPANIES` — all 50 company objects (`Company[]`)
- `MOCK_CARDS` — 9 fully-populated `CardData` objects (3 per sector)
- `GLOSSARY_TERMS`, `SECTOR_SNAPSHOTS`, `RESEARCH_KITS`

The `buildCardData(ticker)` helper in several pages fills the remaining 21 companies with sector-default placeholder values when `MOCK_CARDS` has no entry for that ticker.

**Data layer — intended state**

When the PostgreSQL pipeline is running, `lib/db.ts` should expose a `pg` or Prisma client. API routes (`app/api/companies/`, `app/api/companies/[ticker]/`) are already wired and should be the data boundary — pages should fetch from these routes rather than importing `mockData` directly.

**Design system**

All styling is inline CSS using CSS custom properties — Tailwind utility classes are **not** used in components (the library is installed for the `@tailwind base/components/utilities` reset in `globals.css` only).

CSS variables are defined in `app/globals.css`. TypeScript references live in `lib/tokens.ts` (not widely used — inline `var(--token)` strings are the norm):

| Token group | Examples |
|---|---|
| Backgrounds | `--bg-base`, `--bg-surface-1`, `--bg-surface-2`, `--bg-muted` |
| Text | `--text-primary`, `--text-secondary`, `--text-tertiary` |
| Accent | `--accent-primary` (#2563EB), `--accent-data`, `--accent-archive` |
| Delta | `--delta-pos` (green), `--delta-neg` (red), `--delta-warn` (amber) |
| Typography | `--font-serif` (Playfair Display), `--font-sans` (Inter), `--font-mono` (Geist Mono) |
| Borders | `--border-rest` (0.5px solid rgba(0,0,0,0.08)), `--border-hover` (1px solid #2563EB) |

Dark mode is defined (`.dark {}` in globals.css) but not toggled by any UI.

**Component conventions**

- `components/layout/` — Navbar, Footer, TrustStrip (used in root layout)
- `components/ui/` — DataAssetCard, TickerBadge, DeltaLabel, Sparkline
- `components/data/` — SectorPill, RatioRail, MetaStrip
- `lib/utils.ts` — `formatPercent`, `formatCurrency`, `formatMultiple`, `formatDelta`, `getDeltaDirection`

`DataAssetCard` is the primary data display component. It takes a `CardData` object and renders a four-zone card (header, core metrics, ratio rail, meta strip). Used on the homepage preview, `/companies`, and `/compare`.

**Charts**

Recharts is the only charting library. Current usage: `LineChart` in `/compare`. The XAxis/YAxis/Tooltip are styled to match the design system using explicit `tick` font/fill props (not className).

### Database schema

Six PostgreSQL tables, all anchored to `companies` via `company_id`:

```
companies            → master directory (ticker, sector, exchange, etc.)
income_statements    → P&L: revenue through EPS, 5-year history
balance_sheets       → assets, liabilities, equity
cash_flow_statements → CFO / CFI / CFF, FCF computed column
financial_ratios     → pre-computed profitability / leverage / valuation ratios
market_data          → share price, market cap, EV, analyst consensus
```

All monetary columns are `NUMERIC(20,3)` — exact decimal arithmetic. All timestamps are `TIMESTAMPTZ`. ENUM types: `sector_type`, `period_type`, `unit_type`, `consensus_rating_type`. Note: the DB schema uses `'Artificial Intelligence'` as the sector enum value; the frontend TypeScript type uses `'AI & Technology'`. These will need to be reconciled when the DB is wired.

### Python ETL pipeline

`infrastructure/scripts/` fetches from the **Financial Modeling Prep (FMP) API**. Requires `FMP_API_KEY` in `.env`. Processing order per company: profile → market data → income / balance / cashflow → computed ratios → upsert all into PostgreSQL via `psycopg2`. The pipeline is idempotent (`ON CONFLICT DO UPDATE` in `loader.py`). Rate-limited to 1 second per company.
