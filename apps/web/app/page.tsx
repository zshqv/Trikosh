"use client";

import Link from "next/link";
import { ArrowRight, Database, GitCompare, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Marquee } from "@/components/ui/marquee";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const MARQUEE_COMPANIES = [
  { ticker: "NVDA",  name: "NVIDIA",              rev: "$60.9B"  },
  { ticker: "MSFT",  name: "Microsoft",           rev: "$245.1B" },
  { ticker: "JPM",   name: "JPMorgan Chase",      rev: "$162.4B" },
  { ticker: "LLY",   name: "Eli Lilly",           rev: "$45.0B"  },
  { ticker: "GS",    name: "Goldman Sachs",       rev: "$46.3B"  },
  { ticker: "JNJ",   name: "Johnson & Johnson",   rev: "$88.8B"  },
  { ticker: "V",     name: "Visa",                rev: "$35.9B"  },
  { ticker: "UNH",   name: "UnitedHealth",        rev: "$372.0B" },
  { ticker: "ABBV",  name: "AbbVie",              rev: "$56.3B"  },
  { ticker: "ASML",  name: "ASML Holding",        rev: "$27.6B"  },
  { ticker: "TSM",   name: "Taiwan Semi",         rev: "$91.7B"  },
  { ticker: "AMD",   name: "Advanced Micro",      rev: "$22.7B"  },
  { ticker: "MS",    name: "Morgan Stanley",      rev: "$61.5B"  },
  { ticker: "SAP",   name: "SAP SE",              rev: "$36.0B"  },
  { ticker: "C",     name: "Citigroup",           rev: "$69.9B"  },
  { ticker: "NVS",   name: "Novartis",            rev: "$47.4B"  },
  { ticker: "HDB",   name: "HDFC Bank",           rev: "$24.1B"  },
  { ticker: "INFY",  name: "Infosys",             rev: "$18.6B"  },
];

const STATS = [
  { value: 30,  suffix: "",  label: "Companies" },
  { value: 3,   suffix: "",  label: "Sectors" },
  { value: 5,   suffix: "+", label: "Years of Data" },
];

const FEATURES = [
  {
    icon: <Database size={18} strokeWidth={1.5} />,
    title: "Standardised Data",
    body: "Raw financials from 30 global companies — cleaned, normalised, and structured the same way. No paywalls, no signups, no noise.",
  },
  {
    icon: <GitCompare size={18} strokeWidth={1.5} />,
    title: "Peer Comparison",
    body: "Place any two companies side by side across margins, multiples, and growth rates. See who wins each metric at a glance.",
  },
  {
    icon: <BookOpen size={18} strokeWidth={1.5} />,
    title: "Research Frameworks",
    body: "Step-by-step guides to writing equity research — sector primers, ratio walkthroughs, and a downloadable report template.",
  },
];

const SECTORS = [
  {
    name: "Financial Services",
    count: 11,
    description: "Banks, asset managers, insurance, and payments — the circulatory system of global capital.",
    tickers: ["JPM", "GS", "MS", "V", "UBS"],
  },
  {
    name: "Healthcare",
    count: 9,
    description: "Pharma giants and diversified health conglomerates spanning the US, Europe, and India.",
    tickers: ["JNJ", "LLY", "PFE", "UNH", "ABBV"],
  },
  {
    name: "Technology",
    count: 8,
    description: "Semiconductors, enterprise software, and IT services shaping the next decade of productivity.",
    tickers: ["NVDA", "MSFT", "ASML", "TSM", "AMD"],
  },
];

function FadeInUp({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      style={style}
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
        marginBottom: "16px",
      }}
    >
      {children}
    </p>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        position: "relative",
        backgroundColor: "var(--surface)",
        padding: "32px",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Amber top border that slides in on hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: "var(--amber)",
          transformOrigin: "left",
        }}
      />
      <div style={{ color: "var(--amber)", marginBottom: "16px" }}>
        {icon}
      </div>
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 500,
          marginBottom: "10px",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
        {body}
      </p>
    </motion.div>
  );
}

