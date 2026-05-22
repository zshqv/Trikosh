# Contributing to Trikosh

Thank you for your interest in contributing to Trikosh. This is a student-built, open-source financial research platform, and every contribution — whether a bug report, a documentation fix, or a new feature — matters.

Please read this guide before opening an issue or submitting a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Submitting Issues](#submitting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Code Style](#code-style)
- [Original Work Requirement](#original-work-requirement)
- [Reporting Security Vulnerabilities](#reporting-security-vulnerabilities)

---

## Code of Conduct

All contributors are expected to follow the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating.

---

## Submitting Issues

### Before opening an issue

- Search existing issues (open and closed) to avoid duplicates.
- Check the [README](./README.md) and documentation first.

### Issue labels

When opening an issue, apply the most appropriate label:

| Label | Use for |
|---|---|
| `bug` | Something is broken or behaving incorrectly |
| `data` | Incorrect, missing, or stale financial data |
| `enhancement` | A new feature or improvement to existing behaviour |
| `documentation` | Gaps or errors in docs, README, or comments |
| `question` | A question about usage or architecture |
| `good first issue` | A maintainer-tagged issue suitable for first-time contributors |
| `security` | **Do not use — report privately instead (see below)** |

### Issue format

Every bug report must include:

1. **Description** — what is happening vs. what you expected
2. **Steps to reproduce** — exact steps, including any relevant URLs or tickers
3. **Environment** — browser, OS, Node version if relevant
4. **Screenshots or logs** — if applicable

Feature requests must include:

1. **Problem statement** — what user need does this address
2. **Proposed solution** — what you want to see built
3. **Alternatives considered** — other approaches you evaluated

---

## Submitting Pull Requests

### Before you start

- For non-trivial changes, **open an issue first** and get maintainer alignment before writing code.
- Fork the repository and work on a feature branch — never push directly to `main`.
- Keep pull requests focused. One PR = one logical change.

### Branch naming

```
feat/short-description
fix/short-description
docs/short-description
data/short-description
refactor/short-description
```

### Pull request description requirements

Every PR must include:

1. **Summary** — what this PR does and why (2–5 sentences)
2. **Linked issue** — reference the issue it resolves with `Closes #<number>`
3. **Type of change** — bug fix / new feature / refactor / documentation / data update
4. **Testing done** — describe how you tested the change locally
5. **Screenshots** — for any UI changes, before and after screenshots are required
6. **Breaking changes** — explicitly call out any breaking changes

Use this template:

```markdown
## Summary
<!-- What does this PR do? Why? -->

## Linked Issue
Closes #

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor (no functional change)
- [ ] Documentation
- [ ] Data update

## Testing
<!-- How did you test this? -->

## Screenshots (if applicable)
<!-- Before / After -->

## Breaking Changes
<!-- List any breaking changes, or write "None" -->
```

### Review process

- At least one maintainer review is required before merging.
- Address all review comments or explain why you disagree.
- Keep your branch up to date with `main` before requesting re-review.
- Squash commits before merging if the commit history is noisy.

---

## Code Style

### TypeScript / Next.js

- All interactive pages and components use `'use client'` at the top.
- Styling is **inline CSS using CSS custom properties** (`var(--token)`). Do not use Tailwind utility classes in components — Tailwind is only used for the global CSS reset in `globals.css`.
- Use the existing CSS token vocabulary defined in `app/globals.css`:
  - Backgrounds: `--bg-base`, `--bg-surface-1`, `--bg-surface-2`, `--bg-muted`
  - Text: `--text-primary`, `--text-secondary`, `--text-tertiary`
  - Accent: `--accent-primary`, `--accent-data`, `--accent-archive`
  - Delta: `--delta-pos`, `--delta-neg`, `--delta-warn`
  - Typography: `--font-serif`, `--font-sans`, `--font-mono`
- Use TypeScript strictly — no `any` types.
- Component files are PascalCase. Utility files are camelCase.
- All charts use **Recharts only** — do not introduce additional charting libraries.
- Format with Prettier defaults (2-space indent, single quotes).

### Python (ETL pipeline)

- Follow **PEP 8** — 4-space indent, 79-character line limit.
- All database operations use `ON CONFLICT DO UPDATE` (idempotent upserts).
- Environment variables are loaded via `python-dotenv` — never hardcode credentials.
- Rate-limit API calls — maintain the existing 1-second sleep between company fetches.
- New fetcher functions must handle `None` and missing keys gracefully.
- Use type hints for all new function signatures.

### General

- No console.log / print statements in production code paths.
- Delete dead code rather than commenting it out.
- Keep functions small and single-purpose.
- Commit messages follow the format: `type: short description in imperative mood`
  - Types: `feat`, `fix`, `docs`, `refactor`, `data`, `test`, `chore`, `legal`
  - Example: `feat: add revenue growth sparkline to company card`

---

## Original Work Requirement

**All contributions must be your own original work.**

By submitting a pull request, you certify that:

1. The contribution was written by you and is not copied from or substantially derived from any third-party source.
2. You have the right to submit the contribution under the MIT License.
3. The contribution does not include proprietary code, licensed data, or intellectual property belonging to any third party.
4. The contribution does not include data or content scraped in violation of any website's terms of service.

Financial data contributed to the platform must come from publicly available, legally accessible sources. Do not submit data obtained from Bloomberg, Refinitiv, FactSet, S&P Capital IQ, or any paid data terminal.

---

## Reporting Security Vulnerabilities

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in Trikosh, please report it privately:

1. Email the maintainer directly: check the [author's GitHub profile](https://github.com/zshqv) for contact details.
2. Include in your report:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)
3. Allow reasonable time (up to 14 days) for a response and patch before any public disclosure.

Responsible disclosure is appreciated and will be acknowledged in the release notes.

---

*Thank you for helping build open-source financial research infrastructure for students everywhere.*
