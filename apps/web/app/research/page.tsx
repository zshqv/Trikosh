"use client";

import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Understand the business",
    body: "Before opening a spreadsheet, read the company's most recent annual report (10-K or 20-F). Understand what they sell, who they sell it to, how they make money, and what could go wrong. If you can't explain the business in two sentences, you're not ready to value it.",
  },
  {
    number: "02",
    title: "Map the sector context",
    body: "No company exists in a vacuum. Read the sector primer for your company's industry. Understand the competitive dynamics, regulatory environment, and the metrics that matter in this specific sector. A bank is not analysed like a software company.",
  },
  {
    number: "03",
    title: "Build the financial model",
    body: "Pull 5 years of income statements, balance sheets, and cash flow statements. Normalise them so they're comparable year-over-year. Calculate 12–15 key ratios. Look for trends, not snapshots. A single year's data tells you nothing — trajectory tells you everything.",
  },
  {
    number: "04",
    title: "Value the company",
    body: "Use at least two valuation methods. DCF for intrinsic value. Comparable company analysis for market-relative value. Precedent transactions if you're writing a potential M&A scenario. Triangulate. A price target is a range, not a number.",
  },
  {
    number: "05",
    title: "Write the investment thesis",
    body: "State in three sentences why this stock will outperform: the specific mispricing the market has made, the catalyst that will correct it, and what would prove you wrong. If you can't articulate the bear case clearly, your thesis is incomplete.",
  },
];

const DOS = [
  "Start with the business, not the numbers. A great financial model of a bad business is still a bad investment.",
  "Always cite your data sources. Where did the revenue figure come from? Which fiscal year?",
  "Use DM Mono or any monospace font for numbers in a published report. Mixed fonts in tables look unprofessional.",
  "State your assumptions explicitly. Every projection is only as good as the assumptions behind it.",
  "Compare across at least 3 years of data. One year is noise. Three years is a pattern.",
  "Write for a reader who doesn't know the company. Avoid jargon without definition.",
  "Include a valuation summary table — multiple methods side by side with price target range.",
];

const DONTS = [
  "Don't present a bull case without a bear case. It's not research, it's promotion.",
  "Don't copy management guidance into your model without questioning it. CFOs are optimistic by nature.",
  "Don't compare P/E ratios across different sectors. A 12x P/E for a bank vs. a 40x P/E for software says nothing without context.",
  "Don't ignore the cash flow statement. Net income can be manipulated; FCF is harder to fake.",
  "Don't write a price target without showing your work. A number without a model is noise.",
  "Don't use annual data when quarterly is more appropriate — especially for cyclical businesses.",
  "Don't confuse revenue growth with quality growth. Revenue from a one-time event inflates the top line without repeating.",
];

const PRIMERS = [
  {
    sector: "Financial Services",
    color: "#d4a853",
    keyMetrics: ["Net Interest Margin", "ROE", "Cost-to-Income Ratio", "NPL Ratio", "CET1 Capital Ratio"],
    watch: "Regulatory capital requirements change how much capital banks must hold, which directly affects ROE. Watch central bank policy — rate cycles dominate bank earnings more than most management decisions.",
    avoid: "Don't use gross margin or operating margin for banks — they're meaningless. Loan book quality matters far more than headline growth.",
  },
  {
    sector: "Healthcare",
    color: "#4aad7a",
    keyMetrics: ["R&D as % of Revenue", "Pipeline Stage Breakdown", "Revenue Concentration", "Operating Margin", "FCF Conversion"],
    watch: "The FDA or EMA approval calendar. A single drug approval can re-rate a pharma company by 20–30% overnight. Patent expiry timelines are equally important — model what happens when your biggest drug goes generic.",
    avoid: "Don't project linear revenue growth without accounting for patent cliffs. Always map the top-5 revenue drugs and their expiry dates before building a model.",
  },
  {
    sector: "Technology",
    color: "#6b9fd4",
    keyMetrics: ["Revenue Growth (YoY)", "Gross Margin", "R&D Intensity", "FCF Conversion", "Operating Leverage"],
    watch: "Semis and software behave differently. For semiconductors, book-to-bill ratio and capacity utilisation predict earnings quarters in advance. For software, watch net revenue retention — above 120% means the base grows without new sales.",
    avoid: "Don't use P/E for pre-profit software. Use EV/Revenue or EV/Gross Profit instead. Don't conflate hardware and software margins — NVIDIA's gross margin is ~74%; Infosys is ~33%. Both are 'technology.'",
  },
];

function FadeInUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        color: "var(--amber)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "14px",
      }}
    >
      {children}
    </p>
  );
}

export default function ResearchPage() {
  const [dlHovered, setDlHovered] = useState(false);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "40px" }}
        >
          <SectionLabel>Frameworks</SectionLabel>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Research
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              maxWidth: "560px",
              lineHeight: 1.7,
            }}
          >
            Everything you need to write your first equity research report. Not watered-down theory
            — actual frameworks used by analysts at investment banks and asset managers.
          </p>
        </motion.div>

        {/* Template download */}
        <FadeInUp>
          <section style={{ marginBottom: "48px" }}>
            <div
              style={{
                backgroundColor: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: "8px",
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--amber)",
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Downloadable template
                </p>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    marginBottom: "6px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Equity Research Report Template
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Excel workbook with pre-built income statement, balance sheet, ratio tracker, and
                  DCF model. Drop in your numbers and go.
                </p>
              </div>
              <a
                href="/api/template"
                download="trikosh-equity-research-template.xlsx"
                onMouseEnter={() => setDlHovered(true)}
                onMouseLeave={() => setDlHovered(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: dlHovered ? "var(--amber)" : "transparent",
                  color: dlHovered ? "#0a0a0a" : "var(--amber)",
                  border: "1px solid var(--amber)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  flexShrink: 0,
                  transition: "background-color 0.18s ease, color 0.18s ease",
                  cursor: "pointer",
                }}
              >
                <Download size={14} strokeWidth={2} />
                Download .xlsx
              </a>
            </div>
          </section>
        </FadeInUp>

        {/* Step-by-step guide */}
        <FadeInUp>
          <section style={{ marginBottom: "48px" }}>
            <SectionLabel>How to write an equity research report</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: "24px",
                    padding: "22px 0",
                    borderBottom: i < STEPS.length - 1 ? "0.5px solid var(--border)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "28px",
                      fontWeight: 300,
                      color: "var(--text-subtle)",
                      lineHeight: 1,
                      paddingTop: "4px",
                    }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        marginBottom: "7px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.75 }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* Dos and don'ts */}
        <FadeInUp>
          <section style={{ marginBottom: "48px" }}>
            <SectionLabel>Dos and don&apos;ts</SectionLabel>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--green)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    marginBottom: "14px",
                  }}
                >
                  DO
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  {DOS.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px" }}>
                      <span
                        style={{
                          color: "var(--green)",
                          fontSize: "14px",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        +
                      </span>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--red)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    marginBottom: "14px",
                  }}
                >
                  DON&apos;T
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  {DONTS.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px" }}>
                      <span
                        style={{
                          color: "var(--red)",
                          fontSize: "14px",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        –
                      </span>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInUp>

        {/* Sector primers */}
        <FadeInUp>
          <section>
            <SectionLabel>Sector primers</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {PRIMERS.map(({ sector, color, keyMetrics, watch, avoid }) => (
                <div
                  key={sector}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ borderLeft: `3px solid ${color}`, padding: "22px 26px" }}>
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        marginBottom: "18px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {sector}
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "18px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-subtle)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Key metrics
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {keyMetrics.map(m => (
                            <span
                              key={m}
                              style={{
                                fontSize: "11px",
                                color: color,
                                backgroundColor: color + "18",
                                border: `0.5px solid ${color}40`,
                                borderRadius: "4px",
                                padding: "3px 8px",
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-subtle)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          What to watch
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                          {watch}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-subtle)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                          }}
                        >
                          Common mistakes
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                          {avoid}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "28px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link
                href="/sectors"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)")
                }
              >
                Full sector breakdowns <ArrowRight size={12} />
              </Link>
              <Link
                href="/glossary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)")
                }
              >
                Glossary of terms <ArrowRight size={12} />
              </Link>
            </div>
          </section>
        </FadeInUp>

      </div>
    </div>
  );
}