function MarqueeCard({ ticker, name, rev }: { ticker: string; name: string; rev: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        backgroundColor: "var(--surface)",
        border: "0.5px solid var(--border)",
        borderRadius: "6px",
        padding: "10px 14px",
        minWidth: "220px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--amber)",
            minWidth: "44px",
          }}
        >
          {ticker}
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{name}</span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--text-subtle)",
          flexShrink: 0,
        }}
      >
        {rev}
      </span>
    </div>
  );
}

export default function LandingPage() {
  const [primaryHovered, setPrimaryHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        position: "relative",
      }}
    >
      {/* Dot grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Hero ── */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "68px 24px 56px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left: headline + CTAs */}
            <FadeInUp>
              <SectionLabel>Open-source · Free forever</SectionLabel>
              <h1
                style={{
                  fontSize: "clamp(34px, 5.5vw, 68px)",
                  fontWeight: 500,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  marginBottom: "22px",
                }}
              >
                Not to replace thinking.
                <br />
                <span style={{ color: "var(--text-muted)" }}>
                  To make thinking possible.
                </span>
              </h1>

              <p
                style={{
                  fontSize: "clamp(14px, 1.8vw, 17px)",
                  color: "var(--text-muted)",
                  maxWidth: "480px",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                }}
              >
                Trikosh gives students free access to standardised financial data
                for 30 global companies — built for equity research, not trading.
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {/* Primary CTA: border-only, fills on hover */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    href="/companies"
                    onMouseEnter={() => setPrimaryHovered(true)}
                    onMouseLeave={() => setPrimaryHovered(false)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: primaryHovered ? "var(--amber)" : "transparent",
                      color: primaryHovered ? "#0a0a0a" : "var(--amber)",
                      border: "1px solid var(--amber)",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      textDecoration: "none",
                      transition: "background-color 0.18s ease, color 0.18s ease",
                      cursor: "pointer",
                    }}
                  >
                    Explore Companies
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                </motion.div>

                <a
                  href="https://github.com/ashutoshatri/trikosh"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "transparent",
                    color: "var(--text-muted)",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 500,
                    border: "0.5px solid rgba(255,255,255,0.10)",
                    textDecoration: "none",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--text-primary)";
                    el.style.borderColor = "rgba(255,255,255,0.20)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--text-muted)";
                    el.style.borderColor = "rgba(255,255,255,0.10)";
                  }}
                >
                  <GithubIcon size={15} />
                  View on GitHub
                </a>
              </div>
            </FadeInUp>

            {/* Right: vertical marquee */}
            <FadeInUp delay={0.12}>
              <div
                style={{
                  height: "340px",
                  overflow: "hidden",
                  borderRadius: "10px",
                  border: "0.5px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  position: "relative",
                }}
              >
                {/* Fade masks top + bottom */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "64px",
                    background: "linear-gradient(to bottom, var(--surface), transparent)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "64px",
                    background: "linear-gradient(to top, var(--surface), transparent)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
                <Marquee
                  vertical
                  pauseOnHover
                  className="[--duration:28s] [--gap:8px]"
                  style={{ height: "100%", padding: "12px" }}
                >
                  {MARQUEE_COMPANIES.map(c => (
                    <MarqueeCard key={c.ticker} {...c} />
                  ))}
                </Marquee>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <FadeInUp>
          <section
            style={{
              borderTop: "0.5px solid var(--border)",
              borderBottom: "0.5px solid var(--border)",
            }}
          >
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 24px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              {STATS.map(({ value, suffix, label }, i) => (
                <div
                  key={label}
                  style={{
                    padding: "22px 0",
                    textAlign: "center",
                    borderRight: i < STATS.length - 1 ? "0.5px solid var(--border)" : "none",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "28px",
                      fontWeight: 500,
                      color: "var(--amber)",
                      marginBottom: "4px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <NumberTicker
                      value={value}
                      className="text-amber"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "28px",
                        fontWeight: 500,
                        color: "var(--amber)",
                        letterSpacing: "-0.02em",
                      }}
                    />
                    {suffix}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* ── Features ── */}
        <FadeInUp>
          <section
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "56px 24px",
            }}
          >
            <SectionLabel>What Trikosh does</SectionLabel>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1px",
                border: "0.5px solid var(--border)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {FEATURES.map(({ icon, title, body }, i) => (
                <div
                  key={title}
                  style={{
                    borderRight:
                      i < FEATURES.length - 1 ? "0.5px solid var(--border)" : "none",
                  }}
                >
                  <FeatureCard icon={icon} title={title} body={body} />
                </div>
              ))}
            </div>
          </section>
        </FadeInUp>

        {/* ── Sector showcase ── */}
        <FadeInUp>
          <section
            style={{
              borderTop: "0.5px solid var(--border)",
              padding: "56px 0",
            }}
          >
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: "36px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <SectionLabel>Coverage</SectionLabel>
                <Link
                  href="/sectors"
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)")
                  }
                >
                  All sectors <ArrowRight size={12} />
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "12px",
                }}
              >
                {SECTORS.map(({ name, count, description, tickers }) => (
                  <Link
                    key={name}
                    href="/sectors"
                    style={{
                      display: "block",
                      backgroundColor: "var(--surface)",
                      border: "0.5px solid var(--border)",
                      borderRadius: "8px",
                      padding: "24px",
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <h3
                        style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}
                      >
                        {name}
                      </h3>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: "var(--amber)",
                          backgroundColor: "rgba(212,168,83,0.10)",
                          border: "0.5px solid rgba(212,168,83,0.25)",
                          borderRadius: "4px",
                          padding: "2px 8px",
                        }}
                      >
                        {count} co.
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        lineHeight: 1.65,
                        marginBottom: "18px",
                      }}
                    >
                      {description}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {tickers.map(t => (
                        <span
                          key={t}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            color: "var(--text-subtle)",
                            backgroundColor: "var(--surface-2)",
                            border: "0.5px solid var(--border)",
                            borderRadius: "3px",
                            padding: "2px 6px",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "var(--text-subtle)",
                          padding: "2px 6px",
                        }}
                      >
                        +{count - tickers.length} more
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </FadeInUp>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "0.5px solid var(--border)",
            marginTop: "56px",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "48px 24px 32px",
            }}
          >
            <div style={{ marginBottom: "40px" }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "var(--amber)",
                  marginBottom: "8px",
                }}
              >
                Trikosh
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-subtle)",
                  maxWidth: "320px",
                  lineHeight: 1.6,
                }}
              >
                Financial research infrastructure for students who have no one to guide them.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "40px",
                marginBottom: "40px",
              }}
            >
              {[
                {
                  heading: "Explore",
                  links: [
                    { label: "Companies", href: "/companies" },
                    { label: "Sectors",   href: "/sectors" },
                    { label: "Compare",   href: "/compare" },
                  ],
                },
                {
                  heading: "Learn",
                  links: [
                    { label: "Glossary",  href: "/glossary" },
                    { label: "Research",  href: "/research" },
                    { label: "About",     href: "/about" },
                  ],
                },
                {
                  heading: "Project",
                  links: [
                    { label: "GitHub",       href: "https://github.com/ashutoshatri/trikosh" },
                    { label: "MIT License",  href: "https://github.com/ashutoshatri/trikosh/blob/main/LICENSE" },
                    { label: "Data Sources", href: "/about#data" },
                  ],
                },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-subtle)",
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      marginBottom: "14px",
                    }}
                  >
                    {heading}
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          style={{
                            fontSize: "13px",
                            color: "var(--text-muted)",
                            textDecoration: "none",
                            transition: "color 0.15s ease",
                          }}
                          onMouseEnter={e =>
                            ((e.currentTarget as HTMLAnchorElement).style.color =
                              "var(--text-primary)")
                          }
                          onMouseLeave={e =>
                            ((e.currentTarget as HTMLAnchorElement).style.color =
                              "var(--text-muted)")
                          }
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "0.5px solid var(--border)",
                paddingTop: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <p style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                © {new Date().getFullYear()} Trikosh. MIT License.
              </p>
              <div style={{ display: "flex", gap: "20px" }}>
                {["Privacy", "Terms", "MIT License"].map(item => (
                  <span key={item} style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Responsive hero grid ── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
