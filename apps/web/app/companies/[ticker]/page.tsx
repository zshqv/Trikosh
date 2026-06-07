'use client'

import type ExcelJS from 'exceljs'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import TickerBadge from '@/components/ui/TickerBadge'
import DeltaLabel from '@/components/ui/DeltaLabel'
import { formatPercent, formatMultiple, formatCurrency } from '@/lib/utils'

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
  reporting_standard: string | null
  revenue_cagr_5yr: number | null
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
  pe_ratio: number | null
  ev_ebitda: number | null
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

type Tab    = 'Financials' | 'Ratios' | 'Peers' | 'Overview'
type FinTab = 'Income Statement' | 'Balance Sheet' | 'Cash Flow'

function toNum(value: unknown): number | null {
  if (value == null) return null
  const n = Number(value)
  return isNaN(n) ? null : n
}

function fmtCell(value: unknown, isEPS = false): string {
  const n = toNum(value)
  if (n == null) return '—'
  if (isEPS) return `$${n.toFixed(2)}`
  return formatCurrency(n)
}

function yoyDelta(current: unknown, prev: unknown): number | null {
  const c = toNum(current)
  const p = toNum(prev)
  if (c == null || p == null || p === 0) return null
  return (c - p) / Math.abs(p)
}

function fmtRatio(value: unknown, unit: 'PCT' | 'MULTIPLE' | 'RATIO'): string {
  const n = toNum(value)
  if (n == null) return 'N/A'
  if (unit === 'PCT')      return formatPercent(n)
  if (unit === 'MULTIPLE') return formatMultiple(n)
  return n.toFixed(2)
}

const RATIO_MAP: { label: string; key: keyof RatioRow; unit: 'PCT' | 'MULTIPLE' | 'RATIO' }[] = [
  { label: 'Gross Margin',        key: 'gross_margin',         unit: 'PCT'      },
  { label: 'Operating Margin',    key: 'operating_margin',     unit: 'PCT'      },
  { label: 'Net Margin',          key: 'net_margin',           unit: 'PCT'      },
  { label: 'Return on Equity',    key: 'return_on_equity',     unit: 'PCT'      },
  { label: 'Return on Assets',    key: 'return_on_assets',     unit: 'PCT'      },
  { label: 'Current Ratio',       key: 'current_ratio',        unit: 'RATIO'    },
  { label: 'Debt / Equity',       key: 'debt_to_equity',       unit: 'RATIO'    },
  { label: 'Debt / Assets',       key: 'debt_to_assets',       unit: 'RATIO'    },
  { label: 'Asset Turnover',      key: 'asset_turnover',       unit: 'RATIO'    },
  { label: 'Interest Coverage',   key: 'interest_coverage',    unit: 'RATIO'    },
  { label: 'P/E Ratio',            key: 'pe_ratio',             unit: 'MULTIPLE' },
  { label: 'P/B',                 key: 'price_to_book',        unit: 'MULTIPLE' },
  { label: 'EV/EBITDA',           key: 'ev_ebitda',            unit: 'MULTIPLE' },
  { label: 'FCF Yield',           key: 'free_cash_flow_yield', unit: 'PCT'      },
  { label: 'Earnings Yield',      key: 'earnings_yield',       unit: 'PCT'      },
]

const RESEARCH_QUESTIONS: Record<string, string[]> = {
  'Financial Services': [
    "How does this company's net interest margin compare across different interest rate cycles, and what is its sensitivity to a 100bps rate move?",
    "What proportion of revenues comes from fee-based versus spread-based income, and how does that mix affect earnings stability?",
    "How does the CET1 ratio compare to the regulatory minimum, and what does the excess capital suggest about future capital return capacity?",
  ],
  'AI & Technology': [
    "What percentage of revenue is recurring, and how has net revenue retention trended over the past three years?",
    "How does the R&D intensity compare to peers, and is there evidence that R&D investment is translating into accelerating revenue growth?",
    "How does FCF margin trajectory compare to operating margin — and does the gap tell you something about working capital or capex intensity?",
  ],
  'Healthcare': [
    "What is the revenue concentration in the top three products, and what is the patent expiry timeline for the highest-revenue drug?",
    "How does the gross margin compare to pure-play peers in the same sub-sector, and what explains any gap?",
    "What clinical stage is the pipeline in, and what is the historical approval rate for drugs that reach Phase III from this company's pipeline?",
  ],
  'Consumer & Retail': [
    "How has same-store sales growth trended over the past five years, and what is the organic versus acquired revenue mix?",
    "What is the gross margin trajectory, and which cost levers — pricing, mix, or procurement — are driving the trend?",
    "How does the inventory turnover ratio compare to peers, and does a rising or falling trend indicate demand strength or supply chain stress?",
  ],
  'Digital Platforms & E-Commerce': [
    "What is the take rate trend, and how does increasing competition or regulatory pressure affect platform monetisation?",
    "How does the unit economics — CAC versus LTV — evolve as the platform scales, and at what point does marketing spend become self-funding?",
    "How does EBITDA margin trajectory compare to peers at a similar scale, and what is the path to free cash flow breakeven?",
  ],
}

