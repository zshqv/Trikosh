'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import TickerBadge from '@/components/ui/TickerBadge'
import DeltaLabel from '@/components/ui/DeltaLabel'
import { formatPercent, formatMultiple, formatCurrency } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types — mirror the real DB schema returned by /api/companies/[ticker]
// ---------------------------------------------------------------------------

interface CompanyRow {
  ticker: string
  name: string
  sector: string
  industry: string | null
  country: string | null
  exchange: string | null
  currency: string | null
  description: string | null
  website: string | null
}

interface IncomeRow {
  fiscal_year: number
  revenue: number | null
  gross_profit: number | null
  operating_income: number | null
  net_income: number | null
  ebitda: number | null
  eps: number | null
  shares_outstanding: number | null
}

interface BalanceRow {
  fiscal_year: number
  total_assets: number | null
  total_liabilities: number | null
  total_equity: number | null
  cash_and_equivalents: number | null
  total_debt: number | null
}

interface CashFlowRow {
  fiscal_year: number
  operating_cash_flow: number | null
  capital_expenditure: number | null
  free_cash_flow: number | null
  dividends_paid: number | null
}

interface RatioRow {
  fiscal_year: number
  gross_margin: number | null
  operating_margin: number | null
  net_margin: number | null
  return_on_equity: number | null
  return_on_assets: number | null
  current_ratio: number | null
  debt_to_equity: number | null
  debt_to_assets: number | null
  asset_turnover: number | null
  interest_coverage: number | null
  price_to_earnings: number | null
  price_to_book: number | null
  ev_to_ebitda: number | null
  free_cash_flow_yield: number | null
  earnings_yield: number | null
}

interface MarketDataRow {
  date: string
  market_cap: number | null
  price: number | null
  beta: number | null
  volume_avg: number | null
  shares_outstanding: number | null
}

interface PeerRow {
  ticker: string
  name: string
  sector: string
  country: string | null
  exchange: string | null
}

