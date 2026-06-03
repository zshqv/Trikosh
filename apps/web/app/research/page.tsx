'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import TracingBeam from '@/components/aceternity/TracingBeam'
import { Reveal } from '@/components/effects/Reveal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List, PieChart, GitCompare, BookOpen, BookMarked, FileText, GitBranch, Info } from 'lucide-react'

/* ── Step data — tagColors updated to muted palette ─────────────────── */

const STEPS = [
  {
    number: '01',
    title: 'Understand the Business Before You Touch a Single Number',
    duration: '2–4 hours',
    tag: 'Qualitative',
    tagColor: '#e5e1e4',
    body: [
      "Read the most recent annual report cover-to-cover — not the summary, the full document. Management's tone, risk factor language, and footnotes reveal far more than the headline numbers.",
      "Map the revenue model precisely: is the company selling products, subscriptions, transaction fees, or a mix? Pricing power and switching costs are the most predictive long-run moat indicators.",
      "Identify the three to five decisions management made over the past five years that define the current capital structure. M&A choices, dividend policy, and buyback timing tell you about capital allocation discipline.",
      "Understand who the customer is and how concentrated revenue is. A single customer representing more than 15% of revenue is a material risk that must be repriced into your thesis.",
      "Read competitor filings for the same period. Industry dynamics only become visible when you hold multiple 10-Ks side by side.",
    ],
    checklist: [
      'Annual report and 10-K for the last 3 years read in full',
      'Revenue model and pricing structure documented',
      'Top 5 customers and revenue concentration noted',
      'Management track record on capital allocation assessed',
      'Key risk factors highlighted and ranked by probability',
      'Business model change or pivot in last 5 years identified',
    ],
  },
  {
    number: '02',
    title: 'Map the Industry and Establish the Competitive Context',
    duration: '2–3 hours',
    tag: 'Sector Analysis',
    tagColor: '#8e9193',
    body: [
      "Apply Porter's Five Forces as a structured checklist, not a narrative. Score each force 1–5 and document the evidence. Industries with three or more forces scoring 4+ are structurally unfavourable regardless of individual company quality.",
      "Identify the top four or five direct competitors by revenue, and note their market share trend over the last three years. Market share gains in a flat industry are more valuable than growth in an expanding one.",
      "Map where the company sits on the value chain. Upstream suppliers and downstream distributors with pricing power can quietly compress margins even in good revenue environments.",
      "Assess regulatory exposure by sector. Financial Services and Healthcare carry embedded regulatory risk that must be explicitly modelled as a scenario, not footnoted.",
      "Identify one or two secular tailwinds and one or two potential disruptors. Avoid the temptation to call every tailwind structural — most are cyclical.",
    ],
    checklist: [
      "Porter's Five Forces completed with scored evidence",
      'Top 5 competitors identified with market share data',
      'Value chain position and supplier/distributor power mapped',
      'Regulatory environment summarised by jurisdiction',
      'Secular tailwinds vs. cyclical upswings distinguished',
    ],
    warning: 'Do not conflate industry growth with company-level opportunity. A fast-growing market with low barriers is often more competitive, not less.',
  },
  {
    number: '03',
    title: 'Dissect the Three Financial Statements in Sequence',
    duration: '3–5 hours',
    tag: 'Quantitative Core',
    tagColor: '#c4c7c9',
    body: [
      "Start with the income statement but only after reading the revenue recognition policy in the notes. Aggressive revenue recognition — bill-and-hold, percentage of completion, channel stuffing — distorts every downstream ratio.",
      "Build a five-year trend table for every major income statement line: revenue, gross profit, EBITDA, EBIT, net income, and EPS. Directional changes in gross margin are the earliest signal of pricing power erosion or input cost pressure.",
      "Move to the balance sheet with one question in mind: is the asset base growing as fast as revenue? Faster asset growth than revenue growth signals either capital intensity creep or working capital deterioration.",
      "Analyse the cash flow statement as the ground truth. Free cash flow = operating cash flow minus maintenance capex. A company that consistently earns accounting profits but generates no FCF is either growing aggressively or masking accruals.",
      "Reconcile net income to operating cash flow explicitly. Large and persistent differences — especially if accruals are rising as a percentage of assets — are the most reliable early warning sign in academic forensic accounting literature.",
      "Check the footnotes for off-balance-sheet obligations: operating lease commitments, pension deficits, and contingent liabilities. These often represent ten to thirty percent of enterprise value in capital-intensive sectors.",
    ],
    checklist: [
      'Revenue recognition policy read and anomalies flagged',
      'Five-year income statement trend table built',
      'Gross margin trend charted and explained',
      'Working capital cycle (DSO, DIO, DPO) calculated for 5 years',
      'Free cash flow calculated and reconciled to net income',
      'Off-balance-sheet obligations quantified from footnotes',
    ],
  },
  {
    number: '04',
    title: 'Compute and Interpret All 15 Standardised Ratios',
    duration: '1–2 hours',
    tag: 'Ratio Analysis',
    tagColor: '#e5e1e4',
    body: [
      "Calculate all ratios from the standardised set: profitability (gross margin, EBITDA margin, net margin, ROE, ROA, ROCE), leverage (debt-to-equity, net debt-to-EBITDA, interest coverage), liquidity (current ratio, quick ratio), efficiency (asset turnover, FCF margin), and valuation (P/E, EV/EBITDA).",
      "Never interpret a ratio in isolation. Every ratio only becomes meaningful when compared against: (1) the company's own five-year history, (2) the sector median, and (3) the company's closest peer group.",
      "Weight ratios by sector relevance. A pharmaceutical company's interest coverage ratio matters far less than its R&D-to-revenue ratio. Build a primary/avoid matrix for the sector before ranking findings.",
      "Flag any ratio that is more than one standard deviation outside the peer group median. These outliers are not automatically red flags — they may represent genuine competitive differentiation — but every outlier requires a documented explanation.",
    ],
    checklist: [
      'All 15 ratios calculated from audited financials',
      'Five-year trend table built for each ratio',
      'Peer group median computed for comparison',
      'Outlier ratios (>1 SD from peer median) flagged and explained',
      'Sector-specific primary ratio set applied',
    ],
  },
  {
    number: '05',
    title: 'Build the Peer Comparison Table',
    duration: '1–2 hours',
    tag: 'Relative Valuation',
    tagColor: '#8e9193',
    body: [
      "Select four to six true peers — companies that operate in the same sub-industry, serve similar customers, and have comparable business models. Market cap similarity is secondary; business model similarity is primary.",
      "Build a single comparison table with the five most relevant ratios for the sector, trailing-twelve-month actuals, and forward consensus estimates. Highlight where the subject company trades at a premium or discount and by how much.",
      "Premium or discount is only meaningful relative to growth. Compute a PEG ratio or EV/EBITDA-to-growth ratio to normalise for growth differences across the peer set.",
      "Document why each outlier multiple is or is not justified. 'It deserves a premium because it grows faster' is not an argument without the maths behind it.",
      "Identify re-rating catalysts: what specific operational or strategic event could compress or expand the valuation multiple over your investment horizon?",
    ],
    checklist: [
      'Peer set of 4–6 true business model comparables identified',
      'Peer comparison table with 5 sector-relevant ratios built',
      'Premium/discount to peer median quantified',
      'Growth-adjusted multiple (PEG or EV/EBITDA-to-growth) computed',
      'Re-rating catalysts documented with probability and timeline',
    ],
  },
  {
    number: '06',
    title: 'Build the DCF and Stress-Test Your Assumptions',
    duration: '3–4 hours',
    tag: 'Intrinsic Valuation',
    tagColor: '#c4c7c9',
    body: [
      "Build a five-year explicit forecast period using bottom-up revenue drivers — volume, price, mix — not top-down percentage growth assumptions. Your forecast is only as good as the operating assumptions beneath it.",
      "Derive the WACC from first principles: risk-free rate (use 10-year government bond yield), equity risk premium (Damodaran's country-adjusted estimate), beta (regressed against a relevant index, 5-year weekly), and after-tax cost of debt from the latest bond offering or credit facility.",
      "Terminal value typically represents sixty to eighty percent of a DCF output. Apply both the Gordon Growth Model and an exit multiple method; if they diverge by more than twenty percent, your growth assumptions are inconsistent with the market.",
      "Run three scenarios minimum: base case (management guidance haircut by 15%), bull case (consensus analyst estimates), bear case (mean-reversion to sector median margins). Weight them explicitly: do not average equally.",
      "Perform a two-way sensitivity table on WACC and terminal growth rate. If your buy thesis only holds in a narrow band of that table, the conviction level should be reduced regardless of the base case output.",
    ],
    checklist: [
      'Five-year revenue model built from volume × price × mix',
      'WACC derived from first principles (not assumed)',
      'Terminal value cross-checked with exit multiple method',
      'Three scenarios built with explicit probability weighting',
      'Two-way WACC × terminal growth sensitivity table completed',
      'Implied share price vs. current price gap documented',
    ],
    warning: 'A DCF output is not a price target. It is a sensitivity framework. Quote a range, not a point estimate, and always disclose your key assumptions.',
  },
  {
    number: '07',
    title: 'Write the Research Note',
    duration: '2–3 hours',
    tag: 'Communication',
    tagColor: '#e5e1e4',
    body: [
      "Lead with the investment thesis in two sentences maximum. A thesis that requires three sentences is not yet sharp enough. The reader should be able to repeat your core argument after one reading.",
      "Structure the note: thesis → key risks → financial summary → valuation → appendices. Never bury the recommendation or equivocate in the opening section. Conviction must be explicit.",
      "Every claim in the note must be traceable to a source: a filed document, a data table you built, or an industry reference. 'Management expects strong growth' is not a claim — 'management guided 12–15% revenue growth in Q3 earnings call' is.",
      "State your key assumptions explicitly and explain why you disagree with consensus where you do. The value of original research is the disagreement, not the restatement of what others already know.",
      "Include a risk section with at least three specific, quantified risks — not generic market risk disclosures. For each risk, state the probability, the potential impact on your price target, and what would cause you to change your view.",
    ],
    checklist: [
      'Investment thesis stated in two sentences or fewer',
      'Recommendation and conviction level explicit in opening',
      'Every factual claim traced to a primary source',
      'Key assumption divergence from consensus documented',
      'Three specific, quantified risks included with probability and impact',
      'Note reviewed for logical consistency between thesis and valuation',
    ],
  },
]

