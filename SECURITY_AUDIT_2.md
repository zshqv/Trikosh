# Security Audit #2 — Secret Scan
**Date:** 2026-06-14
**Auditor:** Claude Code (claude-sonnet-4-6)
**Scope:** Full repository — all tracked files + complete git history (97 commits)
**Type:** Secret and credential exposure scan only. No code changes made.

---

## What Was Scanned

### Current working tree
All tracked files searched for the following patterns:
`NEXT_PUBLIC_`, `DATABASE_URL`, `sk_live_`, `pk_live_`, `sk_test_`, `pk_test_`, `CLERK_`,
`NEON_`, `postgres://`, `postgresql://`, `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD`, `AUTH`

Files explicitly inspected:
- `apps/web/next.config.mjs`
- `apps/web/lib/db.ts`
- `apps/web/env.example`
- `apps/api/db/session.py`
- `infrastructure/scripts/main.py`
- `infrastructure/scripts/config.py`
- `infrastructure/scripts/.env.example`
- `apps/web/package.json`, `apps/web/package-lock.json`

### Git history
- `git log --all --full-history --oneline` — 97 commits reviewed
- `git log --all -p --follow -- "*.env"` — full diff of any .env file ever committed
- `git log --all --diff-filter=A --summary` — files ever added that had sensitive names
- `git log --all -p` diff lines grepped for `sk_live_`, `pk_live_`, `sk_test_`, `pk_test_`,
  `CLERK_SECRET_KEY=sk_`, `postgres://`, `neon.tech`, `DATABASE_URL=postgresql://` with real credentials,
  and hardcoded `password=` assignments

---

## Findings

### FINDING 1 — Hardcoded fallback password in current code
**Severity:** MEDIUM
**Status:** Present in working tree and in git history

**File:** `infrastructure/scripts/main.py`, line 25
```python
password=os.getenv("DB_PASSWORD", "ashu")
```
The string `"ashu"` is a hardcoded fallback password used when `DB_PASSWORD` is not set in the
environment. This was committed in an early commit (f725495) and remains in the current file.

**Git history:** `git log --all -p` confirms `+DB_PASSWORD = "ashu"` and
`+password=os.getenv("DB_PASSWORD", "ashu")` both appear as added lines in history.

**Risk assessment:** `"ashu"` appears to be a local development credential (PostgreSQL running
on localhost). No evidence it is a production/Neon credential. No external connection string
accompanies it. However, it is committed permanently into the git object store and represents
a credential management antipattern.

**Required action:**
1. Replace default `"ashu"` with `""` (empty string) in `main.py` line 25.
2. If this password was ever used on a remotely accessible database, rotate the database user credential.
3. If history rewrite is desired, use `git filter-repo --replace-text` or BFG Repo Cleaner.

---

### FINDING 2 — Hardcoded localhost fallback connection string
**Severity:** LOW
**Status:** Present in working tree

**File:** `apps/api/db/session.py`, line 5
```python
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://localhost/trikosh")
```
Fallback points to a local PostgreSQL instance with no credentials. No password is embedded.
This is a developer convenience default, not a live credential. Risk is low: it fails silently in
production rather than failing loudly, but exposes nothing.

**Recommended action:** Change fallback to `""` and add an explicit guard that raises if
`DATABASE_URL` is unset (mirrors the pattern already used in `apps/web/lib/db.ts:6-8`).

---

### FINDING 3 — debug-env route in git history (resolved)
**Severity:** LOW (resolved in history)
**Status:** Deleted — no longer in current code

Commit f725495 introduced `apps/web/app/api/debug-env/route.ts`. The route returned:
```json
{ "DATABASE_URL_present": true, "DATABASE_URL_preview": "postgresql://neondb_own...", "NODE_ENV": "production" }
```
The password portion was masked (`***`). The route was listed in `middleware.ts` as an
**auth-protected** path (not in the public routes list), so it required an authenticated Clerk
session to access. It was explicitly deleted in commit a2ba7a5 before production launch.

**Risk assessment:** The route never exposed credentials in plaintext. The masked preview
(first ~60 chars with password replaced by `***`) could have revealed the Neon host and database
name to any authenticated user. No action required beyond confirming deletion — confirmed.

---

### FINDING 4 — DATABASE_URL prefix logged to Vercel function logs (resolved)
**Severity:** LOW (resolved in history)
**Status:** Removed

Git history for `apps/web/lib/db.ts` shows that an early version contained:
```typescript
console.log('[db.ts] DATABASE_URL present:', !!connectionString)
console.log('[db.ts] DATABASE_URL starts with:', connectionString?.substring(0, 30))
```
These logs went to server-side Vercel function logs (not the browser). The first 30 characters
of the connection string (host + partial database name, not the password) were logged. Removed
in commit f5a2bce.

**Risk assessment:** Server-side logs with partial host info, not client-exposed. Low risk.
Confirmed removed.

---

### FINDINGS THAT WERE NOT PRESENT (CONFIRMED CLEAN)

| Check | Result |
|---|---|
| `.env.local` ever committed | ✅ Never committed — confirmed by `git ls-files` and full history scan |
| `.env` ever committed | ✅ Never committed |
| `CLERK_SECRET_KEY` with real value | ✅ Not found — env.example uses placeholder `sk_test_your_secret_key_here` only |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` with real value | ✅ Not found in any tracked file or history |
| Neon connection string with real credentials | ✅ Not found — all `postgres://` instances use placeholder text |
| `sk_live_` or `pk_live_` Clerk production keys | ✅ Not present in any commit |
| Hardcoded API keys for FMP or other external services | ✅ Not present in tracked files |
| `apps/web/lib/db.ts` hardcoded credentials | ✅ Clean — uses `process.env` throughout, empty-string fallback only |
| `infrastructure/scripts/config.py` | ✅ Clean — `DB_PASSWORD = os.getenv("DB_PASSWORD", "")` uses empty string default |
| `next.config.mjs` hardcoded values | ✅ No secrets — only domain names and CSP config |
| `package.json` / `package-lock.json` | ✅ No secrets — only package names and registry URLs |

---

## Verdict

**NEEDS ACTION**

Two items require remediation:

| # | File | Issue | Priority |
|---|---|---|---|
| 1 | `infrastructure/scripts/main.py:25` | Hardcoded fallback password `"ashu"` in current code and git history | MEDIUM |
| 2 | `apps/api/db/session.py:5` | Hardcoded localhost fallback — fails silently rather than loudly | LOW |

The frontend (`apps/web/`) is clean. No production credentials were found in any commit.
The `"ashu"` password is almost certainly a local development credential only, but it is
permanently stored in the git object store and violates the principle of no hardcoded credentials.

### Recommended next steps (in priority order)

1. **Fix `main.py:25`** — change `"ashu"` default to `""`. One line change.
2. **Rotate the `ashu` DB user password** if this account exists on any remotely accessible server.
3. **Fix `session.py:5`** — add a guard: `if not DATABASE_URL: raise RuntimeError("DATABASE_URL not set")`.
4. **Consider BFG / git-filter-repo** to purge `"ashu"` from history if this repo is or will be public.
   Note: this requires a force-push and all collaborators must re-clone.
5. **Enable GitHub secret scanning** on the repository (Settings → Security → Secret scanning)
   for ongoing automated detection.
