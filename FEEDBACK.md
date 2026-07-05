# Community Feedback

## Issue #1 — Repository Hygiene (raised by aniket-kes, June 2026)

**Concern:** Critical and internal files (.md skill files, .gitignore misconfigurations) were publicly present in the repository, posing security audit risks.

**Action Taken:**
- Updated .gitignore to exclude all internal Claude Code skill files (.claude/, SKILL.md, agent.md)
- Removed cached references to internal tooling files from git tracking
- Ensured .env and environment variable files are explicitly excluded

**Status:** Resolved ✅

---

## Issue #2 — [Audit] Codebase Issues — Architecture, Data Layer, and Consistency Problems (raised June 2026)

**Status:** Resolved ✅

Sub-issues and actions taken:

1. **Sector enum mismatch** — The DB ENUM already used `'AI & Technology'` correctly. Fixed a stale comment in `schema.sql` line 114 and stale references in `CLAUDE.md` and `ROADMAP.md` that still said `'Artificial Intelligence'`. No code change required.

2. **Replace mock data with live yfinance data** — Created `infrastructure/scripts/yfinance_etl.py` using the already-present `yfinance==1.3.0` dependency. Marked `buildCardData()` `@deprecated` in `app/companies/page.tsx`. Removed all placeholder financial values (fake P/E 16.0x, ROE 12%) for companies not in `MOCK_CARDS` — UI now shows `'—'` instead of fabricated numbers.

3. **Dark mode toggle** — No dead `.dark {}` CSS existed (CLAUDE.md note was stale). Added `[data-theme="light"]` CSS block to `globals.css` and a Sun/Moon toggle button to the layout Navbar, wired to `localStorage` and `document.documentElement.dataset.theme`. Defaults to dark.

4. **Root package.json** — Added `name: "trikosh"`, `workspaces: ["apps/web"]`, and `scripts` for `dev`, `build`, `lint`. Python packages managed separately via pip.

5. **apps/api placeholder** — `apps/api/` was not empty; it had a full FastAPI app with a working `/health` endpoint. Fixed the contradiction in docs: added `apps/api/README.md` and updated `CLAUDE.md` from "Empty placeholder" to "FastAPI backend (WIP)".

6. **Standardise design tokens** — Expanded `lib/tokens.ts` (added missing tokens, fixed broken `font.serif` → `font.display`). Replaced all raw `var(--token)` inline strings in `DataAssetCard`, `DeltaLabel`, `TickerBadge`, `MetaBadge`, `RatioRail`, `MetaStrip`, and `SectorPill` with `tokens.xxx` imports. `lib/tokens.ts` is now the single source of truth.

---

## Issue #3 — Light Mode Toggle Non-Functional (raised by ajay9326, July 2026)

**Concern:** The light mode toggle was non-functional — clicking it did not switch the interface, and the UI remained unchanged.

**Action Taken:**
- Root cause: the toggle (added while resolving Issue #2) was wired to a `data-theme="light"` CSS block, but most component colors were hardcoded to dark values rather than theme-aware tokens, so the switch had no visible effect.
- Rather than retrofit every hardcoded color to a theme-aware token under time pressure, removed the toggle entirely (`Navbar.tsx`: state, `localStorage` persistence, both desktop and mobile buttons) and standardized on dark-only.
- Left the dead `[data-theme="light"]` CSS block in `globals.css` for now — harmless, revisit only if light mode is reintroduced.

**Status:** Resolved ✅
