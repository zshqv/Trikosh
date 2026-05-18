"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";

interface Term {
  term: string;
  definition: string;
  category: string;
}

const TERMS: Term[] = [
  // ── General Finance ──
  {
    term: "Market Capitalisation",
    category: "General Finance",
    definition:
      "Share price multiplied by shares outstanding. The total market value of a company. Used to size and rank companies. Large-cap typically means above $10B; small-cap below $2B.",
  },
  {
    term: "Revenue",
    category: "General Finance",
    definition:
      "Total income generated from a company's core operations before any costs are deducted. Also called 'top line' or 'net sales.' The starting point of every income statement.",
  },
  {
    term: "EBITDA",
    category: "General Finance",
    definition:
      "Earnings Before Interest, Taxes, Depreciation & Amortization. A proxy for operating cash profitability that strips out capital structure and accounting choices. Widely used in valuation multiples.",
  },
  {
    term: "Free Cash Flow (FCF)",
    category: "General Finance",
    definition:
      "Operating cash flow minus capital expenditure. The actual cash a business generates after maintaining and expanding its asset base. More reliable than net income for valuation because it's harder to manipulate.",
  },
  {
    term: "Working Capital",
    category: "General Finance",
    definition:
      "Current assets minus current liabilities. Measures short-term liquidity. Negative working capital can signal cash generation efficiency (e.g. retailers) or financial stress — context matters.",
  },
  {
    term: "Dividend Yield",
    category: "General Finance",
    definition:
      "Annual dividend per share divided by current share price, expressed as a percentage. Shows the income return from owning the stock. High yield can mean generosity or distress — check payout sustainability.",
  },
  {
    term: "Beta",
    category: "General Finance",
    definition:
      "A measure of a stock's volatility relative to the broader market (beta = 1 means it moves with the market). Beta > 1 means more volatile; < 1 means less. Used in CAPM to calculate cost of equity.",
  },
  {
    term: "Book Value",
    category: "General Finance",
    definition:
      "Total assets minus total liabilities from the balance sheet. Represents accounting net worth. Companies trading below book value may be undervalued — or their assets may be impaired.",
  },
  {
    term: "Earnings Per Share (EPS)",
    category: "General Finance",
    definition:
      "Net income divided by shares outstanding. The portion of profit attributable to each share. Diluted EPS accounts for stock options and convertibles — always use diluted when comparing.",
  },
  {
    term: "Operating Leverage",
    category: "General Finance",
    definition:
      "How much operating income grows relative to revenue growth. High operating leverage means fixed costs dominate — great in boom times, painful in downturns. Software has high operating leverage; labour-intensive businesses have low.",
  },

  // ── Valuation ──
  {
    term: "P/E Ratio",
    category: "Valuation",
    definition:
      "Price-to-Earnings. Share price divided by EPS. Tells you how much investors pay for each unit of earnings. High P/E implies growth expectations. Compare within sectors — a 30x P/E is expensive for a bank, normal for software.",
  },
  {
    term: "P/B Ratio",
    category: "Valuation",
    definition:
      "Price-to-Book. Share price divided by book value per share. Compares market price to accounting value. Most useful for capital-intensive sectors (banks, utilities). P/B < 1 can signal undervaluation or asset deterioration.",
  },
  {
    term: "EV/EBITDA",
    category: "Valuation",
    definition:
      "Enterprise Value divided by EBITDA. Capital-structure-neutral — it prices the whole business, not just equity. The most widely used M&A valuation multiple because it allows cross-sector comparison regardless of how a company is financed.",
  },
  {
    term: "PEG Ratio",
    category: "Valuation",
    definition:
      "P/E divided by the expected earnings growth rate. Adjusts valuation for growth — a stock trading at 30x with 30% growth (PEG = 1) is often fairer than one at 15x with 5% growth (PEG = 3). Below 1 is generally considered undervalued.",
  },
  {
    term: "DCF (Discounted Cash Flow)",
    category: "Valuation",
    definition:
      "A method of valuing a company by projecting future free cash flows and discounting them back to present value using a discount rate (WACC). The most theoretically correct valuation — but heavily sensitive to assumptions. Garbage in, garbage out.",
  },
  {
    term: "Enterprise Value (EV)",
    category: "Valuation",
    definition:
      "Market cap + total debt - cash. The theoretical takeover price of a business — what you'd actually pay to acquire it, including its debt obligations and netting out its cash. Always use EV (not market cap) with EBITDA.",
  },
  {
    term: "Price-to-Sales (P/S)",
    category: "Valuation",
    definition:
      "Market cap divided by annual revenue. Useful when companies are unprofitable (e.g. early-stage growth). A high P/S multiple is only justified by high gross margins and a credible path to profitability.",
  },
  {
    term: "Comparable Company Analysis (Comps)",
    category: "Valuation",
    definition:
      "Valuing a company by comparing its trading multiples (P/E, EV/EBITDA) to a peer group of similar public companies. One of the two most common investment banking valuation methods. Fast but assumes peers are fairly valued.",
  },
  {
    term: "Precedent Transactions",
    category: "Valuation",
    definition:
      "Valuing a company based on the multiples paid in past M&A deals for similar businesses. Reflects acquisition premiums — so typically higher than comps. Used alongside comps to triangulate a fair value range.",
  },
  {
    term: "WACC",
    category: "Valuation",
    definition:
      "Weighted Average Cost of Capital. The blended rate a company is expected to pay its providers of capital (debt + equity). Used as the discount rate in DCF models. Higher WACC = lower valuation.",
  },

  // ── Financial Statements ──
  {
    term: "Income Statement",
    category: "Financial Statements",
    definition:
      "Shows revenue, costs, and profit over a period (quarter or year). Also called P&L (Profit & Loss). Starts with revenue at the top, deducts expenses to arrive at net income at the bottom. Tells you what the company earned.",
  },
  {
    term: "Balance Sheet",
    category: "Financial Statements",
    definition:
      "A snapshot of assets, liabilities, and equity at a point in time. Must always balance: Assets = Liabilities + Equity. Tells you what the company owns, owes, and what's left for shareholders.",
  },
  {
    term: "Cash Flow Statement",
    category: "Financial Statements",
    definition:
      "Shows cash generated and spent across three activities: operating (core business), investing (capex, acquisitions), and financing (dividends, debt). The most difficult to manipulate of the three statements. Start here when investigating quality.",
  },
  {
    term: "Gross Profit",
    category: "Financial Statements",
    definition:
      "Revenue minus cost of goods sold (COGS). What's left after direct production costs. Gross margin (gross profit / revenue) varies wildly by industry — ~70% for software, ~30% for retailers, ~8% for supermarkets.",
  },
  {
    term: "Operating Income (EBIT)",
    category: "Financial Statements",
    definition:
      "Gross profit minus operating expenses (SG&A, R&D, D&A). Profit from core business before interest and tax. Removes financing and tax decisions to show underlying business performance.",
  },
  {
    term: "Net Income",
    category: "Financial Statements",
    definition:
      "The final 'bottom line' after all expenses, interest, and taxes. What shareholders are entitled to — but not what they receive (dividends are a portion, the rest is retained). Can be manipulated via accounting. Verify with FCF.",
  },
  {
    term: "Retained Earnings",
    category: "Financial Statements",
    definition:
      "Cumulative net income kept inside the business instead of paid out as dividends. Grows the book value of equity over time. A sustained decline signals persistent losses or dividend payments exceeding profits.",
  },
  {
    term: "Depreciation & Amortization (D&A)",
    category: "Financial Statements",
    definition:
      "A non-cash accounting expense that spreads the cost of assets over their useful life. Added back in the cash flow statement. EBITDA adds D&A back to EBIT, which is why it's often a better proxy for cash profitability.",
  },

  // ── Equity Research ──
  {
    term: "Equity Research Report",
    category: "Equity Research",
    definition:
      "A formal document by a buy-side or sell-side analyst covering a company's business model, financial model, valuation, and investment recommendation. Includes a price target and investment thesis with a 12-month horizon.",
  },
  {
    term: "Price Target",
    category: "Equity Research",
    definition:
      "An analyst's estimate of where a stock will trade in 12 months based on a valuation model. Not a guarantee — it reflects one set of assumptions. Useful for framing upside/downside, not for mechanically timing trades.",
  },
  {
    term: "Investment Thesis",
    category: "Equity Research",
    definition:
      "A concise argument for why a stock will outperform. A good thesis names the specific catalyst, the mispricing in the market, and what would prove it wrong. If you can't state it in three sentences, you don't have one.",
  },
  {
    term: "Bull Case / Bear Case",
    category: "Equity Research",
    definition:
      "The optimistic and pessimistic scenario outcomes for a company's stock based on different assumptions. Professional analysts model three scenarios (base, bull, bear) and assign probabilities to each to arrive at a probability-weighted price target.",
  },
  {
    term: "Catalyst",
    category: "Equity Research",
    definition:
      "A specific upcoming event expected to move the stock — earnings release, FDA approval, product launch, contract win, management change. A thesis without a catalyst is just a valuation exercise. Catalysts are what turn analysis into timing.",
  },
  {
    term: "Initiation of Coverage",
    category: "Equity Research",
    definition:
      "The first equity research report an analyst publishes on a company. Typically the most detailed, establishing a full financial model and valuation framework. 'Initiating with Buy / $X target' is standard language.",
  },
  {
    term: "Buy / Hold / Sell",
    category: "Equity Research",
    definition:
      "The three standard recommendation categories. Buy means the analyst expects the stock to outperform. Hold means in-line with the market. Sell is rare on the sell-side due to banking relationships — treat it as a strong signal when it appears.",
  },
  {
    term: "Net Revenue Retention (NRR)",
    category: "Equity Research",
    definition:
      "For SaaS companies: revenue from existing customers this year vs. last year, accounting for churn and expansion. Above 120% means the existing base grows without new sales. A key quality indicator for software businesses.",
  },
];

