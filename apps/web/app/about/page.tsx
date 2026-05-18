"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const STACK = [
  { name: "Next.js 14",     role: "App framework, API routes, file-based routing" },
  { name: "PostgreSQL",     role: "Primary data store — 6 tables, 30 companies" },
  { name: "Clerk",          role: "Authentication — no hand-rolled auth" },
  { name: "Recharts",       role: "Data visualisation — charts on company pages" },
  { name: "Motion",         role: "Page transitions and micro-animations" },
  { name: "shadcn/ui",      role: "Base UI primitives, adapted to Trikosh design system" },
  { name: "yfinance",       role: "Python data pipeline — 5 years of financial data" },
  { name: "DM Sans + Mono", role: "Typography — Google Fonts" },
];

const PRINCIPLES = [
  {
    heading: "Data before opinion",
    body: "Trikosh does not tell you what to think about a company. It gives you the numbers, the definitions, and the frameworks. The analysis is yours to make.",
  },
  {
    heading: "No paywalls, ever",
    body: "The financial data that institutional investors access through Bloomberg terminals is not the data students have access to. Trikosh closes that gap, permanently and for free.",
  },
  {
    heading: "Standardised over exhaustive",
    body: "30 companies done properly is more useful than 3,000 companies done inconsistently. Every company in Trikosh follows the same schema, the same 5-year window, the same 15 ratios.",
  },
  {
    heading: "Research is a skill, not a credential",
    body: "The ability to read a balance sheet, model a DCF, or write an equity research report should not require a finance degree or an internship at a bank. It requires access to good information and frameworks.",
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

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 72px" }}>

        {/* Etymology */}
        <FadeInUp>
          <section style={{ marginBottom: "52px" }}>
            <SectionLabel>Etymology</SectionLabel>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                marginBottom: "16px",
                lineHeight: 1.1,
              }}
            >
              Trikosh
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text-subtle)",
                marginBottom: "18px",
                letterSpacing: "0.04em",
              }}
            >
              Sanskrit: त्रिकोश
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: "14px",
              }}
            >
              In Sanskrit, <em>tri</em> means three. <em>Kosha</em> means sheath, layer, or treasury.
              In Vedantic philosophy, the Panchakosha model describes five sheaths that envelop
              consciousness, from the gross physical body to the deepest, subtlest self.
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: "16px",
              }}
            >
              Trikosh borrows from this tradition. Three layers of financial understanding, each one
              closer to the truth than the last:
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "18px 0 18px 24px",
                borderLeft: "2px solid var(--amber)",
              }}
            >
              {[
                { layer: "Data",     description: "The raw numbers. Revenue, margins, ratios." },
                { layer: "Analysis", description: "What those numbers mean in context. Trends, comparisons, anomalies." },
                { layer: "Insight",  description: "The judgment that turns analysis into a view. An investment thesis." },
              ].map(({ layer, description }) => (
                <div key={layer} style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      color: "var(--amber)",
                      fontWeight: 500,
                      minWidth: "72px",
                    }}
                  >
                    {layer}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{description}</span>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginTop: "18px",
              }}
            >
              Trikosh can only give you the first layer reliably. The second, partially. The third is
              entirely yours.
            </p>
          </section>
        </FadeInUp>

        {/* Philosophy */}
        <FadeInUp>
          <section
            style={{
              marginBottom: "52px",
              borderTop: "0.5px solid var(--border)",
              paddingTop: "40px",
            }}
          >
            <SectionLabel>Philosophy</SectionLabel>

            <blockquote
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.4,
                color: "var(--text-primary)",
                marginBottom: "32px",
                borderLeft: "none",
                padding: 0,
              }}
            >
              "Not to replace thinking.
              <br />
              <span style={{ color: "var(--text-muted)" }}>To make thinking possible."</span>
            </blockquote>

            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {PRINCIPLES.map(({ heading, body }) => (
                <div key={heading}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {heading}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.75 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* For the student */}
        <FadeInUp>
          <section
            style={{
              marginBottom: "52px",
              borderTop: "0.5px solid var(--border)",
              paddingTop: "40px",
            }}
          >
            <SectionLabel>Who this is for</SectionLabel>

            <h2
              style={{
                fontSize: "clamp(20px, 3vw, 26px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                marginBottom: "18px",
                lineHeight: 1.3,
              }}
            >
              For the student who has no one to guide them.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                "The student who doesn't go to a target school, who doesn't have family in finance, who doesn't have a mentor who'll walk them through a DCF at 11pm before the interview.",
                "The student who found a 10-K online but didn't know what to do with it. Who Googled 'what is EBITDA' and got a Wikipedia article. Who wanted to write an equity research report but couldn't find a template that wasn't behind a paywall.",
                "Trikosh is for that student. Every piece of it — the data, the glossary, the research guide, the sector primers — was built with that student in mind.",
                "Access to good financial information should not be gated by where you study, who you know, or how much you can afford. That's the only reason this exists.",
              ].map((para, i) => (
                <p key={i} style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8 }}>
                  {para}
                </p>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* Tech stack */}
        <FadeInUp>
          <section
            style={{
              marginBottom: "52px",
              borderTop: "0.5px solid var(--border)",
              paddingTop: "40px",
            }}
          >
            <SectionLabel>Tech stack</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {STACK.map(({ name, role }, i) => (
                <div
                  key={name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    gap: "24px",
                    padding: "12px 0",
                    borderBottom: i < STACK.length - 1 ? "0.5px solid var(--border)" : "none",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {name}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{role}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* Open source */}
        <FadeInUp>
          <section id="data" style={{ borderTop: "0.5px solid var(--border)", paddingTop: "40px" }}>
            <SectionLabel>Open source</SectionLabel>

            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: "18px",
              }}
            >
              Trikosh is MIT licensed and completely open source. The data pipeline, the web
              application, the database schema — all of it is on GitHub. Fork it, extend it, run it
              locally. If you spot an error in the data, open an issue. If you want to add a company
              or a ratio, open a pull request.
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              Financial data is sourced via yfinance from public filings. All data is provided for
              educational purposes only. This is not financial advice.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://github.com/ashutoshatri/trikosh"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "var(--surface)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                  borderRadius: "6px",
                  padding: "10px 18px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  transition: "border-color 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(255,255,255,0.20)")
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(255,255,255,0.10)")
                }
              >
                <GithubIcon size={15} />
                View on GitHub
              </a>
              <Link
                href="/companies"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "transparent",
                  border: "0.5px solid var(--border)",
                  borderRadius: "6px",
                  padding: "10px 18px",
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
                <ExternalLink size={14} strokeWidth={1.5} />
                Explore companies
              </Link>
            </div>
          </section>
        </FadeInUp>

      </div>
    </div>
  );
}
