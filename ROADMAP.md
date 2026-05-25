# Trikosh — Product Roadmap

> This document tracks where Trikosh has been, where it is now, and where it is going.
> It is updated with every significant release. Last updated: May 2026.

---

## Principles That Guide This Roadmap

Every item on this roadmap is evaluated against one question: **does it help a student do better financial research?**

Features that pass: structured data, clear methodology, peer comparison tools, research frameworks, export capabilities.  
Features that don't: gamification, social feeds, AI-generated opinions, stock screeners, trading signals.

Trikosh is infrastructure. It is built to be useful, honest, and open — not to be addictive.

---

## Current State — v0.1.0 *(Pre-Launch)*

What is built and working today.

### ✅ Completed

| Area | Detail |
|---|---|
| **Repository** | Open-source on GitHub under MIT License |
| **Documentation** | README, METHODOLOGY, CONTRIBUTING, CODE_OF_CONDUCT, DISCLAIMER |
| **Database schema** | 6-table PostgreSQL schema — `companies`, `income_statements`, `balance_sheets`, `cash_flow_statements`, `financial_ratios`, `market_data` |
| **ETL pipeline** | Python pipeline (`pipeline.py`) — fetches from Financial Modeling Prep API, computes 15 ratios, upserts to PostgreSQL. Supports `--ticker` flag for single-company runs |
| **Company coverage** | 49 companies across 5 sectors — Financial Services, AI & Technology, Healthcare, Consumer & Retail, Digital Platforms & E-Commerce |
| **Frontend — routing** | All pages live: `/`, `/companies`, `/companies/[ticker]`, `/compare`, `/sectors`, `/glossary`, `/research` |
| **Frontend — design** | Premium dark finance aesthetic. CSS custom-property design system. No Tailwind runtime dependency |
| **Frontend — components** | `DataAssetCard`, `TickerBadge`, `DeltaLabel`, `Sparkline`, `RatioRail`, `MetaStrip`, `SectorPill` |
| **Auth** | Clerk authentication. Public routes defined. `UserButton` in Navbar |
| **Peer comparison** | Side-by-side company comparison with Recharts `LineChart` |
| **Glossary** | Financial terms library |
| **Research frameworks** | Sector research starter kits |
| **Mock data layer** | 9 companies fully populated (`MOCK_CARDS`). 40 companies served via sector-default `buildCardData()` fallback |

### 🔄 In Progress

| Area | Detail |
|---|---|
| **DB → frontend connection** | `lib/db.ts` is a stub. API routes (`/api/companies`, `/api/companies/[ticker]`) exist but serve mock data. Real PostgreSQL connection pending |
| **Full pipeline run** | Pipeline built and tested. Full 49-company data load to production PostgreSQL pending |
| **Sector enum reconciliation** | DB schema uses `'Artificial Intelligence'`; frontend TypeScript uses `'AI & Technology'`. Needs alignment before live data |
| **Deployment** | Vercel configuration in place. Public deployment pending |

---

## v0.2.0 — Live Data *(Next milestone)*

The primary goal of v0.2 is replacing mock data with real data end-to-end.

### Planned

- **PostgreSQL connection live** — `lib/db.ts` wired to production database. All pages fetch from API routes, not `mockData.ts`
- **Full pipeline run** — All 49 companies loaded: 5 years × income + balance sheet + cash flow + 15 ratios + market data
- **Sector enum fix** — Reconcile `'Artificial Intelligence'` (DB) ↔ `'AI & Technology'` (frontend). Single source of truth
- **API routes validated** — `/api/companies` and `/api/companies/[ticker]` returning real data with correct types
- **Error states** — Graceful handling when data is missing or null (common for non-US tickers like `.NS`)
- **Dark mode toggle** — `.dark {}` already defined in `globals.css`. Wire the UI switch
- **Vercel production deployment** — Public URL live

**Target: project goes public at v0.2.0.**

---

## v0.3.0 — Export & Research Workflow

Making Trikosh useful in a real student research workflow, not just as a reference site.

### Planned

- **PDF export** — Single-company summary, comparison view, and ratio analysis exportable as formatted PDF
- **Excel export** — Financial statements and ratio history downloadable as structured `.xlsx`
- **Research note template** — Blank structured template a student can download and populate
- **Search** — Full-text search across all 49 companies by name, ticker, and sector
- **Watchlist** — Save and monitor a personal list of companies (Clerk user-linked)
- **Data timestamps** — Surface "last pipeline run" date on each company page so users know data freshness
- **Mobile-responsive audit** — All pages verified on 375px / 390px viewport widths

