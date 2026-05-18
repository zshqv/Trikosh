"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SECTORS = [
  {
    name: "Financial Services",
    tagline: "The architecture of global capital",
    description:
      "Financial services companies form the circulatory system of the global economy — moving capital from where it sits to where it's needed. This sector spans commercial banks (lending, deposits), investment banks (M&A, IPOs, trading), asset managers, insurance companies, and payments networks. Analysing banks requires a different lens: look at net interest margin and return on equity rather than gross margin. Capital adequacy, non-performing loans, and fee income diversification matter as much as revenue growth.",
    keyMetrics: [
      { name: "Net Interest Margin",    why: "Revenue from lending minus funding cost. Higher = better spread." },
      { name: "Return on Equity (ROE)", why: "How efficiently the bank generates profit from shareholder capital." },
      { name: "Non-Performing Loan %",  why: "Credit quality. Rises in downturns. Watch it before P&L shows stress." },
      { name: "Capital Adequacy Ratio", why: "Regulatory buffer. Tier 1 CET1 must stay above 10%+ in most jurisdictions." },
      { name: "Cost-to-Income Ratio",   why: "Operating efficiency. Below 55% is generally healthy for large banks." },
    ],
    companies: [
      { ticker: "JPM",   name: "JPMorgan Chase" },
      { ticker: "GS",    name: "Goldman Sachs" },
      { ticker: "MS",    name: "Morgan Stanley" },
      { ticker: "C",     name: "Citigroup" },
      { ticker: "V",     name: "Visa" },
      { ticker: "UBS",   name: "UBS Group" },
      { ticker: "DB",    name: "Deutsche Bank" },
      { ticker: "ALIZF", name: "Allianz SE" },
      { ticker: "ING",   name: "ING Groep" },
      { ticker: "BNPQY", name: "BNP Paribas" },
      { ticker: "HDB",   name: "HDFC Bank" },
    ],
    color: "#d4a853",
  },
  {
    name: "Healthcare",
    tagline: "Science, scale, and regulatory moats",
    description:
      "Healthcare is defined by long development cycles, regulatory gatekeeping, and structural demand driven by demographics. Pharmaceutical companies live or die by their pipelines — a blockbuster drug can generate billions, but patent cliffs can wipe out revenue in a single year. Medical devices and diversified health conglomerates are generally more stable. For this sector, watch R&D spend as a percentage of revenue, pipeline stage distribution, and revenue concentration risk (how much comes from one or two drugs).",
    keyMetrics: [
      { name: "R&D as % of Revenue",   why: "Investment in future pipeline. Under-spending risks long-term decline." },
      { name: "Gross Margin",           why: "Often 60–80%+ for large pharma. Low margins signal generic competition." },
      { name: "Revenue Concentration",  why: "Does one drug represent >20% of revenue? That's patent cliff risk." },
      { name: "Operating Margin",       why: "After R&D. Shows whether the commercial model is efficient." },
      { name: "FCF Yield",              why: "Pharma generates heavy cash. FCF supports dividends and buybacks." },
    ],
    companies: [
      { ticker: "JNJ",          name: "Johnson & Johnson" },
      { ticker: "LLY",          name: "Eli Lilly" },
      { ticker: "UNH",          name: "UnitedHealth Group" },
      { ticker: "ABBV",         name: "AbbVie" },
      { ticker: "PFE",          name: "Pfizer" },
      { ticker: "NVS",          name: "Novartis" },
      { ticker: "BAYRY",        name: "Bayer AG" },
      { ticker: "RHHBY",        name: "Roche Holding" },
      { ticker: "SUNPHARMA.NS", name: "Sun Pharmaceutical" },
    ],
    color: "#4aad7a",
  },
  {
    name: "Technology",
    tagline: "Software margins, hardware cycles, and platform power",
    description:
      "Technology is not a monolith. Semiconductor companies (NVDA, ASML, TSM, AMD) are asset-heavy, cyclical, and subject to inventory cycles. Enterprise software (MSFT, SAP) is sticky, recurring, and extraordinarily capital-light. IT services (INFY, WIT) are labour-heavy and margin-thin but highly predictable. For semis, watch book-to-bill ratios, capacity utilisation, and gross margin to understand cycle position. For software, watch ARR growth, net revenue retention, and operating leverage. These companies are grouped together but demand very different analytical frameworks.",
    keyMetrics: [
      { name: "Gross Margin",           why: "60%+ for software. Semis vary 40–65%. IT services often below 35%." },
      { name: "R&D as % of Revenue",    why: "Semis and software spend heavily here. Signals future competitiveness." },
      { name: "FCF Conversion",         why: "Net income → cash. High in software, lower in capex-heavy semis." },
      { name: "Revenue Growth (YoY)",   why: "The primary signal. Tech re-rates fast on growth acceleration or deceleration." },
      { name: "Operating Leverage",     why: "Does margin expand as revenue grows? Defines the quality of the model." },
    ],
    companies: [
      { ticker: "NVDA", name: "NVIDIA" },
      { ticker: "MSFT", name: "Microsoft" },
      { ticker: "ASML", name: "ASML Holding" },
      { ticker: "TSM",  name: "Taiwan Semiconductor" },
      { ticker: "AMD",  name: "Advanced Micro Devices" },
      { ticker: "SAP",  name: "SAP SE" },
      { ticker: "INFY", name: "Infosys" },
      { ticker: "WIT",  name: "Wipro" },
    ],
    color: "#6b9fd4",
  },
];

