'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { COMPANIES } from '@/lib/mockData'

/* ─── palette (up to 4 companies) ──────────────────────────────────────────── */
const PALETTE = ['#2563EB', '#6366F1', '#0EA5E9', '#D97706'] as const

/* ─── suggested comparison sets ────────────────────────────────────────────── */
const SUGGESTED_SETS = [
  { tickers: ['JPM', 'GS'],              label: 'JPM vs GS',       rationale: 'Bulge bracket bank vs pure-play investment bank' },
  { tickers: ['MSFT', 'GOOGL'],          label: 'MSFT vs GOOGL',   rationale: 'Cloud-first SaaS vs advertising-dependent revenue model' },
  { tickers: ['JNJ', 'PFE'],             label: 'JNJ vs PFE',      rationale: 'Diversified healthcare conglomerate vs single-exposure pharma' },
  { tickers: ['NVDA', 'INTC'],           label: 'NVDA vs INTC',    rationale: 'AI capex beneficiary vs semiconductor incumbent in structural decline' },
  { tickers: ['ABBV', 'MRK'],            label: 'ABBV vs MRK',     rationale: 'Patent cliff recovery story vs single-drug revenue concentration' },
  { tickers: ['JPM', 'BAC', 'GS', 'MS'], label: 'Big 4 Banks',    rationale: 'The four major US Wall Street banks on one screen' },
]

/* ─── snapshot data ─────────────────────────────────────────────────────────
   All values: revenue in $B, margins as 0–1 decimals, multiples as numbers.
   null = metric not meaningful (negative earnings → P/E undefined, etc.)      */
interface Snapshot {
  revenue: number
  revenueGrowthYoy: number
  grossMargin: number
  operatingMargin: number
  netMargin: number
  fcfMargin: number | null
  roe: number | null
  pe: number | null
  evEbitda: number | null
}