---

## v0.4.0 — Data Quality & Automation

Making the data layer reliable enough that users can trust it without checking everything manually.

### Planned

- **GitHub Actions pipeline** — Weekly automated data refresh for all 49 companies. No manual `python pipeline.py` required
- **Data quality monitoring** — Flag anomalous values (revenue drop > 50% year-over-year, null ratio on a normally populated field). Surface warnings on company pages
- **Restatement tracking** — `is_restated` column already in schema. Pipeline to detect and flag when prior-year figures are revised
- **SEC EDGAR integration** — Direct pull from `data.sec.gov` for US-listed companies. Reduces dependency on FMP API. Higher data fidelity
- **Companies House / ESMA integration** — European company filing access for non-US companies

---

## v0.5.0 — Community & Contributors

Opening Trikosh for meaningful contribution beyond code.

### Planned

- **Data error reporting** — Inline "Report a data issue" button on every company page. Creates a structured GitHub issue automatically
- **Contributor company pages** — Community-maintained qualitative overlays: business description, key risks, competitive position
- **Research note showcase** — Public gallery of student equity research reports written using Trikosh. Named attribution
- **Finance club programme** — Structured onboarding for university finance clubs. Shared watchlists, research assignments, mentor pairing
- **Translation initiative** — METHODOLOGY.md and research guides translated into Hindi, Spanish, French, Mandarin

---

## v1.0.0 — The Full Platform

When every feature listed in the original vision is working and stable.

### Definition of done for v1.0

- [ ] All 49 companies fully loaded with 5-year real data
- [ ] Live DB connection — zero mock data in production
- [ ] PDF and Excel export working
- [ ] Search working
- [ ] Mobile-responsive
- [ ] Automated weekly pipeline refresh via GitHub Actions
- [ ] Data quality monitoring active
- [ ] Research note template published
- [ ] SEC EDGAR integration live
- [ ] 100+ students actively using the platform (verified via Clerk analytics)
- [ ] At least one university finance club using Trikosh as their primary research tool

---

## v1.1.0 — Intelligence Layer *(Tentative)*

Helping students do more with the data they already have access to.

### Planned

- **DCF model helper** — Guided discounted cash flow template pre-populated with Trikosh data. Student fills assumptions
- **Comparables screener** — Find the 5 most similar companies to any given company based on sector, size, and margin profile
- **Earnings season tracker** — Calendar of upcoming earnings for covered companies. Post-earnings data update within 24 hours
- **Custom ratio builder** — Define your own ratio from available line items. Save it to your profile
- **Dividend history** — 5-year dividend per share and payout ratio history. Yield charted against price

---

## v2.0.0 — Scale *(Long-term)*

Expanding Trikosh from 49 companies to a genuinely comprehensive student research database.

### Planned

- **Coverage: 200+ companies** across 12+ sectors
- **Emerging market focus** — Deeper coverage of Indian, Southeast Asian, and African listed companies that existing platforms underserve
- **Earnings transcript library** — Structured, searchable Q&A summaries from earnings calls for all covered companies
- **Research workflow automation** — Generate a structured research briefing (not a recommendation — a framework of key questions) for any covered company at one click
- **API access** — Public read-only API for researchers and developers. Rate-limited, free tier available
- **Institutional partnerships** — Formal agreements with university finance departments to use Trikosh as curriculum infrastructure

---

## What Trikosh Will Never Do

These are explicit non-goals, documented so the project does not drift.

- Generate stock recommendations or buy/sell ratings
- Provide real-time market data or live pricing
- Monetise through advertising or data resale
- Paywall core research functionality
- Replace reading primary source documents (10-K, 20-F, Annual Reports)

---

## How to Influence This Roadmap

This is an open-source project. The roadmap is not fixed.

If you are a student who wants a feature that would genuinely improve your research workflow — open an issue. If you are a developer who wants to build something on this list — read `CONTRIBUTING.md` and submit a PR. If you are a university finance club who wants features built for your specific programme — reach out directly.

**GitHub Issues:** [github.com/zshqv/trikosh/issues](https://github.com/zshqv/trikosh/issues)  
**Maintainer:** Ashutosh Tripathi ([@zshqv](https://github.com/zshqv))

---

> *"A roadmap is a commitment to direction, not to dates. The direction is clear: make financial research accessible to every student, regardless of where they started."*

---

*Trikosh — Open-source financial research infrastructure*  
*MIT License · github.com/zshqv/trikosh*
