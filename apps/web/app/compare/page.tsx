'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const PALETTE = ['#2563EB', '#6366F1', '#0EA5E9', '#D97706'] as const

const SUGGESTED_SETS = [
  { tickers: ['JPM', 'GS'],               label: 'JPM vs GS',       rationale: 'Bulge bracket bank vs pure-play investment bank' },
  { tickers: ['MSFT', 'GOOGL'],           label: 'MSFT vs GOOGL',   rationale: 'Cloud-first SaaS vs advertising-dependent revenue model' },
  { tickers: ['JNJ', 'PFE'],              label: 'JNJ vs PFE',      rationale: 'Diversified healthcare conglomerate vs single-exposure pharma' },
  { tickers: ['NVDA', 'INTC'],            label: 'NVDA vs INTC',    rationale: 'AI capex beneficiary vs semiconductor incumbent' },
  { tickers: ['ABBV', 'MRK'],             label: 'ABBV vs MRK',     rationale: 'Patent cliff recovery story vs single-drug revenue concentration' },
  { tickers: ['JPM', 'BAC', 'GS', 'MS'], label: 'Big 4 Banks',     rationale: 'The four major US Wall Street banks on one screen' },
]

interface CompanyMeta {
  ticker: string
  name: string
  sector: string
  industry: string | null
  country: string | null
  exchange: string | null
}

interface RatioRow {
  fiscal_year: number
  gross_margin: string | null
  operating_margin: string | null
  net_margin: string | null
  return_on_equity: string | null
  return_on_assets: string | null
  free_cash_flow_yield: string | null
  price_to_earnings: string | null
  ev_to_ebitda: string | null
}

interface IncomeRow {
  fiscal_year: number
  revenue: string | null
}

interface CompanyDetail {
  company: CompanyMeta
  income_statements: IncomeRow[]
  financial_ratios: RatioRow[]
}