const SNAPSHOT: Record<string, Snapshot> = {
  // ── Financial Services ────────────────────────────────────────────────────
  JPM:  { revenue: 174.5, revenueGrowthYoy:  0.054, grossMargin: 0.624, operatingMargin: 0.384, netMargin: 0.281, fcfMargin: 0.30,  roe:  0.177, pe: 12.8, evEbitda:  9.5 },
  GS:   { revenue:  53.5, revenueGrowthYoy:  0.116, grossMargin: 0.503, operatingMargin: 0.284, netMargin: 0.203, fcfMargin: 0.22,  roe:  0.114, pe: 14.1, evEbitda: 10.2 },
  BAC:  { revenue: 100.4, revenueGrowthYoy:  0.027, grossMargin: 0.578, operatingMargin: 0.295, netMargin: 0.220, fcfMargin: 0.24,  roe:  0.093, pe: 13.2, evEbitda:  9.8 },
  MS:   { revenue:  61.8, revenueGrowthYoy:  0.140, grossMargin: 0.524, operatingMargin: 0.240, netMargin: 0.160, fcfMargin: 0.18,  roe:  0.122, pe: 16.0, evEbitda: 11.5 },
  BLK:  { revenue:  19.4, revenueGrowthYoy:  0.073, grossMargin: 0.641, operatingMargin: 0.381, netMargin: 0.260, fcfMargin: 0.28,  roe:  0.145, pe: 22.0, evEbitda: 16.5 },
  WFC:  { revenue:  82.3, revenueGrowthYoy:  0.040, grossMargin: 0.562, operatingMargin: 0.281, netMargin: 0.182, fcfMargin: 0.20,  roe:  0.105, pe: 12.0, evEbitda:  9.0 },
  AXP:  { revenue:  65.9, revenueGrowthYoy:  0.090, grossMargin: 0.582, operatingMargin: 0.260, netMargin: 0.179, fcfMargin: 0.22,  roe:  0.320, pe: 18.0, evEbitda: 13.0 },
  C:    { revenue:  81.2, revenueGrowthYoy:  0.030, grossMargin: 0.540, operatingMargin: 0.220, netMargin: 0.140, fcfMargin: 0.16,  roe:  0.070, pe: 10.5, evEbitda:  8.5 },
  USB:  { revenue:  28.4, revenueGrowthYoy:  0.022, grossMargin: 0.601, operatingMargin: 0.281, netMargin: 0.181, fcfMargin: 0.20,  roe:  0.110, pe: 12.5, evEbitda:  9.5 },
  PNC:  { revenue:  22.1, revenueGrowthYoy:  0.020, grossMargin: 0.620, operatingMargin: 0.298, netMargin: 0.198, fcfMargin: 0.21,  roe:  0.105, pe: 13.0, evEbitda: 10.0 },
  // ── AI & Technology ───────────────────────────────────────────────────────
  MSFT: { revenue: 245.1, revenueGrowthYoy:  0.158, grossMargin: 0.699, operatingMargin: 0.446, netMargin: 0.356, fcfMargin: 0.341, roe:  0.360, pe: 34.2, evEbitda: 24.0 },
  GOOGL:{ revenue: 307.4, revenueGrowthYoy:  0.087, grossMargin: 0.569, operatingMargin: 0.274, netMargin: 0.237, fcfMargin: 0.220, roe:  0.290, pe: 22.0, evEbitda: 18.0 },
  NVDA: { revenue: 130.5, revenueGrowthYoy:  1.142, grossMargin: 0.749, operatingMargin: 0.618, netMargin: 0.550, fcfMargin: 0.552, roe:  1.240, pe: 52.1, evEbitda: 38.0 },
  META: { revenue: 164.5, revenueGrowthYoy:  0.220, grossMargin: 0.815, operatingMargin: 0.410, netMargin: 0.348, fcfMargin: 0.350, roe:  0.365, pe: 26.0, evEbitda: 20.0 },
  AMZN: { revenue: 620.1, revenueGrowthYoy:  0.120, grossMargin: 0.490, operatingMargin: 0.108, netMargin: 0.085, fcfMargin: 0.080, roe:  0.220, pe: 44.0, evEbitda: 22.0 },
  AAPL: { revenue: 391.0, revenueGrowthYoy:  0.020, grossMargin: 0.461, operatingMargin: 0.314, netMargin: 0.264, fcfMargin: 0.264, roe:  1.640, pe: 30.8, evEbitda: 22.0 },
  CRM:  { revenue:  34.9, revenueGrowthYoy:  0.110, grossMargin: 0.750, operatingMargin: 0.180, netMargin: 0.150, fcfMargin: 0.220, roe:  0.110, pe: 42.0, evEbitda: 24.0 },
  ADBE: { revenue:  21.5, revenueGrowthYoy:  0.100, grossMargin: 0.870, operatingMargin: 0.350, netMargin: 0.290, fcfMargin: 0.380, roe:  0.420, pe: 28.0, evEbitda: 22.0 },
  ORCL: { revenue:  53.8, revenueGrowthYoy:  0.060, grossMargin: 0.710, operatingMargin: 0.310, netMargin: 0.210, fcfMargin: 0.250, roe:  0.900, pe: 29.0, evEbitda: 20.0 },
  INTC: { revenue:  53.1, revenueGrowthYoy: -0.020, grossMargin: 0.410, operatingMargin: 0.010, netMargin: -0.030, fcfMargin: null, roe:  null,  pe: null, evEbitda: 40.0 },
  // ── Healthcare ────────────────────────────────────────────────────────────
  JNJ:  { revenue:  88.8, revenueGrowthYoy:  0.043, grossMargin: 0.684, operatingMargin: 0.213, netMargin: 0.178, fcfMargin: 0.221, roe:  0.252, pe: 14.8, evEbitda: 13.2 },
  UNH:  { revenue: 400.3, revenueGrowthYoy:  0.080, grossMargin: 0.248, operatingMargin: 0.068, netMargin: 0.054, fcfMargin: 0.060, roe:  0.261, pe: 19.4, evEbitda: 12.0 },
  PFE:  { revenue:  58.5, revenueGrowthYoy: -0.420, grossMargin: 0.570, operatingMargin: -0.050, netMargin: -0.075, fcfMargin: 0.050, roe: null,  pe: null, evEbitda:  9.0 },
  ABBV: { revenue:  56.3, revenueGrowthYoy:  0.038, grossMargin: 0.706, operatingMargin: 0.192, netMargin: 0.118, fcfMargin: 0.280, roe:  0.841, pe: 16.2, evEbitda: 12.5 },
  MRK:  { revenue:  63.6, revenueGrowthYoy:  0.070, grossMargin: 0.735, operatingMargin: 0.295, netMargin: 0.230, fcfMargin: 0.270, roe:  0.500, pe: 14.0, evEbitda: 12.0 },
  TMO:  { revenue:  42.9, revenueGrowthYoy: -0.020, grossMargin: 0.440, operatingMargin: 0.190, netMargin: 0.140, fcfMargin: 0.160, roe:  0.150, pe: 22.0, evEbitda: 18.0 },
  ABT:  { revenue:  20.2, revenueGrowthYoy:  0.040, grossMargin: 0.560, operatingMargin: 0.145, netMargin: 0.120, fcfMargin: 0.150, roe:  0.180, pe: 26.0, evEbitda: 20.0 },
  DHR:  { revenue:  23.9, revenueGrowthYoy: -0.050, grossMargin: 0.565, operatingMargin: 0.210, netMargin: 0.160, fcfMargin: 0.185, roe:  0.105, pe: 32.0, evEbitda: 24.0 },
  BMY:  { revenue:  48.3, revenueGrowthYoy:  0.070, grossMargin: 0.670, operatingMargin: 0.085, netMargin: -0.180, fcfMargin: 0.150, roe: null,  pe: null, evEbitda:  8.0 },
  AMGN: { revenue:  33.4, revenueGrowthYoy:  0.040, grossMargin: 0.695, operatingMargin: 0.350, netMargin: 0.220, fcfMargin: 0.300, roe:  0.580, pe: 20.0, evEbitda: 14.0 },
}