interface ApiResponse {
  company: CompanyRow
  income_statements: IncomeRow[]
  balance_sheets: BalanceRow[]
  cash_flow_statements: CashFlowRow[]
  financial_ratios: RatioRow[]
  market_data: MarketDataRow | null
  peers: PeerRow[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Tab    = 'Financials' | 'Ratios' | 'Peers' | 'Overview'
type FinTab = 'Income Statement' | 'Balance Sheet' | 'Cash Flow'

/** Format a financial statement cell value. Returns '—' for null. */
function fmtCell(value: number | null, isEPS = false): string {
  if (value == null) return '—'
  if (isEPS) return `$${value.toFixed(2)}`
  return formatCurrency(value)
}

/** Safe YoY delta. Returns null when either value is missing or denominator is zero. */
function yoyDelta(current: number | null, prev: number | null): number | null {
  if (current == null || prev == null || prev === 0) return null
  return (current - prev) / Math.abs(prev)
}

/** Format a ratio card value according to its unit. */
function fmtRatio(value: number | null, unit: 'PCT' | 'MULTIPLE' | 'RATIO'): string {
  if (value == null) return '—'
  if (unit === 'PCT')      return formatPercent(value)
  if (unit === 'MULTIPLE') return formatMultiple(value)
  return value.toFixed(2)
}

// Map DB ratio column names → display metadata
const RATIO_MAP: { label: string; key: keyof RatioRow; unit: 'PCT' | 'MULTIPLE' | 'RATIO' }[] = [
  { label: 'Gross Margin',       key: 'gross_margin',        unit: 'PCT'      },
  { label: 'Operating Margin',   key: 'operating_margin',    unit: 'PCT'      },
  { label: 'Net Margin',         key: 'net_margin',          unit: 'PCT'      },
  { label: 'Return on Equity',   key: 'return_on_equity',    unit: 'PCT'      },
  { label: 'Return on Assets',   key: 'return_on_assets',    unit: 'PCT'      },
  { label: 'Current Ratio',      key: 'current_ratio',       unit: 'RATIO'    },
  { label: 'Debt / Equity',      key: 'debt_to_equity',      unit: 'RATIO'    },
  { label: 'Debt / Assets',      key: 'debt_to_assets',      unit: 'RATIO'    },
  { label: 'Asset Turnover',     key: 'asset_turnover',      unit: 'RATIO'    },
  { label: 'Interest Coverage',  key: 'interest_coverage',   unit: 'RATIO'    },
  { label: 'P/E',                key: 'price_to_earnings',   unit: 'MULTIPLE' },
  { label: 'P/B',                key: 'price_to_book',       unit: 'MULTIPLE' },
  { label: 'EV/EBITDA',          key: 'ev_to_ebitda',        unit: 'MULTIPLE' },
  { label: 'FCF Yield',          key: 'free_cash_flow_yield',unit: 'PCT'      },
  { label: 'Earnings Yield',     key: 'earnings_yield',      unit: 'PCT'      },
]

// Sector-specific research questions (generic — no real data needed)
const RESEARCH_QUESTIONS: Record<string, string[]> = {
  'Financial Services': [
    'How does this company\'s net interest margin compare across different interest rate cycles, and what is its sensitivity to a 100bps rate move?',
    'What proportion of revenues comes from fee-based versus spread-based income, and how does that mix affect earnings stability?',
    'How does the CET1 ratio compare to the regulatory minimum, and what does the excess capital suggest about future capital return capacity?',
  ],
  'AI & Technology': [
    'What percentage of revenue is recurring, and how has net revenue retention trended over the past three years?',
    'How does the R&D intensity compare to peers, and is there evidence that R&D investment is translating into accelerating revenue growth?',
    'How does FCF margin trajectory compare to operating margin — and does the gap tell you something about working capital or capex intensity?',
  ],
  'Healthcare': [
    'What is the revenue concentration in the top three products, and what is the patent expiry timeline for the highest-revenue drug?',
    'How does the gross margin compare to pure-play peers in the same sub-sector, and what explains any gap?',
    'What clinical stage is the pipeline in, and what is the historical approval rate for drugs that reach Phase III from this company\'s pipeline?',
  ],
  'Consumer & Retail': [
    'How has same-store sales growth trended over the past five years, and what is the organic versus acquired revenue mix?',
    'What is the gross margin trajectory, and which cost levers — pricing, mix, or procurement — are driving the trend?',
    'How does the inventory turnover ratio compare to peers, and does a rising or falling trend indicate demand strength or supply chain stress?',
  ],
  'Digital Platforms & E-Commerce': [
    'What is the take rate trend, and how does increasing competition or regulatory pressure affect platform monetisation?',
    'How does the unit economics — CAC versus LTV — evolve as the platform scales, and at what point does marketing spend become self-funding?',
    'How does EBITDA margin trajectory compare to peers at a similar scale, and what is the path to free cash flow breakeven?',
  ],
}

const DEFAULT_QUESTIONS = [
  'What are the key drivers of revenue growth, and how sustainable are they over a 3-5 year horizon?',
  'How does this company\'s profitability profile compare to its closest peers, and what explains the gap?',
  'What is the capital allocation priority — reinvestment, acquisitions, or shareholder returns — and is it consistent with the stated strategy?',
]

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? '120px' : '40px',
            backgroundColor: 'var(--bg-surface-1)',
            borderRadius: '8px',
            marginBottom: '16px',
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Financial table — shared by Income / Balance / Cash Flow tabs
// ---------------------------------------------------------------------------

interface TableRow {
  metric: string
  values: (number | null)[]
  isEPS?: boolean
}

function FinancialTable({ rows, years }: { rows: TableRow[]; years: string[] }) {
  if (rows.length === 0 || years.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-tertiary)', padding: '24px 0' }}>
        No data available for this company.
      </p>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        backgroundColor: 'var(--bg-surface-1)', borderRadius: '8px',
        overflow: 'hidden', border: 'var(--border-rest)',
      }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-surface-2)' }}>
            <th style={thStyle('left')}>Metric</th>
            {years.map(yr => <th key={yr} style={thStyle('right')}>{yr}</th>)}
            <th style={thStyle('right')}>YoY</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const lastVal  = row.values[row.values.length - 1] ?? null
            const prevVal  = row.values[row.values.length - 2] ?? null
            const delta    = yoyDelta(lastVal, prevVal)
            return (
              <tr key={row.metric} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface-1)' : 'var(--bg-base)' }}>
                <td style={tdStyle('left')}>{row.metric}</td>
                {row.values.map((v, j) => (
                  <td key={j} style={{ ...tdStyle('right'), fontVariantNumeric: 'tabular-nums' }}>
                    {fmtCell(v, row.isEPS)}
                  </td>
                ))}
                <td style={{ ...tdStyle('right') }}>
                  {delta != null ? <DeltaLabel value={delta} size="sm" /> : <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = (align: 'left' | 'right'): React.CSSProperties => ({
  fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.06em',
  color: 'var(--text-tertiary)', padding: '10px 16px',
  textAlign: align, border: 'var(--border-rest)',
})

const tdStyle = (align: 'left' | 'right'): React.CSSProperties => ({
  fontFamily: 'var(--font-sans)', fontSize: '14px',
  color: 'var(--text-primary)', padding: '10px 16px',
  textAlign: align, border: 'var(--border-rest)',
})

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function CompanyDetailPage() {
  const { ticker } = useParams<{ ticker: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Financials')
  const [finTab, setFinTab]       = useState<FinTab>('Income Statement')
  const [data, setData]           = useState<ApiResponse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  useEffect(() => {
    if (!ticker) return
    setLoading(true)
    setNotFound(false)
    setData(null)

    fetch(`/api/companies/${ticker.toUpperCase()}`)
      .then(async r => {
        if (r.status === 404) { setNotFound(true); return }
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const json: ApiResponse = await r.json()
        setData(json)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [ticker])

  // --- Loading ---
  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
        <LoadingSkeleton />
      </div>
    )
  }

  // --- Not found ---
  if (notFound || !data) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
          Company not found: {ticker?.toUpperCase()}
        </p>
        <Link href="/companies" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Companies
        </Link>
      </div>
    )
  }

  const { company, income_statements, balance_sheets, cash_flow_statements, financial_ratios, market_data, peers } = data

  // ---------------------------------------------------------------------------
  // Build financial tables — API returns newest-first; reverse for display
  // ---------------------------------------------------------------------------

  const incomeAsc   = [...income_statements].reverse()
  const balanceAsc  = [...balance_sheets].reverse()
  const cashflowAsc = [...cash_flow_statements].reverse()

  const incomeYears   = incomeAsc.map(r => `FY${r.fiscal_year}`)
  const balanceYears  = balanceAsc.map(r => `FY${r.fiscal_year}`)
  const cashflowYears = cashflowAsc.map(r => `FY${r.fiscal_year}`)

  const incomeRows: TableRow[] = [
    { metric: 'Revenue',          values: incomeAsc.map(r => r.revenue) },
    { metric: 'Gross Profit',     values: incomeAsc.map(r => r.gross_profit) },
    { metric: 'Operating Income', values: incomeAsc.map(r => r.operating_income) },
    { metric: 'Net Income',       values: incomeAsc.map(r => r.net_income) },
    { metric: 'EBITDA',           values: incomeAsc.map(r => r.ebitda) },
    { metric: 'EPS (diluted)',    values: incomeAsc.map(r => r.eps), isEPS: true },
  ]

  const balanceRows: TableRow[] = [
    { metric: 'Total Assets',       values: balanceAsc.map(r => r.total_assets) },
    { metric: 'Total Liabilities',  values: balanceAsc.map(r => r.total_liabilities) },
    { metric: 'Total Equity',       values: balanceAsc.map(r => r.total_equity) },
    { metric: 'Cash & Equivalents', values: balanceAsc.map(r => r.cash_and_equivalents) },
    { metric: 'Total Debt',         values: balanceAsc.map(r => r.total_debt) },
  ]

  const cashflowRows: TableRow[] = [
    { metric: 'Operating Cash Flow', values: cashflowAsc.map(r => r.operating_cash_flow) },
    { metric: 'Capital Expenditure', values: cashflowAsc.map(r => r.capital_expenditure) },
    { metric: 'Free Cash Flow',      values: cashflowAsc.map(r => r.free_cash_flow) },
    { metric: 'Dividends Paid',      values: cashflowAsc.map(r => r.dividends_paid) },
  ]

  // Active financial table based on sub-tab
  const activeFinRows = finTab === 'Income Statement' ? incomeRows
    : finTab === 'Balance Sheet' ? balanceRows
    : cashflowRows

  const activeFinYears = finTab === 'Income Statement' ? incomeYears
    : finTab === 'Balance Sheet' ? balanceYears
    : cashflowYears

  // Most recent year ratios (API returns DESC, so index 0 = newest)
  const latestRatios = financial_ratios[0] ?? null

  // Research questions for this sector (fall back to defaults)
  const researchQuestions = RESEARCH_QUESTIONS[company.sector] ?? DEFAULT_QUESTIONS

  const TABS: Tab[] = ['Financials', 'Ratios', 'Peers', 'Overview']

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/companies"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            ← Companies
          </Link>
        </div>

        {/* Header */}
        <div style={{
          backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
          borderRadius: '12px', padding: '24px', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ marginBottom: '10px' }}>
                <TickerBadge ticker={company.ticker} exchange={company.exchange ?? ''} />
              </div>
              <h1 style={{
                fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 500,
                lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px',
              }}>
                {company.name || company.ticker}
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                {[company.sector, company.industry].filter(Boolean).join(' · ')}
                {company.country ? ` · ${company.country}` : ''}
              </p>

              {/* Market data summary strip */}
              {market_data && (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {market_data.price != null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Price: <strong style={{ color: 'var(--text-primary)' }}>${Number(market_data.price).toFixed(2)}</strong>
                    </span>
                  )}
                  {market_data.market_cap != null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Mkt Cap: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(market_data.market_cap))}</strong>
                    </span>
                  )}
                  {market_data.beta != null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Beta: <strong style={{ color: 'var(--text-primary)' }}>{Number(market_data.beta).toFixed(2)}</strong>
                    </span>
                  )}
                </div>
              )}

              {company.description && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '560px', lineHeight: 1.5, marginTop: '10px' }}>
                  {company.description.length > 200 ? company.description.slice(0, 200) + '…' : company.description}
                </p>
              )}
            </div>
            <button style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent-primary)',
              border: 'var(--border-hover)', borderRadius: '6px', padding: '8px 16px',
              backgroundColor: 'rgba(37,99,235,0.06)', cursor: 'pointer', flexShrink: 0,
            }}>
              Export for Analysis
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '0', borderBottom: 'var(--border-rest)', marginBottom: '24px' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px',
                fontWeight: activeTab === tab ? 500 : 400,
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                padding: '10px 20px', cursor: 'pointer', transition: 'color 150ms ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Financials tab                                                      */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'Financials' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['Income Statement', 'Balance Sheet', 'Cash Flow'] as FinTab[]).map(ft => (
                <button
                  key={ft}
                  onClick={() => setFinTab(ft)}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px', padding: '5px 12px',
                    borderRadius: '5px', border: 'var(--border-rest)',
                    backgroundColor: finTab === ft ? 'var(--bg-muted)' : 'var(--bg-surface-1)',
                    color: finTab === ft ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {ft}
                </button>
              ))}
            </div>

            <FinancialTable rows={activeFinRows} years={activeFinYears} />

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              Source: Trikosh pipeline via FMP API · {company.exchange ?? ''} · {company.currency ?? 'USD'} · Known limitations: Figures sourced via FMP; verify against primary filings.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Ratios tab                                                          */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'Ratios' && (
          <div>
            {latestRatios == null ? (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-tertiary)', padding: '24px 0' }}>
                No ratio data available for this company yet. Run the pipeline to populate.
              </p>
            ) : (
              <>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                  Showing FY{latestRatios.fiscal_year} — most recent year available
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {RATIO_MAP.map(({ label, key, unit }) => {
                    const raw = latestRatios[key]
                    const value = raw != null ? Number(raw) : null
                    const formatted = fmtRatio(value, unit)
                    return (
                      <div key={label} style={{
                        backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
                        borderRadius: '8px', padding: '16px',
                      }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
                          {label}
                        </p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: value != null ? 'var(--text-primary)' : 'var(--text-tertiary)', marginBottom: '4px' }}>
                          {formatted}
                        </p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                          FY{latestRatios.fiscal_year}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              Source: Trikosh pipeline via FMP API · Known limitations: Peer median calculated from Trikosh coverage universe only.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Peers tab                                                           */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'Peers' && (
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Peer companies in {company.sector}.
            </p>
            {peers.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-tertiary)' }}>
                No peer companies found in the database for this sector.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {peers.map(peer => (
                  <Link key={peer.ticker} href={`/companies/${peer.ticker}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
                      borderRadius: '8px', padding: '16px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'border-color 150ms ease', cursor: 'pointer',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)', minWidth: '52px' }}>
                          {peer.ticker}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-primary)' }}>
                          {peer.name || peer.ticker}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {peer.country && (
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            {peer.country}
                          </span>
                        )}
                        {peer.exchange && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-muted)', padding: '2px 6px', borderRadius: '4px' }}>
                            {peer.exchange}
                          </span>
                        )}
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '16px' }}>
              Source: Trikosh pipeline · Peer selection limited to Trikosh coverage universe.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Overview tab                                                        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'Overview' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Key Research Questions
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              These questions do not have answers here. Your job is to find them — in the 10-K, the earnings calls, and the financial statements.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {researchQuestions.map((q, i) => (
                <div key={i} style={{
                  backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
                  borderRadius: '8px', padding: '20px', borderLeft: '3px solid var(--accent-primary)',
                }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Question {i + 1}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {q}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '24px' }}>
              Source: Trikosh research framework · Research questions are sector-generic; company-specific nuances should be identified from filings.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