const SECTOR_RATIOS = {
  'Financial Services': {
    primary: ['ROE', 'ROA', 'Net Interest Margin', 'Debt/Equity', 'Interest Coverage'],
    avoid: ['Current Ratio (use LCR instead)', 'Quick Ratio', 'Inventory-based metrics'],
  },
  'AI & Technology': {
    primary: ['FCF Margin', 'Revenue Growth YoY', 'Gross Margin', 'EV/Revenue', 'R&D as % Revenue'],
    avoid: ['Debt/EBITDA (often negative EBITDA in growth phase)', 'Asset Turnover (low for SaaS)'],
  },
  'Healthcare': {
    primary: ['Gross Margin', 'R&D as % Revenue', 'Operating Margin', 'Interest Coverage', 'EV/EBITDA'],
    avoid: ['Asset Turnover (capital intensive)', 'Same-store metrics'],
  },
  'Consumer & Retail': {
    primary: ['Gross Margin', 'Asset Turnover', 'Current Ratio', 'CapEx to Revenue', 'EBITDA Margin'],
    avoid: ['ROA without adjusting for operating leases', 'EV/Revenue alone (low margins distort)'],
  },
  'Consumer Internet & Digital Platforms': {
    primary: ['Revenue Growth YoY', 'EBITDA Margin', 'FCF Margin', 'User Metrics', 'EV/Revenue'],
    avoid: ['P/E in early growth phase (often not profitable)', 'Traditional liquidity ratios'],
  },
} as const

