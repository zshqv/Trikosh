import Link from 'next/link'
import { NumberTicker } from '@/components/ui/number-ticker'

const STATS = [
  { value: 102, label: 'Companies' },
  { value: 5,   label: 'Sectors'   },
  { value: 15,  label: 'Ratios'    },
]

const GS_ROWS = [
  { metric: 'Revenue',        fy2022: '$47.4B',  fy2023: '$46.3B',  fy2024: '$53.5B',  fy2025: '$58.3B'  },
  { metric: 'Net Income',     fy2022: '$11.3B',  fy2023: '$8.5B',   fy2024: '$14.3B',  fy2025: '$17.2B'  },
  { metric: 'EPS (diluted)',  fy2022: '$30.06',  fy2023: '$22.87',  fy2024: '$40.54',  fy2025: '$51.32'  },
  { metric: 'Total Assets',   fy2022: '$1.44T',  fy2023: '$1.64T',  fy2024: '$1.68T',  fy2025: '$1.81T'  },
  { metric: 'Total Equity',   fy2022: '$117.2B', fy2023: '$116.9B', fy2024: '$122.0B', fy2025: '$125.0B' },
  { metric: 'Free Cash Flow', fy2022: '$5.0B',   fy2023: '-$14.9B', fy2024: '-$15.3B', fy2025: '-$47.2B' },
]

const SECTORS_COVERED = [
  { name: 'Financial Services',              count: 20 },
  { name: 'AI & Technology',                 count: 22 },
  { name: 'Healthcare & Pharma',             count: 20 },
  { name: 'Consumer & Retail',               count: 20 },
  { name: 'Consumer Internet',               count: 20 },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick a company or sector',
    desc: 'Browse the full directory by sector, or search for a specific company or ticker.',
  },
  {
    n: '02',
    title: 'Read five years of standardised financials',
    desc: 'Income statement, balance sheet, and cash flow — pulled from public filings, laid out identically across every company.',
  },
  {
    n: '03',
    title: 'Compare across 15 ratios',
    desc: 'Put any two companies side by side and see how they measure up on the metrics that matter for their sector.',
  },
]

const DIVIDER = (
  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: 0 }} />
)

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.14em',
  color: 'rgba(240,240,240,0.28)',
  textTransform: 'uppercase',
  marginBottom: '0',
}

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(72px, 11vw, 144px) 0 clamp(56px, 8vw, 96px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

          <p style={{ ...LABEL_STYLE, marginBottom: '40px' }}>
            Financial Research Platform · FY2019–FY2024
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(34px, 5.2vw, 68px)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.11,
            maxWidth: 840,
            margin: '0 0 28px',
            letterSpacing: '-0.01em',
          }}>
            Five years of financial data on 102&nbsp;companies,
            structured so you can actually learn from it.
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            fontWeight: 300,
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: 480,
            margin: '0 0 44px',
          }}>
            Trikosh pulls income statements, balance sheets, and cash flows from
            public filings. Organised, comparable, and free.
          </p>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
            <Link
              href="/companies"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#080808',
                backgroundColor: 'var(--text-primary)',
                padding: '9px 20px',
                borderRadius: '3px',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              Browse companies
            </Link>
            <Link
              href="/about#methodology"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              Methodology <span style={{ opacity: 0.45 }}>↗</span>
            </Link>
          </div>

          {/* Stats — divided row */}
          <div style={{
            display: 'flex',
            gap: 0,
            flexWrap: 'wrap',
            paddingTop: '36px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}>
            {STATS.map(({ value, label }, i) => (
              <div
                key={label}
                style={{
                  paddingRight: '44px',
                  paddingLeft: i > 0 ? '44px' : '0',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <NumberTicker
                  value={value}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(26px, 3.2vw, 40px)',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    display: 'block',
                    letterSpacing: '-0.02em',
                  }}
                />
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  marginTop: '10px',
                  marginBottom: 0,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {DIVIDER}

      {/* ── Sample data ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

          <p style={{ ...LABEL_STYLE, marginBottom: '36px' }}>What&apos;s inside</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

            {/* GS table */}
            <div style={{
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 18px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: '0 0 3px',
                  letterSpacing: '0.01em',
                }}>
                  Goldman Sachs (GS) — Income Statement
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}>
                  SAMPLE · FINANCIAL SERVICES
                </p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Metric', 'FY2022', 'FY2023', 'FY2024', 'FY2025'].map((h, i) => (
                        <th
                          key={h}
                          style={{
                            color: 'rgba(240,240,240,0.30)',
                            padding: '9px 14px',
                            textAlign: i === 0 ? 'left' : 'right',
                            fontWeight: 400,
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.06em',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GS_ROWS.map((row, i) => (
                      <tr
                        key={row.metric}
                        style={{ borderBottom: i < GS_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                      >
                        <td style={{ color: 'var(--text-secondary)', padding: '9px 14px', fontSize: '12px' }}>
                          {row.metric}
                        </td>
                        {[row.fy2022, row.fy2023, row.fy2024, row.fy2025].map((v, j) => (
                          <td
                            key={j}
                            style={{
                              color: v.startsWith('-') ? 'var(--delta-neg)' : 'var(--text-primary)',
                              padding: '9px 14px',
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{
                padding: '9px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                lineHeight: 1.5,
                margin: 0,
                letterSpacing: '0.02em',
              }}>
                Banks structurally report negative FCF — not a data error.
              </p>
            </div>

            {/* Coverage */}
            <div style={{
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: '0 0 20px',
                letterSpacing: '0.01em',
              }}>
                Coverage
              </p>
              <div>
                {SECTORS_COVERED.map((s, i) => (
                  <div
                    key={s.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: i < SECTORS_COVERED.length - 1
                        ? '1px solid rgba(255,255,255,0.05)'
                        : 'none',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: 'var(--text-secondary)',
                    }}>
                      {s.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      letterSpacing: '0.02em',
                    }}>
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{
                marginTop: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                lineHeight: 1.55,
                marginBottom: 0,
                letterSpacing: '0.03em',
              }}>
                Sourced from public filings via Yahoo Finance. Updated annually.
              </p>
            </div>

          </div>
        </div>
      </section>

      {DIVIDER}

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

          <p style={{ ...LABEL_STYLE, marginBottom: '52px' }}>How it works</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
            {STEPS.map((step) => (
              <div key={step.n}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'rgba(240,240,240,0.18)',
                  margin: '0 0 16px',
                  letterSpacing: '0.08em',
                }}>
                  {step.n}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: '0 0 10px',
                  lineHeight: 1.35,
                  letterSpacing: '0.01em',
                }}>
                  {step.title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {DIVIDER}

      {/* ── Research section ─────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(26px, 3.6vw, 44px)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            maxWidth: 540,
            margin: '0 0 20px',
            letterSpacing: '-0.01em',
          }}>
            Built for learning,<br />not for looking.
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 300,
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: 500,
            margin: '0 0 28px',
          }}>
            Most financial data tools give you a number and stop there. Trikosh gives
            you the same number with the formula behind it — so you understand what
            you&apos;re actually reading. The methodology is published and open.
          </p>

          <Link
            href="/about#methodology"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: '1px solid rgba(255,255,255,0.14)',
              paddingBottom: '2px',
            }}
          >
            Read the methodology <span style={{ opacity: 0.5 }}>→</span>
          </Link>

        </div>
      </section>

    </div>
  )
}
