Trikosh — Data & Research Methodology
Version: 1.0
Last Updated: May 2026
Maintainer: Ashutosh Tripathi (@zshqv)

Why This Document Exists
Every financial data platform makes choices. Which numbers to use. How to handle missing data. Which ratios to compute and why. How to treat companies that report in different currencies or under different accounting standards.
Most platforms hide these choices. Trikosh documents them.
This document explains every data decision made in this platform — the source, the logic, the formulas, and the known limitations. If you use Trikosh data in your own research, this is what you are relying on. Read it.

Origin
After graduating in 2025, I tried to write my first equity research report. The experience was disorienting.
Financial data was scattered across annual reports, SEC filings, investor presentations, earnings transcripts, and third-party aggregators — each with different formatting, different terminology, and different levels of reliability. Even when I found the right number, I often didn't know whether it was comparable to the same number for a different company reporting under different standards.
There was no single place where a student — someone without a Bloomberg terminal, without institutional access, without a senior analyst to ask — could begin structured financial research with confidence.
Trikosh is my answer to that problem. A standardised, open-source financial research infrastructure built for students and aspiring analysts who are starting from scratch.

Data Source
Primary source: yfinance (Yahoo Finance API wrapper)
Why yfinance:

Free with no API key required — consistent with Trikosh's open-source, zero-barrier philosophy
Covers global equities across major exchanges
Returns structured financial statement data in a format suitable for programmatic processing
Sufficient depth for 5-year historical analysis

Known limitation of this source:

yfinance data is sourced from Yahoo Finance, which aggregates from multiple providers. Occasional discrepancies exist between yfinance figures and company-filed source documents (10-K, 20-F, Annual Report).
yfinance does not always distinguish between restated and originally reported figures.
For research that requires audit-grade precision, always verify against the primary filing.


Coverage
DimensionDetailCompanies50Sectors5Historical depth5 fiscal yearsData frequencyAnnual (fiscal year end)Last pipeline runUpdated periodically — see repository commit history
Sectors and Companies
Financial Services
JPMorgan Chase, Bank of America, Goldman Sachs, Morgan Stanley, Wells Fargo, Citigroup, BlackRock, Charles Schwab, American Express, Visa
AI & Technology
NVIDIA, Microsoft, Apple, Alphabet, Meta, Amazon (AWS), Intel, AMD, TSMC, Salesforce
Healthcare & Pharmaceuticals
Johnson & Johnson, Pfizer, UnitedHealth Group, AbbVie, Merck, Eli Lilly, Thermo Fisher, Abbott, Medtronic, Danaher
Consumer & Retail
Nestlé, Unilever, Hindustan Unilever, Tata Consumer, McDonald's, Restaurant Brands International, Colgate-Palmolive, Walmart, LVMH, Procter & Gamble
Consumer Internet & Digital Platforms
Amazon, Alibaba, Sea Limited, Shopify, MercadoLibre, Uber, JD.com, eBay, Etsy, Booking Holdings

Financial Statements
Three standardised statements are stored per company per fiscal year:

Income Statement — Revenue, gross profit, operating income, net income, EBITDA, interest expense
Balance Sheet — Total assets, total equity, total liabilities, current assets, current liabilities, inventory, total debt
Cash Flow Statement — Operating cash flow, capital expenditure, free cash flow

All figures are stored in USD. For non-US companies reporting in local currency, yfinance handles the conversion at the point of data retrieval. This means exchange rate fluctuations affect year-over-year comparability for international companies. This is a known and accepted limitation at the current version.

Ratio Methodology
The Safe Divide Principle
Every ratio in Trikosh is computed using a safe division function that returns NULL rather than crashing when a denominator is zero or missing. A NULL ratio is displayed as N/A on the platform. This is intentional — a missing value is more honest than a fabricated one.

The 15 Ratios — Formulas and Rationale
Profitability
1. Gross Profit Margin
Gross Profit / Revenue
Measures the proportion of revenue retained after direct production costs. The first test of whether a business model is viable. High gross margins indicate pricing power and low cost of production.
2. Operating Margin
Operating Income / Revenue
Core business profitability before financing decisions and taxes. Strips out interest and tax effects, allowing comparison across companies with different capital structures.
3. Net Profit Margin
Net Income / Revenue
Final bottom-line profitability as a percentage of revenue. Reflects the full impact of the business including taxes and interest. Less useful for cross-company comparison than operating margin due to tax regime differences.
4. EBITDA Margin
EBITDA / Revenue
Earnings before interest, taxes, depreciation, and amortisation as a percentage of revenue. Widely used in valuation and credit analysis as a proxy for cash earnings power. Useful for comparing capital-intensive vs. asset-light businesses.

Returns
5. Return on Equity (ROE)
Net Income / Total Shareholders' Equity
Measures how much profit is generated per unit of shareholder capital. A high ROE is desirable, but must be read alongside leverage — a company can manufacture high ROE by taking on excessive debt.
6. Return on Assets (ROA)
Net Income / Total Assets
Measures how efficiently a company converts its asset base into profit. More conservative than ROE as it is not affected by leverage decisions.
7. Asset Turnover
Revenue / Total Assets
Revenue generated per dollar of assets deployed. High asset turnover combined with thin margins (e.g. retail) is a fundamentally different business model than low turnover with high margins (e.g. software).