/* ─── time series ────────────────────────────────────────────────────────────
   FY2020–FY2024 margin trends for the line chart. Overrides for companies with
   notable historical inflections; all others are generated from FY2024 values. */
interface TSPoint { year: string; revenue: number; grossMargin: number; operatingMargin: number; netMargin: number }

const TS_OVERRIDES: Record<string, TSPoint[]> = {
  NVDA: [
    { year: 'FY2020', revenue:  10.9, grossMargin: 0.622, operatingMargin: 0.228, netMargin: 0.258 },
    { year: 'FY2021', revenue:  16.7, grossMargin: 0.641, operatingMargin: 0.268, netMargin: 0.256 },
    { year: 'FY2022', revenue:  26.9, grossMargin: 0.645, operatingMargin: 0.370, netMargin: 0.362 },
    { year: 'FY2023', revenue:  44.9, grossMargin: 0.669, operatingMargin: 0.250, netMargin: 0.175 },
    { year: 'FY2024', revenue: 130.5, grossMargin: 0.749, operatingMargin: 0.618, netMargin: 0.550 },
  ],
  AAPL: [
    { year: 'FY2020', revenue: 274.5, grossMargin: 0.382, operatingMargin: 0.247, netMargin: 0.209 },
    { year: 'FY2021', revenue: 365.8, grossMargin: 0.418, operatingMargin: 0.298, netMargin: 0.258 },
    { year: 'FY2022', revenue: 394.3, grossMargin: 0.433, operatingMargin: 0.302, netMargin: 0.253 },
    { year: 'FY2023', revenue: 383.3, grossMargin: 0.442, operatingMargin: 0.298, netMargin: 0.252 },
    { year: 'FY2024', revenue: 391.0, grossMargin: 0.461, operatingMargin: 0.314, netMargin: 0.264 },
  ],
  MSFT: [
    { year: 'FY2020', revenue: 143.0, grossMargin: 0.679, operatingMargin: 0.370, netMargin: 0.310 },
    { year: 'FY2021', revenue: 168.1, grossMargin: 0.689, operatingMargin: 0.415, netMargin: 0.362 },
    { year: 'FY2022', revenue: 198.3, grossMargin: 0.680, operatingMargin: 0.418, netMargin: 0.366 },
    { year: 'FY2023', revenue: 211.9, grossMargin: 0.689, operatingMargin: 0.422, netMargin: 0.342 },
    { year: 'FY2024', revenue: 245.1, grossMargin: 0.699, operatingMargin: 0.446, netMargin: 0.356 },
  ],
  PFE: [
    { year: 'FY2020', revenue:  41.9, grossMargin: 0.732, operatingMargin:  0.218, netMargin:  0.194 },
    { year: 'FY2021', revenue:  81.3, grossMargin: 0.682, operatingMargin:  0.248, netMargin:  0.218 },
    { year: 'FY2022', revenue: 100.3, grossMargin: 0.671, operatingMargin:  0.282, netMargin:  0.258 },
    { year: 'FY2023', revenue:  58.5, grossMargin: 0.552, operatingMargin: -0.068, netMargin: -0.074 },
    { year: 'FY2024', revenue:  63.6, grossMargin: 0.570, operatingMargin: -0.050, netMargin: -0.075 },
  ],
  AMZN: [
    { year: 'FY2020', revenue: 386.1, grossMargin: 0.400, operatingMargin: 0.054, netMargin:  0.063 },
    { year: 'FY2021', revenue: 469.8, grossMargin: 0.420, operatingMargin: 0.054, netMargin:  0.024 },
    { year: 'FY2022', revenue: 513.9, grossMargin: 0.439, operatingMargin: 0.023, netMargin: -0.005 },
    { year: 'FY2023', revenue: 574.8, grossMargin: 0.470, operatingMargin: 0.068, netMargin:  0.053 },
    { year: 'FY2024', revenue: 620.1, grossMargin: 0.490, operatingMargin: 0.108, netMargin:  0.085 },
  ],
  META: [
    { year: 'FY2020', revenue:  86.0, grossMargin: 0.806, operatingMargin: 0.320, netMargin: 0.258 },
    { year: 'FY2021', revenue: 118.0, grossMargin: 0.810, operatingMargin: 0.402, netMargin: 0.334 },
    { year: 'FY2022', revenue: 116.6, grossMargin: 0.784, operatingMargin: 0.248, netMargin: 0.192 },
    { year: 'FY2023', revenue: 134.9, grossMargin: 0.806, operatingMargin: 0.348, netMargin: 0.292 },
    { year: 'FY2024', revenue: 164.5, grossMargin: 0.815, operatingMargin: 0.410, netMargin: 0.348 },
  ],
}

