# npm Audit Summary
**Date:** 2026-06-07
**Tool:** `npm audit` (npm v10 / Node audit report v2)
**Directory:** `apps/web/`

---

## Totals

| Severity | Count | Fixed this sprint |
|---|---|---|
| Critical | 0 | — |
| High | 10 | 0 (all require `--force` / major version bump) |
| Moderate | 1 | 1 (`hono` — fixed by `npm audit fix`) |
| Low | 0 | — |
| **Total** | **11** | **1** |

> **Before this sprint:** 12 vulnerabilities (2 moderate, 10 high).
> `npm audit fix` (non-force) fixed the `hono` moderate group. All remaining 10 high-severity
> findings require a major-version upgrade (`--force`) and are deferred — see Recommendations.

---

## Vulnerability Table

| Package | Severity | Advisory | Description | Safe Fix Available |
|---|---|---|---|---|
| `@clerk/clerk-react` ≤5.61.5 | **High** | [GHSA-w24r-5266-9c3c](https://github.com/advisories/GHSA-w24r-5266-9c3c) | Authorization bypass when combining organization, billing, or reverification checks | No — requires `@clerk/nextjs@7` (major) |
| `js-cookie` ≤3.0.5 | **High** | [GHSA-qjx8-664m-686j](https://github.com/advisories/GHSA-qjx8-664m-686j) | Per-instance prototype hijack in `assign()` enables cookie-attribute injection | No — pulled in by `@clerk/shared`; fix via `@clerk/nextjs@7` |
| `@clerk/shared` (transitive) | **High** | — | Depends on vulnerable `js-cookie` | No — fix via `@clerk/nextjs@7` |
| `@clerk/backend` (transitive) | **High** | — | Depends on vulnerable `@clerk/shared` | No — fix via `@clerk/nextjs@7` |
| `@clerk/nextjs` 5.7.6 | **High** | — | Depends on all vulnerable Clerk sub-packages above | No — fix installs `@clerk/nextjs@7.4.3` (major) |
| `glob` 10.2.0–10.4.5 | **High** | [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) | CLI command injection via `-c/--cmd` (shell: true). Dev-only dep. | No — requires `eslint-config-next@16` (major) |
| `@next/eslint-plugin-next` (transitive) | **High** | — | Depends on vulnerable `glob` | No — fix via `eslint-config-next@16` |
| `eslint-config-next` 14.2.35 | **High** | — | Depends on vulnerable `@next/eslint-plugin-next` | No — fix installs v16 (major) |
| `next` 14.2.35 | **High** | Multiple (see below) | DoS via Image Optimizer, HTTP smuggling, cache poisoning, XSS in CSP nonce, SSRF | No — fix installs `next@16` (major) |
| `xlsx` 0.18.5 | **High** | [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6), [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9) | Prototype pollution + ReDoS | **No fix available** — package is abandoned |
| `hono` ≤4.12.20 | ~~Moderate~~ | [GHSA-xrhx-7g5j-rcj5](https://github.com/advisories/GHSA-xrhx-7g5j-rcj5) + 3 more | IP restriction bypass, cookie injection, JWT scheme bypass | **Fixed** — `npm audit fix` updated to 4.12.21 |

### `next@14.2.35` CVE list
| CVE / Advisory | Title |
|---|---|
| GHSA-9g9p-9gw9-jx7f | DoS via Image Optimizer remotePatterns |
| GHSA-h25m-26qc-wcjf | HTTP request deserialization DoS (RSC) |
| GHSA-ggv3-7p47-pfv8 | HTTP request smuggling via rewrites |
| GHSA-3x4c-7xq6-9pq8 | Unbounded next/image disk cache growth |
| GHSA-q4gf-8mx6-v5v3 | Denial of Service with Server Components |
| GHSA-8h8q-6873-q5fj | Denial of Service with Server Components (variant) |
| GHSA-3g8h-86w9-wvmq | Middleware/proxy redirect cache poisoning |
| GHSA-ffhc-5mcf-pf4q | XSS in App Router CSP nonce handling |
| GHSA-vfv6-92ff-j949 | Cache poisoning via RSC cache-busting collisions |
| GHSA-gx5p-jg67-6x7h | XSS in beforeInteractive scripts with untrusted input |
| GHSA-h64f-5h5j-jqjh | DoS in Image Optimization API |
| GHSA-c4j6-fc7j-m34r | SSRF via WebSocket upgrades |
| GHSA-wfc6-r584-vfw7 | Cache poisoning in RSC responses |
| GHSA-36qx-fr4f-26g5 | Middleware/proxy bypass in Pages Router i18n |

---

## Recommendations

### Fix now (next sprint)

| Action | Packages addressed | Risk |
|---|---|---|
| Upgrade `@clerk/nextjs` to v7 (`npm install @clerk/nextjs@latest`) | All Clerk high-severity findings | Medium — API changes in v6→v7; test auth flows after upgrade |
| Replace `xlsx` with `exceljs` (actively maintained) | xlsx prototype pollution + ReDoS | Low-Medium — API differs; rewrite `apps/web/app/api/template/route.ts` |

### Fix next maintenance window

| Action | Packages addressed | Risk |
|---|---|---|
| Upgrade `next` to v15 or v16 (separate sprint) | 14 next.js CVEs | High — major version, App Router API changes, requires full regression test |
| `eslint-config-next` upgrades automatically with next upgrade | glob command injection | — |

### Deferred (acceptable risk)

| Package | Reason |
|---|---|
| `glob` (via eslint-config-next) | Dev-only dependency; not in production bundle. CLI flag exploit requires attacker CLI access. |
| `postcss` (bundled with next) | Only exploitable via CSS parsing in build step. Resolved when next is upgraded. |

---

## What was applied this sprint

```
npm audit fix   # (non-force)
# Changed: hono 4.x.x → 4.12.21 (1 package updated)
# Vulnerabilities before: 12 (2 moderate, 10 high)
# Vulnerabilities after:  11 (1 moderate, 10 high)
```