Leverage & Solvency
8. Debt to Equity
Total Liabilities / Total Shareholders' Equity
Measures the degree to which the company is financing operations through debt versus equity. Interpretation varies significantly by sector — high leverage is normal in Financial Services and Capital Goods; it is a red flag in Technology.
9. Debt to EBITDA
Total Debt / EBITDA
A credit metric. Indicates how many years of current earnings would be required to repay total debt. Used by rating agencies and leveraged finance desks to assess repayment capacity. Below 2x is generally considered conservative; above 5x signals elevated risk.
10. Interest Coverage
Operating Income / Interest Expense
Measures whether a company generates sufficient operating profit to cover its interest obligations. A ratio below 1.5x is considered a warning signal. Returns NULL for companies with no reported interest expense.

Liquidity
11. Current Ratio
Current Assets / Current Liabilities
Measures short-term liquidity — the ability to cover near-term obligations with near-term assets. A ratio above 1.0 suggests the company can meet its short-term obligations.
12. Quick Ratio
(Current Assets − Inventory) / Current Liabilities
A more conservative liquidity measure that excludes inventory, which may not be immediately convertible to cash. Particularly relevant for manufacturers and retailers with large inventory balances.
13. Operating Cash Flow Ratio
Operating Cash Flow / Current Liabilities
Tests whether actual cash generated from operations is sufficient to cover current liabilities — more reliable than the current ratio, which includes non-cash assets.

Cash Flow
14. Free Cash Flow Margin
Free Cash Flow / Revenue
The percentage of revenue that converts to free cash — cash available after maintaining and expanding the asset base. A more reliable indicator of financial health than net income for many businesses, particularly those with significant non-cash charges.
15. Capex to Revenue
|Capital Expenditure| / Revenue
Measures capital intensity — how much of revenue must be reinvested in physical infrastructure. Capital-light businesses (software, platforms) typically show values below 5%. Capital-intensive businesses (semiconductors, industrials) may show 15–25%.

Sector-Specific Ratio Prioritisation
Not all ratios carry equal weight across sectors. Trikosh surfaces the most analytically relevant metrics first depending on the company's sector.
SectorPrimary MetricsSecondary MetricsFinancial ServicesROE, ROA, Debt/EquityNet Margin, OCF RatioAI & TechnologyFCF Margin, Operating Margin, Capex/RevenueRevenue Growth, EBITDA MarginHealthcareGross Margin, R&D context, Net MarginDebt/EBITDA, ROEConsumer & RetailGross Margin, Asset Turnover, Current RatioFCF Margin, Net MarginConsumer InternetRevenue Growth, FCF Margin, Operating MarginCapex/Revenue, EBITDA Margin

Data Pipeline Architecture
yfinance API
    ↓
fetcher.py       — pulls raw financial statement data per company
    ↓
calculator.py    — computes 15 standardised ratios from raw data
    ↓
loader.py        — writes to PostgreSQL via upsert logic
    ↓
pipeline.py      — orchestrates the full sequence for all 50 companies
    ↓
PostgreSQL       — 6-table schema: companies, income_statements,
                   balance_sheets, cash_flow_statements,
                   financial_ratios, market_data
    ↓
FastAPI          — serves structured data to the frontend
    ↓
Next.js          — renders company pages, sector views, peer comparison
All database writes use upsert logic — running the pipeline twice will update existing records rather than creating duplicates. This makes the pipeline safe to re-run for data refreshes.

Known Limitations
1. Data source is not primary.
All data originates from yfinance, which aggregates Yahoo Finance data. For audit-grade research, verify key figures against 10-K or 20-F filings directly.
2. Currency normalisation is approximate.
Non-US companies are converted to USD by yfinance at retrieval time. Historical comparisons for international companies are affected by exchange rate movements, which Trikosh does not currently adjust for.
3. GAAP vs. IFRS differences are not explicitly flagged.
US companies report under GAAP. Most international companies report under IFRS. Certain line items (e.g. lease classification, revenue recognition timing) differ between standards. Trikosh does not currently annotate which standard applies to each company.
4. No real-time data.
Trikosh uses annual fiscal year data. It is not a live market data platform. Market data (price, P/E, market cap) is fetched at pipeline run time and reflects a point-in-time snapshot.
5. 50-company coverage.
The platform currently covers 50 companies across 5 sectors. Coverage expansion is planned. Companies outside current coverage are not available.

What Trikosh Is Not
Trikosh is not a Bloomberg Terminal. It does not provide real-time pricing, live news, or execution capabilities.
Trikosh is not a stock screener. It does not rank companies by performance or generate buy/sell signals.
Trikosh is not a substitute for reading primary filings. The platform is designed to make the starting point for financial research more structured and accessible — not to replace the analytical work that comes after.

Roadmap
v1.0 (current)
50 companies, 5 sectors, 5-year historical data, 15 standardised ratios, peer comparison, research starter frameworks, PDF/Excel export, open-source GitHub repository.
v1.1 (planned)
SEC EDGAR and Companies House filing parser. Automated pipeline with weekly data refresh via GitHub Actions. Data quality monitoring and anomaly detection.
v2.0 (long-term)
Earnings transcript summarisation. Valuation model helpers (DCF, comparables). Research workflow automation. Expanded coverage to 200+ companies across 10+ sectors.

Contributing
If you find a data error, a ratio formula you believe is incorrect, or a company with missing or anomalous values, please open an issue on GitHub using the data error template.
See CONTRIBUTING.md for full contribution guidelines.

License
Trikosh is released under the MIT License. See LICENSE for details.
Data sourced via yfinance is subject to Yahoo Finance's terms of service. Trikosh does not claim ownership of any underlying financial data.