export default function SectorsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "40px" }}
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
            Coverage
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Sectors
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Three sectors. Three different analytical frameworks. Click any sector to read the primer.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SECTORS.map((sector, sectorIdx) => {
            const isOpen = expanded === sector.name;
            return (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                  delay: sectorIdx * 0.08,
                }}
                layout
                style={{
                  backgroundColor: "var(--surface)",
                  border: `0.5px solid ${isOpen ? sector.color + "40" : "var(--border)"}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : sector.name)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "22px 26px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: "3px",
                        height: "32px",
                        backgroundColor: sector.color,
                        borderRadius: "2px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <h2
                        style={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          marginBottom: "3px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {sector.name}
                      </h2>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {sector.tagline}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: sector.color,
                        backgroundColor: sector.color + "18",
                        border: `0.5px solid ${sector.color}40`,
                        borderRadius: "4px",
                        padding: "3px 8px",
                      }}
                    >
                      {sector.companies.length} companies
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      style={{ color: "var(--text-muted)", display: "flex" }}
                    >
                      <ChevronDown size={16} strokeWidth={1.5} />
                    </motion.span>
                  </div>
                </button>

                {/* Expanded content with smooth motion layout */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          borderTop: "0.5px solid var(--border)",
                          padding: "26px",
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: "28px",
                        }}
                      >
                        {/* Description */}
                        <div>
                          <p
                            style={{
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              color: "var(--text-subtle)",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              marginBottom: "10px",
                            }}
                          >
                            Sector primer
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "var(--text-muted)",
                              lineHeight: 1.75,
                              maxWidth: "720px",
                            }}
                          >
                            {sector.description}
                          </p>
                        </div>

                        {/* Key metrics */}
                        <div>
                          <p
                            style={{
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              color: "var(--text-subtle)",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              marginBottom: "14px",
                            }}
                          >
                            Metrics to watch
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {sector.keyMetrics.map((m, i) => (
                              <motion.div
                                key={m.name}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "200px 1fr",
                                  gap: "16px",
                                  padding: "11px 14px",
                                  backgroundColor: "var(--surface-2)",
                                  border: "0.5px solid var(--border)",
                                  borderRadius: "6px",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  {m.name}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "var(--text-muted)",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {m.why}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Companies */}
                        <div>
                          <p
                            style={{
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              color: "var(--text-subtle)",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              marginBottom: "14px",
                            }}
                          >
                            Companies in coverage
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {sector.companies.map((c, i) => (
                              <motion.div
                                key={c.ticker}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04, duration: 0.25 }}
                              >
                                <Link
                                  href={`/companies/${c.ticker}`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "var(--surface-2)",
                                    border: "0.5px solid var(--border)",
                                    borderRadius: "6px",
                                    padding: "7px 11px",
                                    textDecoration: "none",
                                    transition: "border-color 0.15s ease",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={e =>
                                    ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                                      "rgba(255,255,255,0.12)")
                                  }
                                  onMouseLeave={e =>
                                    ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                                      "var(--border)")
                                  }
                                >
                                  <span
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      color: sector.color,
                                    }}
                                  >
                                    {c.ticker}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                    {c.name}
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