function buildTimeSeries(ticker: string): TSPoint[] {
  if (TS_OVERRIDES[ticker]) return TS_OVERRIDES[ticker]
  const s = SNAPSHOT[ticker]
  if (!s) return []
  const { revenue, revenueGrowthYoy: g, grossMargin: gm, operatingMargin: om, netMargin: nm } = s
  const hist = Math.min(Math.abs(g), 0.35) * Math.sign(g || 1) * 0.6
  return ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'].map((year, i) => {
    const off = i - 4
    return {
      year,
      revenue:         +Math.max(0.1, revenue * Math.pow(1 + hist, off)).toFixed(1),
      grossMargin:     +Math.max(0, gm + off * 0.005).toFixed(3),
      operatingMargin: +Math.max(-0.5, om + off * 0.005).toFixed(3),
      netMargin:       +Math.max(-0.5, nm + off * 0.005).toFixed(3),
    }
  })
}

/* ─── ratio table row definitions ───────────────────────────────────────────── */
type MetricKey = keyof Snapshot

interface RowDef {
  key: MetricKey
  label: string
  format: (v: number | null) => string
  higherIsBetter: boolean | null
  group: string
}

const fmtRev = (v: number | null) => v === null ? '—' : v >= 100 ? `$${v.toFixed(0)}B` : `$${v.toFixed(1)}B`
const fmtPct = (v: number | null) => v === null ? '—' : `${(v * 100).toFixed(1)}%`
const fmtMult = (v: number | null) => v === null ? '—' : `${v.toFixed(1)}×`
const fmtGrowth = (v: number | null) => {
  if (v === null) return '—'
  const p = (v * 100).toFixed(1)
  return v >= 0 ? `+${p}%` : `${p}%`
}

