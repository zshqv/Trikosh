'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const PALETTE = ['#2563EB', '#6366F1', '#0EA5E9', '#D97706'] as const

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
  if (v == null) return '\u2013'
  return `${(v * 100).toFixed(1)}%`
}
function fmtMult(v: number | null) {
  if (v == null) return '\u2013'
  return `${v.toFixed(1)}\u00d7`
}
function fmtRev(v: number | null) {
  if (v == null) return '\u2013'
  const b = v / 1e9
  return b >= 100 ? `$${b.toFixed(0)}B` : `$${b.toFixed(1)}B`
}
function fmtGrowth(v: number | null) {
  if (v == null) return '\u2013'
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
  'Revenue & Growth': 'Scale and pace of growth \u2014 calibrates how much the business can change in absolute terms.',
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

const NULL_TICKER = ''

export default function ComparePage() {
  const [allCompanies, setAllCompanies] = useState<CompanyMeta[]>([])
  const [tickers, setTickers] = useState<string[]>([NULL_TICKER, NULL_TICKER])
  const [details, setDetails] = useState<Record<string, CompanyDetail>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [sectorFilter, setSectorFilter] = useState<string>('All')
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [trendMetric, setTrendMetric] = useState<'gross_margin' | 'operating_margin' | 'net_margin'>('operating_margin')
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetch('/api/companies?limit=200')
      .then(r => r.json())
      .then(data => setAllCompanies(data.companies ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (openDropdown === null) return
      const ref = dropdownRefs.current[openDropdown]
      if (ref && !ref.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [openDropdown])

  useEffect(() => {
    tickers.forEach(ticker => {
      if (!ticker || details[ticker] || loading[ticker]) return
      setLoading(prev => ({ ...prev, [ticker]: true }))
      fetch(`/api/companies/${ticker}`)
        .then(r => r.json())
        .then(data => setDetails(prev => ({ ...prev, [ticker]: data })))
        .catch(() => {})
        .finally(() => setLoading(prev => ({ ...prev, [ticker]: false })))
    })
  }, [tickers])

  const activeTickers = tickers.filter(t => t !== NULL_TICKER)

  const crossSector = useMemo(() => {
    const sectors = new Set(activeTickers.map(t => allCompanies.find(c => c.ticker === t)?.sector))
    return sectors.size > 1
  }, [activeTickers, allCompanies])

  const marginBarData = useMemo(() =>
    activeTickers.map(t => {
      const d = details[t]
      const r = d?.financial_ratios[0]
      return {
        ticker: t,
        'Gross':     r ? +(toNum(r.gross_margin)     ?? 0) * 100 : 0,
        'Operating': r ? +(toNum(r.operating_margin) ?? 0) * 100 : 0,
        'Net':       r ? +(toNum(r.net_margin)       ?? 0) * 100 : 0,
      }
    }), [activeTickers, details])

  const trendData = useMemo(() => {
    const years = ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025']
    return years.map(yr => {
      const pt: Record<string, string | number> = { year: yr }
      activeTickers.forEach(t => {
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
  }, [activeTickers, details, trendMetric])

  function leaderIdx(metric: MetricDef): number | null {
    if (metric.higherIsBetter === null) return null
    const vals = activeTickers.map(t => details[t] ? metric.extract(details[t]) : null)
    const nums = vals.filter((v): v is number => v !== null)
    if (nums.length < 2) return null
    const best = metric.higherIsBetter ? Math.max(...nums) : Math.min(...nums)
    return vals.findIndex(v => v === best)
  }

  function loserIdx(metric: MetricDef): number | null {
    if (metric.higherIsBetter === null) return null
    const vals = activeTickers.map(t => details[t] ? metric.extract(details[t]) : null)
    const nums = vals.filter((v): v is number => v !== null)
    if (nums.length < 2) return null
    const worst = metric.higherIsBetter ? Math.min(...nums) : Math.max(...nums)
    const lastIdx = vals.map((v, i) => v === worst ? i : -1).filter(i => i !== -1).pop()
    return lastIdx ?? null
  }

  const filteredCompanies = useMemo(() =>
    allCompanies.filter(c => sectorFilter === 'All' || c.sector === sectorFilter),
    [allCompanies, sectorFilter])

  function selectTicker(slotIdx: number, ticker: string) {
    setTickers(prev => {
      const next = [...prev]
      next[slotIdx] = ticker
      return next
    })
    setOpenDropdown(null)
    setSectorFilter('All')
  }

  function removeTicker(slotIdx: number) {
    setTickers(prev => {
      const next = [...prev]
      if (prev.length > 2) {
        next.splice(slotIdx, 1)
      } else {
        next[slotIdx] = NULL_TICKER
      }
      return next
    })
  }

  function addSlot() {
    if (tickers.length >= 4) return
    setTickers(prev => [...prev, NULL_TICKER])
  }

  const isLoadingAny = activeTickers.some(t => loading[t])
  const hasEnoughToCompare = activeTickers.length >= 2

  const tooltipStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    backgroundColor: 'var(--bg-surface-1)',
    border: '0.5px solid rgba(0,0,0,0.10)',
    borderRadius: '6px',
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Page header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Peer Comparison
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Select 2\u20134 companies to compare key financial metrics side by side. Live data from Trikosh database.
          </p>
        </div>

        {/* Selector row */}
        <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>

            {/* Company slots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              {tickers.map((ticker, slotIdx) => {
                const co = allCompanies.find(c => c.ticker === ticker)
                const color = PALETTE[slotIdx]
                const isOpen = openDropdown === slotIdx
                const alreadySelected = new Set(tickers.filter((t, i) => i !== slotIdx && t !== NULL_TICKER))

                return (
                  <div key={slotIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {slotIdx > 0 && (
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>vs</span>
                    )}

                    <div style={{ position: 'relative' }} ref={el => { dropdownRefs.current[slotIdx] = el }}>
                      {/* Slot button */}
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : slotIdx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: ticker ? `${color}10` : 'var(--bg-surface-2)',
                          border: ticker ? `1px solid ${color}40` : 'var(--border-rest)',
                          borderRadius: '8px', cursor: 'pointer',
                          minWidth: '180px',
                        }}
                      >
                        {ticker && (
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                        )}
                        <span style={{ fontFamily: ticker ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: '13px', color: ticker ? color : 'var(--text-tertiary)', fontWeight: ticker ? 500 : 400, flex: 1, textAlign: 'left' }}>
                          {ticker ? ticker : 'Select company'}
                        </span>
                        {ticker && co && (
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-tertiary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {co.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        )}
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginLeft: '2px' }}>{isOpen ? '\u25b2' : '\u25bc'}</span>
                      </button>

                      {/* Remove button — only show if selected and we have more than 2 slots OR slot is filled */}
                      {ticker && (
                        <button
                          onClick={() => removeTicker(slotIdx)}
                          title="Remove"
                          style={{
                            position: 'absolute', top: '-7px', right: '-7px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            backgroundColor: 'var(--bg-surface-2)', border: 'var(--border-rest)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1,
                          }}
                        >\u00d7</button>
                      )}

                      {/* Dropdown */}
                      {isOpen && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
                          backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
                          borderRadius: '10px', width: '300px', maxHeight: '380px',
                          overflowY: 'auto', boxShadow: '0 6px 28px rgba(0,0,0,0.12)',
                        }}>
                          {/* Sector filter pills inside dropdown */}
                          <div style={{ padding: '10px 12px', borderBottom: 'var(--border-rest)', display: 'flex', flexWrap: 'wrap', gap: '5px', position: 'sticky', top: 0, backgroundColor: 'var(--bg-surface-1)', zIndex: 1 }}>
                            {['All', ...SECTORS].map(s => (
                              <button
                                key={s}
                                onClick={e => { e.stopPropagation(); setSectorFilter(s) }}
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

                          {filteredCompanies.length === 0 && (
                            <div style={{ padding: '16px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                              No companies in this sector.
                            </div>
                          )}

                          {filteredCompanies.map(co => {
                            const already = alreadySelected.has(co.ticker)
                            const isCurrent = ticker === co.ticker
                            return (
                              <button
                                key={co.ticker}
                                onClick={() => { if (!already) selectTicker(slotIdx, co.ticker) }}
                                disabled={already}
                                style={{
                                  width: '100%', textAlign: 'left', display: 'flex',
                                  alignItems: 'center', gap: '10px', padding: '8px 14px',
                                  background: isCurrent ? 'var(--bg-surface-2)' : 'none',
                                  border: 'none', cursor: already ? 'default' : 'pointer',
                                  opacity: already ? 0.35 : 1,
                                }}
                                onMouseEnter={e => { if (!already && !isCurrent) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-surface-2)' }}
                                onMouseLeave={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                              >
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-primary)', minWidth: '52px' }}>
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
                  </div>
                )
              })}

              {/* Add company button */}
              {tickers.length < 4 && (
                <button
                  onClick={addSlot}
                  title="Add company"
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-2)', border: 'var(--border-rest)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', color: 'var(--text-tertiary)', lineHeight: 1,
                    flexShrink: 0,
                  }}
                >+</button>
              )}
            </div>

            {/* Sector filter — right side */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)' }}>
                Filter by sector
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'flex-end' }}>
                {['All', ...SECTORS].map(s => (
                  <button
                    key={s}
                    onClick={() => setSectorFilter(s)}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px',
                      padding: '4px 10px', borderRadius: '5px', border: 'var(--border-rest)',
                      backgroundColor: sectorFilter === s ? 'var(--accent-primary)' : 'var(--bg-surface-2)',
                      color: sectorFilter === s ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {s === 'All' ? 'All' : s.split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Cross-sector warning */}
        {crossSector && hasEnoughToCompare && (
          <div style={{
            backgroundColor: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.25)',
            borderRadius: '8px', padding: '12px 16px', marginBottom: '16px',
          }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--delta-warn)' }}>
              <strong>Cross-sector comparison.</strong> Margin levels are not directly comparable across sectors \u2014 software gross margins run 70\u201385%, managed care runs 20\u201330%. Use relative trajectories and peer-group context, not absolute levels.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!hasEnoughToCompare && (
          <div style={{
            backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)',
            borderRadius: '12px', padding: '48px 24px', textAlign: 'center', marginBottom: '20px',
          }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-tertiary)' }}>
              Select at least 2 companies above to begin comparison.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoadingAny && (
          <div style={{ padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            Loading data\u2026
          </div>
        )}

        {/* Metrics table */}
        {hasEnoughToCompare && (
          <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: 'var(--border-rest)' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
                Key Metrics \u2014 Latest Fiscal Year
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Live data from Trikosh database \u00b7 Green = best in set \u00b7 Red = lowest in set
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
                    {activeTickers.map((ticker, i) => {
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
                            <td colSpan={activeTickers.length + 1} style={{
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
                      const loser  = loserIdx(metric)
                      rows.push(
                        <tr key={metric.label} style={{ backgroundColor: ri % 2 === 0 ? 'var(--bg-surface-1)' : 'transparent' }}>
                          <td style={{ padding: '10px 20px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', borderRight: 'var(--border-rest)' }}>
                            {metric.label}
                          </td>
                          {activeTickers.map((ticker, ci) => {
                            const d = details[ticker]
                            const raw = d ? metric.extract(d) : null
                            const isLeader = leader === ci
                            const isLoser  = loser  === ci
                            const isNeg = typeof raw === 'number' && raw < 0

                            let cellColor = 'var(--text-primary)'
                            if (isLeader)      cellColor = '#16a34a'
                            else if (isLoser)  cellColor = '#dc2626'
                            else if (isNeg)    cellColor = 'var(--delta-neg)'

                            return (
                              <td key={ticker} style={{ padding: '10px 20px', textAlign: 'right' }}>
                                {loading[ticker] ? (
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>\u2026</span>
                                ) : (
                                  <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                                    fontVariantNumeric: 'tabular-nums',
                                    color: cellColor,
                                    fontWeight: (isLeader || isLoser) ? 500 : 400,
                                  }}>
                                    {metric.format(raw)}
                                  </span>
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
                Source: Trikosh database \u00b7 Live data \u00b7 Green = best-in-set \u00b7 Red = lowest-in-set \u00b7 \u2013 shown where data unavailable
              </p>
            </div>
          </div>
        )}

        {/* Charts — only show when enough data */}
        {hasEnoughToCompare && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px' }}>

            {/* Margin bar chart */}
            <div style={{ backgroundColor: 'var(--bg-surface-1)', border: 'var(--border-rest)', borderRadius: '12px', padding: '22px' }}>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  Margin Profile \u2014 Latest FY
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Gross \u2192 Operating \u2192 Net margin per company.
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
                Source: Trikosh database \u00b7 Note: bank gross margin may be null \u2014 shown as 0
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
                    FY2021\u2013FY2025 \u00b7 Structural vs cyclical margin movement.
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
                  {activeTickers.map((ticker, i) => (
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
                Source: Trikosh database \u00b7 FY2021\u2013FY2025 \u00b7 Only years with available data are plotted
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
