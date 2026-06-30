# Security Notes

This document records standing security decisions, deferred risks, and
compliance considerations for the Trikosh infrastructure. It is intended
for engineers and auditors — not end users.

---

## CSRF Protection

**Current status:** Not implemented. Not currently exploitable.

Trikosh's entire API surface is read-only (HTTP GET). CSRF attacks require
a state-mutating request (POST, PUT, DELETE, PATCH) that the browser will
send cross-origin using the victim's session cookies. Because no such
endpoints exist today, CSRF is not an active threat.

**Required before shipping any mutation endpoint:**

Before adding routes that mutate state — user portfolios, watchlists,
saved comparisons, auth-gated writes of any kind — one of the following
must be in place:

1. **CSRF tokens** — issue a per-session or per-form token (e.g. via the
   `csrf` package for Next.js API routes) and validate it server-side on
   every non-GET request.
2. **`SameSite=Strict` or `SameSite=Lax` cookies** — Clerk already sets
   session cookies; confirm the `SameSite` attribute is not `None` before
   relying on this as a CSRF defence.
3. **Custom request header check** — require a non-standard header (e.g.
   `X-Requested-With: XMLHttpRequest`) that browsers do not send in simple
   cross-origin requests.

Do not add POST/PUT/DELETE routes without revisiting this section first.

---

## Yahoo Finance / yfinance Terms of Service

**Current status:** In use. Compliance depends on use-case classification.

Trikosh fetches financial data via [yfinance](https://github.com/ranaroussi/yfinance),
an open-source Python library that retrieves publicly available data from
Yahoo Finance. Yahoo Finance's Terms of Service explicitly restrict
**automated, commercial use** of their data.

Trikosh's current position — open-source, educational, non-commercial,
MIT-licensed — is consistent with the spirit of non-commercial research
access. The project README and DISCLAIMER.md both document this clearly.

**Required review before any monetisation:**

If Trikosh introduces paid tiers, advertising, a data API with SLA, or
any commercial arrangement that generates revenue from the displayed
financial data, the data licensing position must be reviewed before launch:

1. **Review Yahoo Finance ToS** for current restrictions on automated
   data retrieval and commercial redistribution.
2. **Evaluate alternative licensed data sources** — Financial Modeling
   Prep (FMP), Polygon.io, Refinitiv, Bloomberg — for commercial tiers.
3. **Obtain legal review** if there is any ambiguity about whether
   Trikosh's use case qualifies as commercial under the applicable ToS.

Do not launch a monetised product tier while still sourcing data
exclusively from yfinance without completing this review.

---