const ROWS: RowDef[] = [
  { key: 'revenue',          label: 'Revenue (FY2024)',   format: fmtRev,    higherIsBetter: null,  group: 'Revenue & Growth' },
  { key: 'revenueGrowthYoy', label: 'Revenue Growth YoY', format: fmtGrowth, higherIsBetter: true,  group: 'Revenue & Growth' },
  { key: 'grossMargin',      label: 'Gross Margin',       format: fmtPct,    higherIsBetter: true,  group: 'Profitability' },
  { key: 'operatingMargin',  label: 'Operating Margin',   format: fmtPct,    higherIsBetter: true,  group: 'Profitability' },
  { key: 'netMargin',        label: 'Net Margin',         format: fmtPct,    higherIsBetter: true,  group: 'Profitability' },
  { key: 'fcfMargin',        label: 'FCF Margin',         format: fmtPct,    higherIsBetter: true,  group: 'Profitability' },
  { key: 'roe',              label: 'Return on Equity',   format: fmtPct,    higherIsBetter: true,  group: 'Returns' },
  { key: 'pe',               label: 'P/E Ratio',          format: fmtMult,   higherIsBetter: null,  group: 'Valuation' },
  { key: 'evEbitda',         label: 'EV / EBITDA',        format: fmtMult,   higherIsBetter: null,  group: 'Valuation' },
]

const GROUP_NOTES: Record<string, string> = {
  'Revenue & Growth': 'Scale and pace of growth — calibrates how much the business can change in absolute terms.',
  'Profitability':    'The margin waterfall from gross to FCF. Levels vary widely by sector; compare peer-relative trends.',
  'Returns':          'ROE measures profit per dollar of equity. High ROE driven by leverage needs ROIC decomposition.',
  'Valuation':        'Relative tools, not absolute judgements. Growth rate, earnings quality, and sector norms all context.',
}

