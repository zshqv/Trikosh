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