const CATEGORIES = ["All", "General Finance", "Valuation", "Financial Statements", "Equity Research"];

function TermRow({ t, isLast }: { t: Term; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: "24px",
        padding: "15px 10px",
        borderBottom: isLast ? "none" : "0.5px solid var(--border)",
        borderRadius: "4px",
        transition: "background-color 0.15s ease",
        backgroundColor: hovered ? "rgba(212,168,83,0.04)" : "transparent",
        cursor: "default",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: hovered ? "var(--amber)" : "var(--text-primary)",
          lineHeight: 1.5,
          transition: "color 0.15s ease",
        }}
      >
        {t.term}
      </p>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.75 }}>
        {t.definition}
      </p>
    </div>
  );
}

export default function GlossaryPage() {
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return TERMS.filter(t => {
      const matchCat = category === "All" || t.category === category;
      const matchQ   = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const cats =
      category === "All"
        ? ["General Finance", "Valuation", "Financial Statements", "Equity Research"]
        : [category];
    return cats
      .map(cat => ({
        cat,
        terms: filtered.filter(t => t.category === cat),
      }))
      .filter(g => g.terms.length > 0);
  }, [filtered, category]);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "32px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--amber)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Reference
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Glossary
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Plain-English definitions for the terms that show up in financial research.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ position: "relative", marginBottom: "16px" }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-subtle)",
            }}
          />
          <input
            type="text"
            placeholder="Search terms and definitions…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "var(--surface)",
              border: "0.5px solid var(--border)",
              borderRadius: "6px",
              padding: "10px 14px 10px 34px",
              fontSize: "13px",
              color: "var(--text-primary)",
              outline: "none",
              transition: "border-color 0.15s ease",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ display: "flex", gap: "4px", marginBottom: "36px", overflowX: "auto" }}
        >
          {CATEGORIES.map(cat => {
            const active = cat === category;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--amber)" : "var(--text-muted)",
                  backgroundColor: active ? "rgba(212,168,83,0.08)" : "transparent",
                  border: `0.5px solid ${active ? "rgba(212,168,83,0.25)" : "transparent"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s ease, background-color 0.15s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Terms */}
        {grouped.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            No terms match &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {grouped.map(({ cat, terms }) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-subtle)",
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                    paddingBottom: "10px",
                    borderBottom: "0.5px solid var(--border)",
                  }}
                >
                  {cat}
                </p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {terms.map((t, i) => (
                    <TermRow key={t.term} t={t} isLast={i === terms.length - 1} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <p
          style={{
            marginTop: "40px",
            fontSize: "11px",
            color: "var(--text-subtle)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {filtered.length} / {TERMS.length} terms
        </p>
      </div>
    </div>
  );
}