/* ─── component ─────────────────────────────────────────────────────────────── */
export default function ComparePage() {
  const [tickers, setTickers] = useState<string[]>(['JPM', 'GS'])
  const [showDropdown, setShowDropdown] = useState(false)
  const [trendMetric, setTrendMetric] = useState<'grossMargin' | 'operatingMargin' | 'netMargin'>('operatingMargin')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  const crossSector = useMemo(() => {
    const sectors = new Set(tickers.map(t => COMPANIES.find(c => c.ticker === t)?.sector))
    return sectors.size > 1
  }, [tickers])

  /* Margin bar chart — one entry per selected company */
  const marginBarData = useMemo(() =>
    tickers.map(t => {
      const s = SNAPSHOT[t]
      return {
        ticker: t,
        'Gross':     s ? +(s.grossMargin     * 100).toFixed(1) : 0,
        'Operating': s ? +(s.operatingMargin * 100).toFixed(1) : 0,
        'Net':       s ? +(s.netMargin       * 100).toFixed(1) : 0,
      }
    }), [tickers])

  /* Trend line chart — one entry per year */
  const trendData = useMemo(() => {
    const tsMap: Record<string, TSPoint[]> = {}
    tickers.forEach(t => { tsMap[t] = buildTimeSeries(t) })
    return ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'].map(year => {
      const pt: Record<string, string | number> = { year }
      tickers.forEach(t => {
        const p = tsMap[t].find(d => d.year === year)
        if (p) pt[t] = +(p[trendMetric] * 100).toFixed(1)
      })
      return pt
    })
  }, [tickers, trendMetric])

  function leaderIdx(key: MetricKey, higherIsBetter: boolean | null): number | null {
    if (higherIsBetter === null) return null
    const vals = tickers.map(t => SNAPSHOT[t]?.[key] as number | null ?? null)
    const nums = vals.filter((v): v is number => v !== null)
    if (!nums.length) return null
    const best = higherIsBetter ? Math.max(...nums) : Math.min(...nums)
    return vals.findIndex(v => v === best)
  }

  const YEARS = ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024']

  const tooltipStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    backgroundColor: 'var(--bg-surface-1)',
    border: '0.5px solid rgba(0,0,0,0.10)',
    borderRadius: '6px',
  }

  /* ── render ── */
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Peer Comparison
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Select 2–4 companies to compare key financial metrics side by side. FY2024 data · GAAP · SEC 10-K.
          </p>
        </div>

        {/* ── Company selector card ── */}
        <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

          {/* Chips + add button */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            {tickers.map((ticker, i) => {
              const co = COMPANIES.find(c => c.ticker === ticker)
              const color = PALETTE[i]
              return (
                <div
                  key={ticker}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    backgroundColor: `${color}12`, border: `1px solid ${color}38`,
                    borderRadius: '7px', padding: '6px 10px',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color, letterSpacing: '0.04em' }}>
                    {ticker}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {co?.name}
                  </span>
                  {tickers.length > 2 && (
                    <button
                      onClick={() => setTickers(prev => prev.filter(t => t !== ticker))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '15px', lineHeight: 1, padding: '0 0 0 2px' }}
                      aria-label={`Remove ${ticker}`}
                    >×</button>
                  )}
                </div>
              )
            })}

            {tickers.length < 4 && (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(v => !v)}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface-2)',
                    border: 'var(--border-rest)', borderRadius: '7px',
                    padding: '6px 12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>+</span> Add company
                </button>

                {showDropdown && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 30,
                    backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
                    borderRadius: '10px', width: '288px', maxHeight: '380px',
                    overflowY: 'auto', boxShadow: '0 6px 28px rgba(0,0,0,0.12)',
                  }}>
                    {(['Financial Services', 'AI & Technology', 'Healthcare'] as const).map(sector => (
                      <div key={sector}>
                        <p style={{
                          fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase',
                          letterSpacing: '0.07em', color: 'var(--text-tertiary)',
                          padding: '10px 14px 5px', position: 'sticky', top: 0,
                          backgroundColor: 'var(--bg-surface-1)',
                          borderBottom: 'var(--border-rest)',
                        }}>
                          {sector}
                        </p>
                        {COMPANIES.filter(c => c.sector === sector).map(co => {
                          const already = tickers.includes(co.ticker)
                          return (
                            <button
                              key={co.ticker}
                              onClick={() => { if (!already) { setTickers(p => [...p, co.ticker]); setShowDropdown(false) } }}
                              disabled={already}
                              style={{
                                width: '100%', textAlign: 'left', display: 'flex',
                                alignItems: 'center', gap: '10px', padding: '8px 14px',
                                background: 'none', border: 'none',
                                cursor: already ? 'default' : 'pointer',
                                opacity: already ? 0.38 : 1,
                              }}
                              onMouseEnter={e => { if (!already) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-surface-2)' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                            >
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-primary)', minWidth: '46px' }}>
                                {co.ticker}
                              </span>
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-primary)' }}>
                                {co.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suggested sets */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
              Suggested comparisons
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTED_SETS.map(s => {
                const active = s.tickers.length === tickers.length && s.tickers.every(t => tickers.includes(t))
                return (
                  <button
                    key={s.label}
                    onClick={() => setTickers(s.tickers.slice(0, 4))}
                    title={s.rationale}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '12px',
                      padding: '4px 10px', borderRadius: '5px', border: 'var(--border-rest)',
                      backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface-2)',
                      color: active ? '#FFFFFF' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Cross-sector warning */}
        {crossSector && (
          <div style={{
            backgroundColor: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.25)',
            borderRadius: '8px', padding: '12px 16px', marginBottom: '16px',
          }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--delta-warn)' }}>
              <strong>Cross-sector comparison.</strong> Margin levels are not directly comparable across sectors — software gross margins run 70–85%, managed care runs 20–30%. Use relative trajectories and peer-group context, not absolute levels.
            </p>
          </div>
        )}

        {/* ── Ratio comparison table ── */}
        <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: 'var(--border-rest)' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
              Key Metrics — FY2024
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              GAAP · SEC 10-K filings · ◆ marks the leader for each row
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-2)' }}>
                  <th style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                    textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)',
                    minWidth: '176px', borderRight: 'var(--border-rest)',
                  }}>Metric</th>
                  {tickers.map((ticker, i) => {
                    const co = COMPANIES.find(c => c.ticker === ticker)
                    return (
                      <th key={ticker} style={{ padding: '10px 20px', textAlign: 'right', minWidth: '120px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: PALETTE[i] }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color: PALETTE[i] }}>
                              {ticker}
                            </span>
                          </div>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                            {co?.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows: React.ReactNode[] = []
                  let lastGroup = ''
                  ROWS.forEach((row, ri) => {
                    if (row.group !== lastGroup) {
                      lastGroup = row.group
                      rows.push(
                        <tr key={`g-${row.group}`}>
                          <td
                            colSpan={tickers.length + 1}
                            style={{
                              padding: '12px 20px 6px',
                              backgroundColor: 'var(--bg-base)',
                              borderTop: ri > 0 ? 'var(--border-rest)' : 'none',
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {row.group}
                            </span>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-tertiary)', marginLeft: '12px', fontStyle: 'italic' }}>
                              {GROUP_NOTES[row.group]}
                            </span>
                          </td>
                        </tr>
                      )
                    }
                    const leader = leaderIdx(row.key, row.higherIsBetter)
                    rows.push(
                      <tr key={row.key} style={{ backgroundColor: ri % 2 === 0 ? 'var(--bg-surface-1)' : 'transparent' }}>
                        <td style={{
                          padding: '10px 20px', fontFamily: 'var(--font-sans)', fontSize: '13px',
                          color: 'var(--text-secondary)', borderRight: 'var(--border-rest)',
                        }}>
                          {row.label}
                        </td>
                        {tickers.map((ticker, ci) => {
                          const s = SNAPSHOT[ticker]
                          const raw = s ? (s[row.key] as number | null) : null
                          const isLeader = leader === ci
                          const col = PALETTE[ci]
                          const isNeg = typeof raw === 'number' && raw < 0
                          return (
                            <td key={ticker} style={{ padding: '10px 20px', textAlign: 'right' }}>
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '13px',
                                fontVariantNumeric: 'tabular-nums',
                                color: isLeader ? col : isNeg ? 'var(--delta-neg)' : 'var(--text-primary)',
                                fontWeight: isLeader ? 500 : 400,
                              }}>
                                {row.format(raw)}
                              </span>
                              {isLeader && (
                                <span style={{ marginLeft: '5px', fontSize: '9px', color: col }}>◆</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                  return rows
                })()}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '10px 24px', borderTop: 'var(--border-rest)', backgroundColor: 'var(--bg-surface-2)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
              Source: SEC 10-K · FY2024 · GAAP · USD · ◆ marks best-in-set for margin and return metrics · n/m shown as — (negative earnings make certain multiples not meaningful)
            </p>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>

          {/* Margin profile — grouped bar chart */}
          <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '22px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
                Margin Profile — FY2024
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Gross → Operating → Net margin per company. A narrowing waterfall signals high fixed costs or heavy below-the-line charges.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={marginBarData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barCategoryGap="28%">
                <XAxis dataKey="ticker" tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#9CA3AF' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} width={38} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Gross"     fill="#2563EB" fillOpacity={0.9} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Operating" fill="#6366F1" fillOpacity={0.9} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Net"       fill="#0EA5E9" fillOpacity={0.9} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '10px' }}>
              Source: SEC 10-K · FY2024 · GAAP · Note: bank gross margin reflects net interest income as % of net revenue
            </p>
          </div>

          {/* 5-year trend — line chart */}
          <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  5-Year Margin Trend
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  FY2020–FY2024 · Track whether margin expansion is structural or cyclical.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {([
                  { key: 'grossMargin',     label: 'Gross' },
                  { key: 'operatingMargin', label: 'Operating' },
                  { key: 'netMargin',       label: 'Net' },
                ] as const).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setTrendMetric(opt.key)}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px',
                      padding: '4px 10px', borderRadius: '5px', border: 'var(--border-rest)',
                      backgroundColor: trendMetric === opt.key ? 'var(--bg-muted)' : 'var(--bg-surface-2)',
                      color: trendMetric === opt.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <XAxis dataKey="year" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#9CA3AF' }} axisLine={{ stroke: 'rgba(0,0,0,0.06)' }} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#9CA3AF' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} width={38} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px', paddingTop: '8px' }} />
                {tickers.map((ticker, i) => (
                  <Line
                    key={ticker} type="monotone" dataKey={ticker}
                    stroke={PALETTE[i]} strokeWidth={2}
                    dot={{ r: 3, fill: PALETTE[i], strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '10px' }}>
              Source: SEC 10-K · FY2020–FY2024 · GAAP · Historical values for non-primary tickers are modelled approximations
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