function toNum(v: unknown): number | null {
  if (v == null) return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function fmtPct(v: number | null) {
  if (v == null) return '—'
  return `${(v * 100).toFixed(1)}%`
}
function fmtMult(v: number | null) {
  if (v == null) return '—'
  return `${v.toFixed(1)}×`
}
function fmtRev(v: number | null) {
  if (v == null) return '—'
  const b = v / 1e9
  return b >= 100 ? `$${b.toFixed(0)}B` : `$${b.toFixed(1)}B`
}
function fmtGrowth(v: number | null) {
  if (v == null) return '—'
  const p = (v * 100).toFixed(1)
  return v >= 0 ? `+${p}%` : `${p}%`
}

interface MetricDef {
  label: string
  group: string
  higherIsBetter: boolean | null
  extract: (d: CompanyDetail) => number | null
  format: (v: number | null) => string
}

const METRICS: MetricDef[] = [
  {
    label: 'Revenue (latest FY)', group: 'Revenue & Growth', higherIsBetter: null,
    extract: d => toNum(d.income_statements[0]?.revenue),
    format: fmtRev,
  },
  {
    label: 'Revenue Growth YoY', group: 'Revenue & Growth', higherIsBetter: true,
    extract: d => {
      const r0 = toNum(d.income_statements[0]?.revenue)
      const r1 = toNum(d.income_statements[1]?.revenue)
      if (r0 == null || r1 == null || r1 === 0) return null
      return (r0 - r1) / Math.abs(r1)
    },
    format: fmtGrowth,
  },
  {
    label: 'Gross Margin', group: 'Profitability', higherIsBetter: true,
    extract: d => toNum(d.financial_ratios[0]?.gross_margin),
    format: fmtPct,
  },
  {
    label: 'Operating Margin', group: 'Profitability', higherIsBetter: true,
    extract: d => toNum(d.financial_ratios[0]?.operating_margin),
    format: fmtPct,
  },
  {
    label: 'Net Margin', group: 'Profitability', higherIsBetter: true,
    extract: d => toNum(d.financial_ratios[0]?.net_margin),
    format: fmtPct,
  },
  {
    label: 'FCF Yield', group: 'Profitability', higherIsBetter: true,
    extract: d => toNum(d.financial_ratios[0]?.free_cash_flow_yield),
    format: fmtPct,
  },
  {
    label: 'Return on Equity', group: 'Returns', higherIsBetter: true,
    extract: d => toNum(d.financial_ratios[0]?.return_on_equity),
    format: fmtPct,
  },
  {
    label: 'Return on Assets', group: 'Returns', higherIsBetter: true,
    extract: d => toNum(d.financial_ratios[0]?.return_on_assets),
    format: fmtPct,
  },
  {
    label: 'P/E Ratio', group: 'Valuation', higherIsBetter: null,
    extract: d => toNum(d.financial_ratios[0]?.price_to_earnings),
    format: fmtMult,
  },
  {
    label: 'EV / EBITDA', group: 'Valuation', higherIsBetter: null,
    extract: d => toNum(d.financial_ratios[0]?.ev_to_ebitda),
    format: fmtMult,
  },
]

const GROUP_NOTES: Record<string, string> = {
  'Revenue & Growth': 'Scale and pace of growth — calibrates how much the business can change in absolute terms.',
  'Profitability':    'The margin waterfall from gross to FCF. Levels vary widely by sector; compare peer-relative trends.',
  'Returns':          'ROE measures profit per dollar of equity. High ROE driven by leverage needs ROIC decomposition.',
  'Valuation':        'Relative tools, not absolute judgements. Growth rate, earnings quality, and sector norms all context.',
}

const SECTORS = [
  'Financial Services',
  'AI & Technology',
  'Healthcare',
  'Consumer & Retail',
  'Consumer Internet & Digital Platforms',
]

export default function ComparePage() {
  const [allCompanies, setAllCompanies] = useState<CompanyMeta[]>([])
  const [tickers, setTickers] = useState<string[]>(['JPM', 'GS'])
  const [details, setDetails] = useState<Record<string, CompanyDetail>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [sectorFilter, setSectorFilter] = useState<string>('All')
  const [showDropdown, setShowDropdown] = useState(false)
  const [trendMetric, setTrendMetric] = useState<'gross_margin' | 'operating_margin' | 'net_margin'>('operating_margin')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load all companies on mount
  useEffect(() => {
    fetch('/api/companies?limit=200')
      .then(r => r.json())
      .then(data => setAllCompanies(data.companies ?? []))
      .catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  // Fetch detail for each ticker that we don't have yet
  useEffect(() => {
    tickers.forEach(ticker => {
      if (details[ticker] || loading[ticker]) return
      setLoading(prev => ({ ...prev, [ticker]: true }))
      fetch(`/api/companies/${ticker}`)
        .then(r => r.json())
        .then(data => setDetails(prev => ({ ...prev, [ticker]: data })))
        .catch(() => {})
        .finally(() => setLoading(prev => ({ ...prev, [ticker]: false })))
    })
  }, [tickers])

  const crossSector = useMemo(() => {
    const sectors = new Set(tickers.map(t => allCompanies.find(c => c.ticker === t)?.sector))
    return sectors.size > 1
  }, [tickers, allCompanies])

  // Margin bar chart data
  const marginBarData = useMemo(() =>
    tickers.map(t => {
      const d = details[t]
      const r = d?.financial_ratios[0]
      return {
        ticker: t,
        'Gross':     r ? +(toNum(r.gross_margin)     ?? 0) * 100 : 0,
        'Operating': r ? +(toNum(r.operating_margin) ?? 0) * 100 : 0,
        'Net':       r ? +(toNum(r.net_margin)       ?? 0) * 100 : 0,
      }
    }), [tickers, details])

  // Trend line chart data
  const trendData = useMemo(() => {
    const years = ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025']
    return years.map(yr => {
      const pt: Record<string, string | number> = { year: yr }
      tickers.forEach(t => {
        const d = details[t]
        if (!d) return
        const fyNum = parseInt(yr.replace('FY', ''))
        const row = d.financial_ratios.find(r => r.fiscal_year === fyNum)
        if (row) {
          const v = toNum(row[trendMetric])
          if (v != null) pt[t] = +(v * 100).toFixed(1)
        }
      })
      return pt
    })
  }, [tickers, details, trendMetric])

  function leaderIdx(metric: MetricDef): number | null {
    if (metric.higherIsBetter === null) return null
    const vals = tickers.map(t => details[t] ? metric.extract(details[t]) : null)
    const nums = vals.filter((v): v is number => v !== null)
    if (!nums.length) return null
    const best = metric.higherIsBetter ? Math.max(...nums) : Math.min(...nums)
    return vals.findIndex(v => v === best)
  }

  const filteredCompanies = useMemo(() =>
    allCompanies.filter(c => sectorFilter === 'All' || c.sector === sectorFilter),
    [allCompanies, sectorFilter])

  const tooltipStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    backgroundColor: 'var(--bg-surface-1)',
    border: '0.5px solid rgba(0,0,0,0.10)',
    borderRadius: '6px',
  }

  const isLoadingAny = tickers.some(t => loading[t])

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Peer Comparison
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Select 2–4 companies to compare key financial metrics side by side. Live data from Trikosh database.
          </p>
        </div>

        {/* Selector card */}
        <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

          {/* Selected company chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            {tickers.map((ticker, i) => {
              const co = allCompanies.find(c => c.ticker === ticker)
              const color = PALETTE[i]
              return (
                <div key={ticker} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  backgroundColor: `${color}12`, border: `1px solid ${color}38`,
                  borderRadius: '7px', padding: '6px 10px',
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color, letterSpacing: '0.04em' }}>
                    {ticker}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {co?.name ?? ''}
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
                    borderRadius: '10px', width: '320px', maxHeight: '420px',
                    overflowY: 'auto', boxShadow: '0 6px 28px rgba(0,0,0,0.12)',
                  }}>
                    {/* Sector filter inside dropdown */}
                    <div style={{ padding: '10px 12px', borderBottom: 'var(--border-rest)', display: 'flex', flexWrap: 'wrap', gap: '5px', position: 'sticky', top: 0, backgroundColor: 'var(--bg-surface-1)', zIndex: 1 }}>
                      {['All', ...SECTORS].map(s => (
                        <button
                          key={s}
                          onClick={() => setSectorFilter(s)}
                          style={{
                            fontFamily: 'var(--font-sans)', fontSize: '11px',
                            padding: '3px 8px', borderRadius: '4px', border: 'var(--border-rest)',
                            backgroundColor: sectorFilter === s ? 'var(--accent-primary)' : 'var(--bg-surface-2)',
                            color: sectorFilter === s ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                          }}
                        >
                          {s === 'All' ? 'All' : s.split(' ')[0]}
                        </button>
                      ))}
                    </div>

                    {/* Company list */}
                    {filteredCompanies.map(co => {
                      const already = tickers.includes(co.ticker)
                      return (
                        <button
                          key={co.ticker}
                          onClick={() => {
                            if (!already) {
                              setTickers(p => [...p, co.ticker])
                              setShowDropdown(false)
                              setSectorFilter('All')
                            }
                          }}
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
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-primary)', minWidth: '56px' }}>
                            {co.ticker}
                          </span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-primary)' }}>
                            {co.name}
                          </span>
                        </button>
                      )
                    })}
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

        {/* Loading state */}
        {isLoadingAny && (
          <div style={{ padding: '16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
            Loading data...
          </div>
        )}

        {/* Metrics table */}
        <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: 'var(--border-rest)' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
              Key Metrics — Latest Fiscal Year
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Live data from Trikosh database · ◆ marks the leader for each row
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
                    const co = allCompanies.find(c => c.ticker === ticker)
                    return (
                      <th key={ticker} style={{ padding: '10px 20px', textAlign: 'right', minWidth: '140px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: PALETTE[i] }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color: PALETTE[i] }}>
                              {ticker}
                            </span>
                          </div>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                            {co?.name.split(' ').slice(0, 2).join(' ') ?? ''}
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
                  METRICS.forEach((metric, ri) => {
                    if (metric.group !== lastGroup) {
                      lastGroup = metric.group
                      rows.push(
                        <tr key={`g-${metric.group}`}>
                          <td colSpan={tickers.length + 1} style={{
                            padding: '12px 20px 6px',
                            backgroundColor: 'var(--bg-base)',
                            borderTop: ri > 0 ? 'var(--border-rest)' : 'none',
                          }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {metric.group}
                            </span>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-tertiary)', marginLeft: '12px', fontStyle: 'italic' }}>
                              {GROUP_NOTES[metric.group]}
                            </span>
                          </td>
                        </tr>
                      )
                    }
                    const leader = leaderIdx(metric)
                    rows.push(
                      <tr key={metric.label} style={{ backgroundColor: ri % 2 === 0 ? 'var(--bg-surface-1)' : 'transparent' }}>
                        <td style={{ padding: '10px 20px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', borderRight: 'var(--border-rest)' }}>
                          {metric.label}
                        </td>
                        {tickers.map((ticker, ci) => {
                          const d = details[ticker]
                          const raw = d ? metric.extract(d) : null
                          const isLeader = leader === ci
                          const col = PALETTE[ci]
                          const isNeg = typeof raw === 'number' && raw < 0
                          return (
                            <td key={ticker} style={{ padding: '10px 20px', textAlign: 'right' }}>
                              {loading[ticker] ? (
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>…</span>
                              ) : (
                                <>
                                  <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                                    fontVariantNumeric: 'tabular-nums',
                                    color: isLeader ? col : isNeg ? 'var(--delta-neg)' : 'var(--text-primary)',
                                    fontWeight: isLeader ? 500 : 400,
                                  }}>
                                    {metric.format(raw)}
                                  </span>
                                  {isLeader && <span style={{ marginLeft: '5px', fontSize: '9px', color: col }}>◆</span>}
                                </>
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
              Source: Trikosh database · Live data · ◆ marks best-in-set for margin and return metrics · — shown where data unavailable
            </p>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>

          {/* Margin bar chart */}
          <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '22px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
                Margin Profile — Latest FY
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Gross → Operating → Net margin per company.
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
              Source: Trikosh database · Note: bank gross margin may be null — shown as 0
            </p>
          </div>

          {/* Trend line chart */}
          <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  5-Year Margin Trend
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  FY2021–FY2025 · Structural vs cyclical margin movement.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {([
                  { key: 'gross_margin' as const,     label: 'Gross' },
                  { key: 'operating_margin' as const, label: 'Operating' },
                  { key: 'net_margin' as const,       label: 'Net' },
                ]).map(opt => (
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
              Source: Trikosh database · FY2021–FY2025 · Only years with available data are plotted
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}