type SectorKey = keyof typeof SECTOR_RATIOS

/* ── Sidebar nav definition ──────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'HOME',      href: '/',          Icon: LayoutDashboard },
  { label: 'COMPANIES', href: '/companies', Icon: List            },
  { label: 'SECTORS',   href: '/sectors',   Icon: PieChart        },
  { label: 'COMPARE',   href: '/compare',   Icon: GitCompare      },
  { label: 'RESEARCH',  href: '/research',  Icon: BookOpen        },
  { label: 'GLOSSARY',  href: '/glossary',  Icon: BookMarked      },
  { label: 'ABOUT',     href: '/about',     Icon: Info            },
] as const

/* ── Page ────────────────────────────────────────────────────────────── */

export default function ResearchPage() {
  const pathname = usePathname()
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [activeSector, setActiveSector] = useState<SectorKey | null>(null)
  const reduce = useReducedMotion()

  return (
    <div className="flex min-h-screen bg-[#131315]">

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside style={{
        width: '256px',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#131315',
        borderRight: '1px solid #444749',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 40,
      }}>
        {/* Wordmark + identity block */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(68,71,73,0.5)', flexShrink: 0 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '17px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              display: 'block',
              marginBottom: '6px',
            }}>
              Trikosh
            </span>
          </Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8e9193', margin: '0 0 2px' }}>
            Institutional
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', color: '#8e9193', margin: 0 }}>
            ID: 8829-QX
          </p>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_LINKS.map(({ label, href, Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 18px 9px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  color: active ? '#ffffff' : '#c4c7c9',
                  textDecoration: 'none',
                  backgroundColor: active ? '#2a2a2c' : 'transparent',
                  borderLeft: active ? '2px solid #ffffff' : '2px solid transparent',
                  transition: 'background-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.backgroundColor = '#1c1b1d'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon size={14} strokeWidth={1.5} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div style={{ flexShrink: 0, borderTop: '1px solid rgba(68,71,73,0.5)', padding: '10px 0' }}>
          {([
            { label: 'DOCS',   href: '#',                  Icon: FileText  },
            { label: 'GITHUB', href: 'https://github.com', Icon: GitBranch },
          ] as const).map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: '#8e9193',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#c4c7c9' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#8e9193' }}
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </a>
          ))}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div style={{ background: '#131315', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

          {/* Page header */}
          <div style={{ borderBottom: '1px solid #444749', backgroundColor: '#131315' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 28px' }}>
              <Reveal>
                <div style={{
                  display: 'inline-block',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#c4c7c9',
                  background: '#1c1b1d',
                  border: '1px solid #444749',
                  padding: '4px 10px',
                  borderRadius: 4,
                  marginBottom: 16,
                }}>
                  Trikosh Research Framework · 7 Steps
                </div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 700,
                  color: '#e5e2e1',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  margin: '0 0 14px',
                }}>
                  How to Build an Equity Research Report From Scratch
                </h1>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  color: '#8e9192',
                  lineHeight: 1.7,
                  maxWidth: 600,
                  margin: '0 0 24px',
                }}>
                  A practitioner&apos;s checklist for conducting rigorous, professional-grade equity research —
                  from qualitative business understanding through to a written investment thesis.
                </p>
                <a
                  href="/Trikosh_Equity_Research_Template.xlsx"
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: '#ffffff',
                    color: '#131315',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '9px 18px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                  }}
                >
                  <span style={{ fontSize: 14 }}>↓</span> Download Excel Template
                </a>
              </Reveal>
            </div>
          </div>

          <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 80px' }}>
            <TracingBeam>

              {/* Sector Ratio Guide */}
              <Reveal style={{
                background: '#1c1b1d',
                border: '1px solid #444749',
                borderRadius: 10,
                padding: '22px',
                marginBottom: 32,
              }}>
                <div style={{ marginBottom: 14 }}>
                  <span style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: '#8e9192',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    Sector Ratio Guide
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13.5,
                    color: '#8e9192',
                    margin: '6px 0 0',
                  }}>
                    Select your sector to see which ratios matter most — and which to deprioritise.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: activeSector ? 20 : 0 }}>
                  {(Object.keys(SECTOR_RATIOS) as SectorKey[]).map((sector) => (
                    <button
                      key={sector}
                      onClick={() => setActiveSector(activeSector === sector ? null : sector)}
                      style={{
                        fontSize: 12,
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 500,
                        padding: '5px 13px',
                        borderRadius: 20,
                        border: '1px solid #444749',
                        background: activeSector === sector ? '#ffffff' : '#1c1b1d',
                        color: activeSector === sector ? '#131315' : '#8e9192',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {sector}
                    </button>
                  ))}
                </div>

                {activeSector && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    paddingTop: 16,
                    borderTop: '1px solid #383838',
                  }}>
                    <div>
                      <div style={{
                        fontSize: 9.5,
                        fontFamily: 'var(--font-mono)',
                        color: '#059669',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: 10,
                      }}>
                        Primary Ratios
                      </div>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {SECTOR_RATIOS[activeSector].primary.map((r) => (
                          <li key={r} style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 13,
                            color: '#e5e2e1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}>
                            <span style={{ color: '#059669', fontWeight: 700, fontSize: '11px' }}>✓</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 9.5,
                        fontFamily: 'var(--font-mono)',
                        color: '#DC2626',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: 10,
                      }}>
                        Deprioritise
                      </div>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {SECTOR_RATIOS[activeSector].avoid.map((r) => (
                          <li key={r} style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 13,
                            color: '#8e9192',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                          }}>
                            <span style={{ color: '#DC2626', fontWeight: 700, flexShrink: 0, fontSize: '11px' }}>✗</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Reveal>

              {/* Steps Accordion */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STEPS.map((step) => {
                  const isOpen = activeStep === step.number
                  return (
                    <motion.div
                      key={step.number}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{
                        background: '#1c1b1d',
                        border: isOpen ? `1px solid ${step.tagColor}60` : '1px solid #444749',
                        borderRadius: 10,
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <button
                        onClick={() => setActiveStep(isOpen ? null : step.number)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          padding: '16px 20px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 150ms ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2c'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                        }}
                      >
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          fontWeight: 700,
                          color: step.tagColor,
                          minWidth: 24,
                          flexShrink: 0,
                          opacity: 0.9,
                        }}>
                          {step.number}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 14.5,
                            fontWeight: 600,
                            color: '#e5e2e1',
                            lineHeight: 1.3,
                          }}>
                            {step.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10.5,
                              fontWeight: 600,
                              color: step.tagColor,
                              background: '#1c1b1d',
                              border: `1px solid ${step.tagColor}30`,
                              padding: '2px 8px',
                              borderRadius: 3,
                            }}>
                              {step.tag}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                              color: '#8e9192',
                            }}>
                              {step.duration}
                            </span>
                          </div>
                        </div>
                        <span style={{
                          fontSize: 16,
                          color: '#8e9192',
                          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          flexShrink: 0,
                        }}>
                          ›
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{ padding: '0 20px 22px', borderTop: '1px solid #2a2a2c' }}>
                          {step.warning && (
                            <div style={{
                              background: 'rgba(217,119,6,0.06)',
                              border: '1px solid rgba(217,119,6,0.2)',
                              borderRadius: 6,
                              padding: '10px 14px',
                              margin: '14px 0',
                              fontSize: 13,
                              fontFamily: 'var(--font-sans)',
                              color: '#D97706',
                              lineHeight: 1.6,
                            }}>
                              <strong>Note:</strong> {step.warning}
                            </div>
                          )}

                          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {step.body.map((para, idx) => (
                              <p key={idx} style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: 13.5,
                                color: '#8e9192',
                                lineHeight: 1.75,
                                margin: 0,
                              }}>
                                {para}
                              </p>
                            ))}
                          </div>

                          <div style={{ marginTop: 22 }}>
                            <div style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 9.5,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              color: '#8e9192',
                              marginBottom: 12,
                            }}>
                              Step Checklist
                            </div>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {step.checklist.map((item, idx) => (
                                <li key={idx} style={{
                                  fontFamily: 'var(--font-sans)',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 10,
                                  fontSize: 13,
                                  color: '#e5e2e1',
                                  lineHeight: 1.5,
                                }}>
                                  <span style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 3,
                                    border: `1px solid ${step.tagColor}40`,
                                    background: `${step.tagColor}08`,
                                    flexShrink: 0,
                                    marginTop: 1,
                                    display: 'inline-block',
                                  }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 48,
                paddingTop: 22,
                borderTop: '1px solid #383838',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: '#8e9192',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  Trikosh Research Framework · For educational purposes only · Not investment advice
                </p>
              </div>

            </TracingBeam>
          </div>
        </div>
      </main>
    </div>
  )
}
