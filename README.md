# Trikosh

> *Tri (three) + Kosha (structured treasury of knowledge) — Sanskrit*

Open-source financial research infrastructure for students and aspiring analysts.

**Live:** [trikosh.xyz](https://trikosh.xyz)

Trikosh is built on a simple observation: financial information exists, but financial understanding does not come pre-assembled. Annual reports, SEC filings, earnings transcripts, and investor presentations are scattered, inconsistent, and overwhelming for anyone beginning their research journey. Trikosh standardises, structures, and presents this information so that students can focus on analysis rather than data collection.

**Built by a student, for students. Inspired by the open-source philosophy of Linux.**

---

## What Trikosh Is

Trikosh is a structured financial research platform covering 120 companies across six sectors — Financial Services, AI & Technology, Healthcare, Consumer & Retail, Consumer Internet & Digital Platforms, and Industrials — with five years of standardised financial data, ratio analysis, peer comparison, and research starter frameworks.

It is not a data vendor. It is not an AI tool. It is infrastructure — the foundation on which a student builds their own understanding.

---

## Who It Is For

- Finance students beginning equity research
- CFA candidates building analytical frameworks
- University finance clubs running research programmes
- Aspiring investment banking and asset management analysts
- Anyone who wants to understand a company deeply, not just quickly
- Non-finance students who want to understand how businesses work

---

## Core Features

### Standardised Financial Statements
Five years of income statements, balance sheets, and cash flow statements — cleaned, structured, and consistent across all 120 companies.

### Ratio Analysis
Pre-computed financial ratios across profitability, leverage, liquidity, efficiency, and valuation — with methodology documented transparently.

### Peer Comparison
Side-by-side comparison of any two companies within a sector on margins, return metrics, and growth rates.

### Research Starter Frameworks
Structured templates that give a student analyst a starting point — not the answer, but the right questions.

### Export
Download any company or comparison view as PDF or Excel for use in your own research workflow.

---

## Sectors and Coverage

| Sector | Companies |
|---|---|
| Financial Services | 21 companies |
| AI & Technology | 20 companies |
| Healthcare | 20 companies |
| Consumer & Retail | 20 companies |
| Consumer Internet & Digital Platforms | 19 companies |
| Industrials | 20 companies |
| **Total** | **120 companies** |

---

## Technology

| Layer | Stack |
|---|---|
| Frontend | Next.js, Recharts |
| Backend | Python FastAPI |
| Database | PostgreSQL |
| Authentication | Clerk |
| Deployment | Vercel |
| Repository | Open-source, MIT License |

---

## Project Status

Trikosh is live and in active development.

| Milestone | Status |
|---|---|
| Repository and architecture | ✅ Complete |
| Database schema | ✅ Complete |
| Data loading — 120 companies, 6 sectors | ✅ Complete |
| Frontend — company pages | ✅ Complete |
| Peer comparison tool | ✅ Complete |
| Research frameworks | ✅ Live |
| Excel export template | ✅ Live |
| Authentication (Clerk) | ✅ Integrated |
| Public launch | ✅ Live |

---

## Philosophy

Most tools give you the answer. Trikosh gives you the structure to find it yourself.

The open-source philosophy behind Trikosh is deliberate. Financial research infrastructure should not be locked behind expensive data terminals or proprietary platforms. A student in Mumbai, Nairobi, or Warsaw should have access to the same quality of structured financial data as one at a target university with a Bloomberg terminal.

Trikosh is the beginning of that infrastructure.

---

## For the Student Who Has No One to Guide Them

This section will grow into a complete library of research guides, equity report templates, financial statement walkthroughs, and sector primers — written in plain language for anyone, regardless of background.

If you have never read an annual report, never built a financial model, or never written an equity research note — that is exactly who Trikosh is being built for. You should not need a target university or an expensive course to begin. You need structure, clarity, and a starting point.

That is what this will become.

---

## Contributing

Trikosh is open-source and welcomes contributions. If you are a finance student, developer, or analyst who believes in this mission, read the contributing guidelines (coming at v0.1.0).

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

## Author

Built and maintained by [Ashutosh Tripathi](https://github.com/zshqv).

*Ashutosh — one of the 108 names of Lord Shiva. Tripathi — one who has mastered knowledge across three dimensions.*

---

> "The goal of Trikosh is not to replace thinking. It is to make thinking possible."

---

## Data Sources & Limitations

Financial data on Trikosh is sourced via **[yFinance](https://github.com/ranaroussi/yfinance)**, an open-source Python library that retrieves publicly available data from Yahoo Finance. Data is fetched for educational and non-commercial purposes only.

**Known limitations:**

- Data may lag behind official filings by days or weeks and is not real-time
- Figures may differ from audited primary-source annual reports due to restatements or rounding
- Currency conversions are approximate and not guaranteed for non-USD reporters
- Some fields may be null or missing, particularly for non-US listed companies (e.g. `.NS` tickers)
- yFinance data availability varies by company and is subject to Yahoo Finance's own data coverage

Always verify data against primary sources before analytical use: company annual reports, SEC EDGAR filings, and official investor relations disclosures.

---

## License

MIT License — see [LICENSE](./LICENSE) for full terms.

Copyright © 2025 Trikosh Contributors.

---

## Disclaimer

All data and content on Trikosh is provided for **educational and non-commercial purposes only**. Nothing on this platform constitutes financial advice or an investment recommendation of any kind. Data sourced via yFinance may contain errors or omissions and should be independently verified against primary sources before use. The maintainers accept no liability for any investment decision made using this data. yFinance retrieves data from Yahoo Finance; Trikosh has no commercial affiliation with Yahoo Finance or its parent entities. See [DISCLAIMER.md](./DISCLAIMER.md) for the full terms.