const DEFAULT_QUESTIONS = [
  "What are the key drivers of revenue growth, and how sustainable are they over a 3–5 year horizon?",
  "How does this company's profitability profile compare to its closest peers, and what explains the gap?",
  "What is the capital allocation priority — reinvestment, acquisitions, or shareholder returns — and is it consistent with the stated strategy?",
]

/* ─── Skeleton primitives ───────────────────────────────────────────────── */

function Sk({ w, h, rounded = 4, className = '', style }: {
  w?: string | number
  h?: string | number
  rounded?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width: typeof w === 'number' ? `${w}px` : (w ?? '100%'),
        height: typeof h === 'number' ? `${h}px` : (h ?? '14px'),
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: `${rounded}px`,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

/* ─── Skeleton for the full page structure ───────────────────────────────── */

function PageSkeleton({ ticker }: { ticker: string }) {
  const TABS: Tab[] = ['Financials', 'Ratios', 'Peers', 'Overview']

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Header banner — matches real layout exactly */}
      <div style={{ borderBottom: '1px solid #1a1a1a', backgroundColor: '#0c0c0c' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 24px' }}>
          <Link href="/companies" style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4a4a4a',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            gap: '5px', marginBottom: '18px',
          }}>
            ← Directory
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* ticker badge */}
              <Sk w={84} h={24} rounded={4} />
              {/* company name */}
              <Sk w={260} h={32} rounded={5} />
              {/* sector / industry */}
              <Sk w={180} h={14} rounded={3} />
              {/* market data row */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
                <Sk w={90} h={14} rounded={3} />
                <Sk w={110} h={14} rounded={3} />
                <Sk w={70} h={14} rounded={3} />
              </div>
              {/* description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
                <Sk w="100%" h={13} rounded={3} />
                <Sk w="75%" h={13} rounded={3} />
              </div>
            </div>
            {/* export button placeholder */}
            <Sk w={140} h={36} rounded={7} />
          </div>
        </div>

        {/* Tab nav — real tabs, just disabled-looking */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {TABS.map((tab, i) => (
            <div
              key={tab}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '13.5px', fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? '#ffffff' : '#5a5a5a',
                borderBottom: i === 0 ? '2px solid #ffffff' : '2px solid transparent',
                padding: '12px 18px',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Content — Financials tab skeleton */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Chart area */}
        <div style={{
          backgroundColor: 'var(--bg-surface-1)', border: '1px solid #1f1f1f',
          borderRadius: '10px', padding: '20px', marginBottom: '22px',
        }}>
          <Sk w={160} h={16} rounded={4} />
          <Sk w={100} h={11} rounded={3} className="mt-2" style={{ marginTop: '8px' }} />
          <div style={{ marginTop: '16px' }}>
            <Sk w="100%" h={240} rounded={6} />
          </div>
        </div>

        {/* Sub-tab buttons */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
          <Sk w={120} h={30} rounded={5} />
          <Sk w={110} h={30} rounded={5} />
          <Sk w={90} h={30} rounded={5} />
        </div>

        {/* Table */}
        <div style={{
          border: '1px solid #1f1f1f', borderRadius: '8px', overflow: 'hidden',
          backgroundColor: 'var(--bg-surface-1)',
        }}>
          {/* thead */}
          <div style={{
            display: 'grid', gridTemplateColumns: '180px repeat(5, 1fr) 80px',
            padding: '9px 14px', borderBottom: '1px solid #1a1a1a',
            backgroundColor: 'rgba(0,0,0,0.2)', gap: '14px',
          }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Sk key={i} w="100%" h={11} rounded={3} />
            ))}
          </div>
          {/* rows */}
          {Array.from({ length: 6 }).map((_, ri) => (
            <div
              key={ri}
              style={{
                display: 'grid', gridTemplateColumns: '180px repeat(5, 1fr) 80px',
                padding: '9px 14px',
                borderBottom: ri < 5 ? '1px solid rgba(255,255,255,0.025)' : 'none',
                backgroundColor: ri % 2 !== 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
                gap: '14px', alignItems: 'center',
              }}
            >
              <Sk w="80%" h={13} rounded={3} />
              {Array.from({ length: 5 }).map((_, ci) => (
                <Sk key={ci} w="90%" h={13} rounded={3} />
              ))}
              <Sk w="70%" h={13} rounded={3} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ─── Financial table ──────────────────────────────────────────────────── */

interface TableRow {
  metric: string
  values: unknown[]
  isEPS?: boolean
}

const TH: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: '#4a4a4a', padding: '9px 14px', borderBottom: '1px solid #1a1a1a',
}
const TD: React.CSSProperties = {
  fontFamily: 'var(--font-sans)', fontSize: '13px',
  color: 'var(--text-primary)', padding: '9px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.025)',
}

function FinancialTable({ rows, years }: { rows: TableRow[]; years: string[] }) {
  if (rows.length === 0 || years.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3a3a3a', padding: '24px 0' }}>
        No data available for this company.
      </p>
    )
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        backgroundColor: 'var(--bg-surface-1)',
        borderRadius: '8px', overflow: 'hidden',
        border: '1px solid #1f1f1f',
      }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <th style={{ ...TH, textAlign: 'left', minWidth: '160px' }}>Metric</th>
            {years.map(yr => <th key={yr} style={{ ...TH, textAlign: 'right' }}>{yr}</th>)}
            <th style={{ ...TH, textAlign: 'right' }}>YoY</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const lastVal = row.values[row.values.length - 1]
            const prevVal = row.values[row.values.length - 2]
            const delta   = yoyDelta(lastVal, prevVal)
            return (
              <tr
                key={row.metric}
                style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)')}
              >
                <td
                  style={{ ...TD, textAlign: 'left', borderLeft: '2px solid transparent' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderLeftColor = '#ffffff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent')}
                >
                  {row.metric}
                </td>
                {row.values.map((v, j) => (
                  <td key={j} style={{ ...TD, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>
                    {fmtCell(v, row.isEPS)}
                  </td>
                ))}
                <td style={{ ...TD, textAlign: 'right' }}>
                  {delta != null
                    ? <DeltaLabel value={delta} size="sm" />
                    : <span style={{ fontFamily: 'var(--font-mono)', color: '#3a3a3a', fontSize: '12px' }}>—</span>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────── */

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

  /* Show full skeleton while loading — same structure, zero layout shift */
  if (loading) return <PageSkeleton ticker={ticker ?? ''} />

  if (notFound || !data) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3a3a3a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Company not found: {ticker?.toUpperCase()}
        </p>
        <Link href="/companies" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '13px' }}>
          ← Back to Directory
        </Link>
      </div>
    )
  }

  const { company, income_statements, balance_sheets, cash_flow_statements, financial_ratios, market_data, peers } = data

  async function handleExport() {
    const { default: ExcelJS } = await import('exceljs')
    const wb = new ExcelJS.Workbook()

    const incomeAscEx   = [...income_statements].reverse()
    const balanceAscEx  = [...balance_sheets].reverse()
    const cashflowAscEx = [...cash_flow_statements].reverse()

    const years = (rows: { fiscal_year: number }[]) =>
      rows.map(r => `FY${r.fiscal_year}`)

    function addAoa(
      ws: ExcelJS.Worksheet,
      data: (string | number | null)[][]
    ) {
      for (const rowData of data) {
        const row = ws.addRow([])
        rowData.forEach((val, i) => { row.getCell(i + 1).value = val })
      }
    }

    const wsIncome = wb.addWorksheet('Income Statement')
    addAoa(wsIncome, [
      ['Metric', ...years(incomeAscEx)],
      ['Revenue',          ...incomeAscEx.map(r => toNum(r.revenue))],
      ['Gross Profit',     ...incomeAscEx.map(r => toNum(r.gross_profit))],
      ['Operating Income', ...incomeAscEx.map(r => toNum(r.operating_income))],
      ['Net Income',       ...incomeAscEx.map(r => toNum(r.net_income))],
      ['EBITDA',           ...incomeAscEx.map(r => toNum(r.ebitda))],
      ['EPS (diluted)',    ...incomeAscEx.map(r => toNum(r.eps))],
    ])

    const wsBalance = wb.addWorksheet('Balance Sheet')
    addAoa(wsBalance, [
      ['Metric', ...years(balanceAscEx)],
      ['Total Assets',       ...balanceAscEx.map(r => toNum(r.total_assets))],
      ['Total Liabilities',  ...balanceAscEx.map(r => toNum(r.total_liabilities))],
      ['Total Equity',       ...balanceAscEx.map(r => toNum(r.total_equity))],
      ['Cash & Equivalents', ...balanceAscEx.map(r => toNum(r.cash_and_equivalents))],
      ['Total Debt',         ...balanceAscEx.map(r => toNum(r.total_debt))],
    ])

    const wsCash = wb.addWorksheet('Cash Flow')
    addAoa(wsCash, [
      ['Metric', ...years(cashflowAscEx)],
      ['Operating Cash Flow', ...cashflowAscEx.map(r => toNum(r.operating_cash_flow))],
      ['Capital Expenditure', ...cashflowAscEx.map(r => toNum(r.capital_expenditure))],
      ['Free Cash Flow',      ...cashflowAscEx.map(r => toNum(r.free_cash_flow))],
      ['Dividends Paid',      ...cashflowAscEx.map(r => toNum(r.dividends_paid))],
    ])

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Trikosh_${ticker.toUpperCase()}_Financials.xlsx`
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const incomeAsc   = [...income_statements].reverse()
  const balanceAsc  = [...balance_sheets].reverse()
  const cashflowAsc = [...cash_flow_statements].reverse()

  const incomeYears   = incomeAsc.map(r => `FY${r.fiscal_year}`)
  const balanceYears  = balanceAsc.map(r => `FY${r.fiscal_year}`)
  const cashflowYears = cashflowAsc.map(r => `FY${r.fiscal_year}`)

  const revChartData = incomeAsc
    .map(r => ({ year: `FY${r.fiscal_year}`, Revenue: toNum(r.revenue), 'Net Income': toNum(r.net_income) }))
    .filter(d => d.Revenue != null)

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

  const activeFinRows  = finTab === 'Income Statement' ? incomeRows  : finTab === 'Balance Sheet' ? balanceRows  : cashflowRows
  const activeFinYears = finTab === 'Income Statement' ? incomeYears : finTab === 'Balance Sheet' ? balanceYears : cashflowYears

  const latestRatios = financial_ratios[0] ?? null
  const researchQuestions = RESEARCH_QUESTIONS[company.sector] ?? DEFAULT_QUESTIONS
  const TABS: Tab[] = ['Financials', 'Ratios', 'Peers', 'Overview']

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #1a1a1a', backgroundColor: '#0c0c0c' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 24px' }}>
          <Link href="/companies" style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4a4a4a',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            gap: '5px', marginBottom: '18px',
          }}>
            ← Directory
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ marginBottom: '10px' }}>
                <TickerBadge ticker={company.ticker} exchange={company.exchange ?? ''} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em',
                  color: 'var(--text-primary)', margin: 0,
                }}>
                  {company.name || company.ticker}
                </h1>
                {company.reporting_standard && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                    padding: '3px 7px', borderRadius: '4px', flexShrink: 0,
                    backgroundColor: company.reporting_standard === 'GAAP'
                      ? 'rgba(37,99,235,0.12)' : 'rgba(217,119,6,0.12)',
                    color: company.reporting_standard === 'GAAP' ? 'var(--accent-primary)' : '#d97706',
                    border: `1px solid ${company.reporting_standard === 'GAAP' ? 'rgba(37,99,235,0.25)' : 'rgba(217,119,6,0.25)'}`,
                  }}>
                    {company.reporting_standard}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: '#5a5a5a', marginBottom: '8px' }}>
                {[company.sector, company.industry].filter(Boolean).join(' · ')}
                {company.country ? ` · ${company.country}` : ''}
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
                {market_data && toNum(market_data.price) != null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6a6a6a' }}>
                    Price <strong style={{ color: 'var(--text-primary)' }}>${toNum(market_data.price)!.toFixed(2)}</strong>
                  </span>
                )}
                {market_data && toNum(market_data.market_cap) != null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6a6a6a' }}>
                    Mkt Cap <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(toNum(market_data.market_cap)!)}</strong>
                  </span>
                )}
                {market_data && toNum(market_data.beta) != null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6a6a6a' }}>
                    Beta <strong style={{ color: 'var(--text-primary)' }}>{toNum(market_data.beta)!.toFixed(2)}</strong>
                  </span>
                )}
                {toNum(company.revenue_cagr_5yr) != null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#6a6a6a' }}>
                    Rev CAGR (5yr){' '}
                    <strong style={{
                      color: (toNum(company.revenue_cagr_5yr) ?? 0) >= 0 ? 'var(--delta-pos)' : 'var(--delta-neg)',
                    }}>
                      {toNum(company.revenue_cagr_5yr)!.toFixed(1)}%
                    </strong>
                  </span>
                )}
              </div>
              {company.description && (
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: '#5a5a5a',
                  fontStyle: 'italic', maxWidth: '580px', lineHeight: 1.55, marginTop: '10px',
                }}>
                  {company.description.length > 220 ? company.description.slice(0, 220) + '…' : company.description}
                </p>
              )}
            </div>

            <button
              onClick={handleExport}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '7px', padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.04)', cursor: 'pointer', flexShrink: 0,
                transition: 'all 150ms',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              ↓ Export for Analysis
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              fontFamily: 'var(--font-sans)', fontSize: '13.5px',
              fontWeight: activeTab === tab ? 500 : 400,
              color: activeTab === tab ? '#ffffff' : '#5a5a5a',
              backgroundColor: 'transparent', border: 'none',
              borderBottom: activeTab === tab ? '2px solid #ffffff' : '2px solid transparent',
              padding: '12px 18px', cursor: 'pointer', transition: 'color 150ms',
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 80px' }}>

        {activeTab === 'Financials' && (
          <div>
            {revChartData.length > 1 && (
              <div style={{
                backgroundColor: 'var(--bg-surface-1)', border: '1px solid #1f1f1f',
                borderRadius: '10px', padding: '20px', marginBottom: '22px',
              }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  Revenue &amp; Net Income
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a3a', marginBottom: '16px' }}>
                  {revChartData[0].year}–{revChartData[revChartData.length - 1].year} · Reported basis
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={revChartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a0a0a0" stopOpacity={0.10} />
                        <stop offset="100%" stopColor="#a0a0a0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#1a1a1a" />
                    <XAxis dataKey="year" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#5a5a5a' }} axisLine={{ stroke: '#1a1a1a' }} tickLine={false} />
                    <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#5a5a5a' }} tickFormatter={(v: number) => formatCurrency(v)} axisLine={false} tickLine={false} width={52} />
                    <Tooltip
                      contentStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px', backgroundColor: 'rgba(10,10,10,0.96)', border: '1px solid #2a2a2a', borderRadius: '8px', color: 'var(--text-primary)' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.15)' }}
                      formatter={(v: unknown) => [formatCurrency(Number(v))]}
                    />
                    <Area type="monotone" dataKey="Revenue" stroke="#ffffff" strokeWidth={2} fill="url(#revFill)" />
                    <Area type="monotone" dataKey="Net Income" stroke="#a0a0a0" strokeWidth={2} fill="url(#netFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
              {(['Income Statement', 'Balance Sheet', 'Cash Flow'] as FinTab[]).map(ft => (
                <button key={ft} onClick={() => setFinTab(ft)} style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px', padding: '5px 12px', borderRadius: '5px',
                  border: '1px solid', borderColor: finTab === ft ? 'rgba(255,255,255,0.25)' : '#2a2a2a',
                  backgroundColor: finTab === ft ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: finTab === ft ? '#ffffff' : '#5a5a5a', cursor: 'pointer', transition: 'all 150ms',
                }}>
                  {ft}
                </button>
              ))}
            </div>
            <FinancialTable rows={activeFinRows} years={activeFinYears} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a3a', marginTop: '10px' }}>
              Source: Trikosh pipeline · {company.exchange ?? ''} · {company.currency ?? 'USD'} · Verify against primary filings.
            </p>
          </div>
        )}

        {activeTab === 'Ratios' && (
          <div>
            {latestRatios == null ? (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3a3a3a', padding: '24px 0' }}>
                No ratio data available for this company yet.
              </p>
            ) : (
              <>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: '#3a3a3a', marginBottom: '18px' }}>
                  FY{latestRatios.fiscal_year} — most recent year available
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {RATIO_MAP.map(({ label, key, unit }) => {
                    const raw = latestRatios[key]
                    const formatted = fmtRatio(raw, unit)
                    const n = toNum(raw)
                    return (
                      <div key={label} style={{
                        backgroundColor: 'var(--bg-surface-1)', border: '1px solid #1f1f1f',
                        borderRadius: '8px', padding: '14px 16px', transition: 'border-color 200ms',
                      }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#1f1f1f')}
                      >
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a3a3a', marginBottom: '6px' }}>
                          {label}
                        </p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: n != null ? 'var(--text-primary)' : '#3a3a3a', marginBottom: '3px', letterSpacing: '-0.01em' }}>
                          {formatted}
                        </p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#3a3a3a' }}>
                          FY{latestRatios.fiscal_year}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a3a', marginTop: '14px' }}>
              Source: Trikosh pipeline · Peer median calculated from Trikosh coverage universe only.
            </p>
          </div>
        )}

        {activeTab === 'Peers' && (
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: '#6a6a6a', marginBottom: '20px' }}>
              Peer companies in {company.sector}.
            </p>
            {peers.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                No peer companies found in the database for this sector.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {peers.map(peer => (
                  <Link key={peer.ticker} href={`/companies/${peer.ticker}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        backgroundColor: 'var(--bg-surface-1)', border: '1px solid #1f1f1f',
                        borderRadius: '8px', padding: '14px 18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'border-color 150ms, background-color 150ms', cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
                        ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#1f1f1f'
                        ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-surface-1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-primary)', minWidth: '52px' }}>
                          {peer.ticker}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                          {peer.name || peer.ticker}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {peer.country && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', color: '#4a4a4a' }}>{peer.country}</span>}
                        {peer.exchange && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: '#4a4a4a', backgroundColor: 'var(--bg-muted)', padding: '2px 6px', borderRadius: '3px' }}>
                            {peer.exchange}
                          </span>
                        )}
                        <span style={{ color: '#3a3a3a', fontSize: '14px' }}>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a3a', marginTop: '16px' }}>
              Source: Trikosh pipeline · Peer selection limited to Trikosh coverage universe.
            </p>
          </div>
        )}

        {activeTab === 'Overview' && (
          <div style={{ maxWidth: '660px' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Key Research Questions
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#5a5a5a', marginBottom: '24px', lineHeight: 1.65 }}>
              These questions do not have answers here. Your job is to find them — in the 10-K, the earnings calls, and the financial statements.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {researchQuestions.map((q, i) => (
                <div key={i} style={{
                  backgroundColor: 'var(--bg-surface-1)', border: '1px solid #1f1f1f',
                  borderRadius: '8px', padding: '18px 20px', borderLeft: '2px solid rgba(255,255,255,0.2)',
                }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Question {i + 1}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.65 }}>
                    {q}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a3a', marginTop: '20px' }}>
              Source: Trikosh research framework · Research questions are sector-generic.
            </p>
          </div>
        )}

        {/* Data Notes — always visible, outside tab conditionals */}
        <div style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid #1a1a1a' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#2a2a2a', marginBottom: '10px',
          }}>
            Data Notes
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              'Financial data is sourced from yFinance and may reflect a lag of 1–2 quarters behind the most recent filing.',
              'US companies report under GAAP; non-US companies (marked IFRS) report under IFRS. Direct ratio comparisons across standards should be made with caution.',
              'All non-USD figures are converted at the exchange rate prevailing at the time of the fiscal year end. Currency fluctuations may affect comparability.',
              'Certain line items (e.g. Non-Interest Income for banks, R&D for Indian pharma) are structurally unavailable from the data source and will display as N/A.',
            ].map((note, i) => (
              <li key={i} style={{
                fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#2a2a2a',
                lineHeight: 1.6, paddingLeft: '12px', position: 'relative',
              }}>
                <span style={{ position: 'absolute', left: 0 }}>·</span>
                {note}
              </li>
            ))}
          </ul>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#2a2a2a',
            marginTop: '10px', letterSpacing: '0.04em',
          }}>
            Data as of June 2026
          </p>
        </div>
      </div>
    </div>
  )
}
