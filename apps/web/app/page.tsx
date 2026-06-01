import Link from 'next/link'
import { NumberTicker } from '@/components/ui/number-ticker'

const STATS = [
  { value: 102, label: 'Companies' },
  { value: 5, label: 'Sectors' },
  { value: 15, label: 'Ratios per company' },
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
  { name: 'Financial Services',    count: 20 },
  { name: 'AI & Technology',       count: 22 },
  { name: 'Healthcare & Pharma',   count: 20 },
  { name: 'Consumer & Retail',     count: 20 },
  { name: 'Consumer Internet',     count: 20 },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick a company or sector from the directory',
    desc: 'Browse the full list by sector, or search for a specific company or ticker.',
  },
  {
    n: '02',
    title: 'Read five years of standardised financials',
    desc: 'Income statement, balance sheet, and cash flow — pulled from public filings and laid out the same way across every company.',
  },
  {
    n: '03',
    title: 'Put two companies side by side across 15 ratios',
    desc: 'The comparison tool lets you pick any two companies and see how they measure up on the metrics that matter for their sector.',
  },
]

const HR = <hr style={{ border: 'none', borderTop: '1px solid #1f1f1f', margin: 0 }} />

const TH_COLS = ['Metric', 'FY2022', 'FY2023', 'FY2024', 'FY2025']

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a' }}>

      {/* ── Hero ── */}
      <section className="py-16 md:py-24">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 52px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            maxWidth: 760,
            margin: '0 0 20px',
          }}>
            Five years of financial data on 102 companies, structured so you can actually learn from it.
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#8a8a8a',
            lineHeight: 1.6,
            maxWidth: 560,
            margin: '0 0 36px',
          }}>
            Trikosh pulls income statements, balance sheets, and cash flows from public filings.
            You get the numbers — organised, comparable, and free.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link
              href="/companies"
              style={{
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#b300ff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Browse companies
            </Link>
            <Link
              href="/about#methodology"
              style={{
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#ffffff',
                border: '1px solid #ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                backgroundColor: 'transparent',
              }}
            >
              Read the methodology
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(40px, 8vw, 96px)', flexWrap: 'wrap' }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <NumberTicker
                  value={value}
                  style={{
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1,
                    display: 'block',
                  }}
                />
                <p style={{ fontSize: '13px', color: '#6b6b6b', marginTop: '8px', marginBottom: 0 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {HR}

      {/* ── Proof section ── */}
      <section className="py-16 md:py-24">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{
            fontSize: '11px',
            color: '#b300ff',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 500,
            marginBottom: '32px',
          }}>
            What&apos;s actually in it
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* GS income statement table */}
            <div style={{ border: '1px solid #1f1f1f', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #1f1f1f' }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: '0 0 4px' }}>
                  Goldman Sachs (GS) — Income Statement
                </p>
                <p style={{ fontSize: '12px', color: '#6b6b6b', margin: 0 }}>
                  Sample from our Financial Services dataset
                </p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1f1f1f' }}>
                      {TH_COLS.map((h, i) => (
                        <th
                          key={h}
                          style={{
                            color: '#b300ff',
                            padding: '10px 14px',
                            textAlign: i === 0 ? 'left' : 'right',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GS_ROWS.map((row, i) => (
                      <tr key={row.metric} style={{ borderBottom: i < GS_ROWS.length - 1 ? '1px solid #1f1f1f' : 'none' }}>
                        <td style={{ color: '#c4c4c4', padding: '10px 14px' }}>{row.metric}</td>
                        {[row.fy2022, row.fy2023, row.fy2024, row.fy2025].map((v, j) => (
                          <td key={j} style={{ color: '#ffffff', padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ padding: '10px 14px', fontSize: '11px', color: '#6b6b6b', borderTop: '1px solid #1f1f1f', lineHeight: 1.5, margin: 0 }}>
                Banks report negative FCF structurally — this is correct, not a data error.
              </p>
            </div>

            {/* Sector breakdown */}
            <div style={{ border: '1px solid #1f1f1f', borderRadius: '8px', padding: '24px' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: '0 0 20px' }}>
                What we cover
              </p>
              <div>
                {SECTORS_COVERED.map((s, i) => (
                  <div
                    key={s.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '13px 0',
                      borderBottom: i < SECTORS_COVERED.length - 1 ? '1px solid #1f1f1f' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#ffffff' }}>{s.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#b300ff' }}>
                      {s.count} companies
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '20px', fontSize: '12px', color: '#6b6b6b', lineHeight: 1.6, marginBottom: 0 }}>
                All data is sourced from public filings via Yahoo Finance. Updated annually.
              </p>
            </div>

          </div>
        </div>
      </section>

      {HR}

      {/* ── How it works ── */}
      <section className="py-16 md:py-24">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{
            fontSize: '11px',
            color: '#b300ff',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 500,
            marginBottom: '40px',
          }}>
            How it works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.n}>
                <p style={{ fontSize: '22px', fontWeight: 700, color: '#b300ff', margin: '0 0 12px' }}>
                  {step.n}
                </p>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 10px', lineHeight: 1.3 }}>
                  {step.title}
                </p>
                <p style={{ fontSize: '14px', color: '#8a8a8a', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {HR}

      {/* ── Research section ── */}
      <section className="py-16 md:py-24">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            maxWidth: 580,
            margin: '0 0 20px',
          }}>
            Built for learning, not for looking
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#8a8a8a',
            lineHeight: 1.6,
            maxWidth: 580,
            margin: '0 0 24px',
          }}>
            Most financial data tools give you a number and stop there. Trikosh gives you the same
            number with the formula behind it, so you understand what you&apos;re actually reading.
            The methodology is published and open — you can read exactly how every ratio is calculated.
          </p>
          <Link
            href="/about#methodology"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#b300ff',
              textDecoration: 'none',
              borderBottom: '1px solid #b300ff',
              paddingBottom: '2px',
            }}
          >
            Read the methodology →
          </Link>
        </div>
      </section>

    </div>
  )
}
