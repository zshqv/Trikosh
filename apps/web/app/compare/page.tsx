'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, CartesianGrid,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import CardSpotlight from '@/components/aceternity/CardSpotlight'

const PALETTE = ['#ffffff', '#a0a0a0', '#38bdf8', '#fbbf24'] as const

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
  if (v == null) return '–'
  return `${(v * 100).toFixed(1)}%`
}
function fmtMult(v: number | null) {
  if (v == null) return '–'
  return `${v.toFixed(1)}×`
}
function fmtRev(v: number | null) {
  if (v == null) return '–'
  const b = v / 1e9
  return b >= 100 ? `$${b.toFixed(0)}B` : `$${b.toFixed(1)}B`
}
function fmtGrowth(v: number | null) {
  if (v == null) return '–'
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
  'Profitability':    'The margin waterfall from gross to FCF. Levels vary by sector; compare peer-relative trends.',
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
      .catch((err: unknown) => console.error('[compare] fetch failed:', err))
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
        .catch((err: unknown) => console.error('[compare] fetch failed:', err))
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
    backgroundColor: 'rgba(19,19,19,0.96)',
    border: '1px solid #444748',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    boxShadow: '0 12px 40px -12px rgba(0,0,0,0.8)',
  }
  const axisTick = { fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#8e9192' }

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #444748', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 28px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10.5px',
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: '#e5e2e1', marginBottom: '10px',
          }}>
            Quantitative tool
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4.5vw, 42px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: '6px',
          }}>
            Peer Comparison
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: '#8e9192' }}>
            Select 2–4 companies to compare key financial metrics side by side.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Selector */}
        <div style={{
          backgroundColor: 'var(--bg-surface-1)', border: '1px solid #444748',
          borderRadius: '12px', padding: '20px', marginBottom: '16px',
        }}>
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
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                        color: '#8e9192',
                      }}>vs</span>
                    )}

                    <div style={{ position: 'relative' }} ref={el => { dropdownRefs.current[slotIdx] = el }}>
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : slotIdx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: ticker ? `${color}10` : 'var(--bg-surface-2)',
                          border: ticker ? `1px solid ${color}35` : '1px solid #2a2a2a',
                          borderRadius: '8px', cursor: 'pointer',
                          minWidth: '180px', transition: 'border-color 150ms',
                        }}
                      >
                        {ticker && (
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                        )}
                        <span style={{
                          fontFamily: ticker ? 'var(--font-mono)' : 'var(--font-sans)',
                          fontSize: '13px',
                          color: ticker ? color : '#8e9192',
                          fontWeight: ticker ? 600 : 400, flex: 1, textAlign: 'left',
                        }}>
                          {ticker ? ticker : 'Select company'}
                        </span>
                        {ticker && co && (
                          <span style={{
                            fontFamily: 'var(--font-sans)', fontSize: '11px',
                            color: '#8e9192', maxWidth: '90px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {co.name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        )}
                        <span style={{ fontSize: '10px', color: '#3a3a3a' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {ticker && (
                        <button
                          onClick={() => removeTicker(slotIdx)}
                          title="Remove"
                          style={{
                            position: 'absolute', top: '-7px', right: '-7px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            backgroundColor: 'var(--bg-surface-2)',
                            border: '1px solid #444748',
                            cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', color: '#8e9192', lineHeight: 1,
                          }}
                        >×</button>
                      )}

                      {isOpen && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
                          backgroundColor: 'var(--bg-surface-1)', border: '1px solid #444748',
                          borderRadius: '10px', width: '300px', maxHeight: '380px',
                          overflowY: 'auto', boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                        }}>
                          <div style={{
                            padding: '10px 12px', borderBottom: '1px solid #1a1a1a',
                            display: 'flex', flexWrap: 'wrap', gap: '5px',
                            position: 'sticky', top: 0,
                            backgroundColor: 'var(--bg-surface-1)', zIndex: 1,
                          }}>
                            {['All', ...SECTORS].map(s => (
                              <button
                                key={s}
                                onClick={e => { e.stopPropagation(); setSectorFilter(s) }}
                                style={{
                                  fontFamily: 'var(--font-sans)', fontSize: '11px',
                                  padding: '3px 8px', borderRadius: '4px',
                                  border: '1px solid',
                                  borderColor: sectorFilter === s ? 'rgba(255,255,255,0.4)' : '#444748',
                                  backgroundColor: sectorFilter === s ? 'rgba(255,255,255,0.06)' : 'transparent',
                                  color: sectorFilter === s ? '#ffffff' : '#8e9192',
                                  cursor: 'pointer',
                                }}
                              >
                                {s === 'All' ? 'All' : s.split(' ')[0]}
                              </button>
                            ))}
                          </div>

                          {filteredCompanies.length === 0 && (
                            <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#3a3a3a' }}>
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
                                  background: isCurrent ? 'rgba(255,255,255,0.05)' : 'none',
                                  border: 'none', cursor: already ? 'default' : 'pointer',
                                  opacity: already ? 0.3 : 1,
                                }}
                                onMouseEnter={e => { if (!already && !isCurrent) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.03)' }}
                                onMouseLeave={e => { if (!isCurrent) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                              >
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-primary)', minWidth: '52px' }}>
                                  {co.ticker}
                                </span>
                                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: 'var(--text-primary)' }}>
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

              {tickers.length < 4 && (
                <button
                  onClick={addSlot}
                  title="Add company"
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-2)', border: '1px solid #444748',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px', color: '#8e9192', lineHeight: 1,
                  }}
                >+</button>
              )}
            </div>

            {/* Sector filter */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8e9192',
              }}>
                Filter by sector
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end' }}>
                {['All', ...SECTORS].map(s => (
                  <button
                    key={s}
                    onClick={() => setSectorFilter(s)}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px',
                      padding: '4px 9px', borderRadius: '4px',
                      border: '1px solid',
                      borderColor: sectorFilter === s ? 'rgba(255,255,255,0.4)' : '#444748',
                      backgroundColor: sectorFilter === s ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: sectorFilter === s ? '#ffffff' : '#8e9192',
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
            backgroundColor: 'rgba(217,119,6,0.05)',
            border: '1px solid rgba(217,119,6,0.2)',
            borderRadius: '8px', padding: '11px 16px', marginBottom: '16px',
          }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: 'var(--delta-warn)' }}>
              <strong>Heads up:</strong> These companies are from different sectors. Numbers may not be directly comparable — use this for broad context, not benchmarking.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!hasEnoughToCompare && (
          <div style={{
            backgroundColor: 'var(--bg-surface-1)', border: '1px solid #444748',
            borderRadius: '12px', padding: '64px 24px 60px',
            textAlign: 'center', marginBottom: '20px',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid #444748',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '22px', lineHeight: 1 }}>⊞</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700,
              letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: '8px',
            }}>
              Select two or more companies
            </p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-tertiary)',
              maxWidth: '340px', margin: '0 auto 24px', lineHeight: 1.65,
            }}>
              Use the selectors above to pick 2–4 companies. The tool will display a side-by-side
              metrics table and margin charts.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['AAPL', 'MSFT', 'JPM', 'GOOGL'].map(t => (
                <span key={t} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.05em',
                  padding: '4px 10px', borderRadius: '5px',
                  border: '1px solid #444748', color: 'var(--text-tertiary)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {isLoadingAny && !hasEnoughToCompare && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 18px', marginBottom: '12px',
            backgroundColor: 'var(--bg-surface-1)', border: '1px solid #444748',
            borderRadius: '8px',
          }}>
            <span style={{
              display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: 'rgba(255,255,255,0.7)',
              animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Fetching company data…
            </span>
          </div>
        )}
        {isLoadingAny && hasEnoughToCompare && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 0', marginBottom: '8px',
          }}>
            <span style={{
              display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: 'rgba(255,255,255,0.7)',
              animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Fetching company data…
            </span>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Metrics table */}
        {hasEnoughToCompare && (
          <div style={{
            backgroundColor: 'var(--bg-surface-1)', border: '1px solid #444748',
            borderRadius: '12px', marginBottom: '20px', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #1a1a1a' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                Key Metrics — Latest Fiscal Year
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a3a' }}>
                Live data · Green = best in set · Red = lowest in set
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <th style={{
                      padding: '10px 18px', textAlign: 'left',
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
                      textTransform: 'uppercase', letterSpacing: '0.07em', color: '#8e9192',
                      minWidth: '176px', borderRight: '1px solid #1a1a1a',
                    }}>Metric</th>
                    {activeTickers.map((ticker, i) => {
                      const co = allCompanies.find(c => c.ticker === ticker)
                      return (
                        <th key={ticker} style={{ padding: '10px 18px', textAlign: 'right', minWidth: '130px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: PALETTE[i] }} />
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: PALETTE[i] }}>
                                {ticker}
                              </span>
                            </div>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#8e9192', fontWeight: 400 }}>
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
                              padding: '10px 18px 5px',
                              backgroundColor: 'rgba(0,0,0,0.12)',
                              borderTop: ri > 0 ? '1px solid #1a1a1a' : 'none',
                            }}>
                              <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                                textTransform: 'uppercase', letterSpacing: '0.09em',
                                color: '#8e9192', fontWeight: 600,
                              }}>
                                {metric.group}
                              </span>
                              <span style={{
                                fontFamily: 'var(--font-sans)', fontSize: '11px',
                                color: '#8e9192', marginLeft: '10px', fontStyle: 'italic',
                              }}>
                                {GROUP_NOTES[metric.group]}
                              </span>
                            </td>
                          </tr>
                        )
                      }
                      const leader = leaderIdx(metric)
                      const loser  = loserIdx(metric)
                      rows.push(
                        <tr
                          key={metric.label}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.025)')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                        >
                          <td style={{
                            padding: '9px 18px', fontFamily: 'var(--font-sans)',
                            fontSize: '12.5px', color: '#8e9192',
                            borderRight: '1px solid #1a1a1a',
                          }}>
                            {metric.label}
                          </td>
                          {activeTickers.map((ticker, ci) => {
                            const d = details[ticker]
                            const raw = d ? metric.extract(d) : null
                            const isLeader = leader === ci
                            const isLoser  = loser  === ci
                            const isNeg = typeof raw === 'number' && raw < 0

                            let cellColor = 'var(--text-primary)'
                            if (isLeader)     cellColor = 'var(--delta-pos)'
                            else if (isLoser) cellColor = 'var(--delta-neg)'
                            else if (isNeg)   cellColor = 'var(--delta-neg)'

                            return (
                              <td key={ticker} style={{ padding: '9px 18px', textAlign: 'right' }}>
                                {loading[ticker] ? (
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>…</span>
                                ) : (
                                  <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '12.5px',
                                    fontVariantNumeric: 'tabular-nums', color: cellColor,
                                    fontWeight: (isLeader || isLoser) ? 600 : 400,
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

            <div style={{ padding: '9px 22px', borderTop: '1px solid #1a1a1a', backgroundColor: 'rgba(0,0,0,0.15)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                Source: Trikosh database · Live data · – shown where data unavailable
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        {hasEnoughToCompare && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '16px' }}>

            <CardSpotlight style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  Margin Profile — Latest FY
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  Gross → Operating → Net margin per company.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={marginBarData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barCategoryGap="28%">
                  <CartesianGrid vertical={false} stroke="#1a1a1a" />
                  <XAxis dataKey="ticker" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={{ ...axisTick }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} formatter={(v: unknown) => [`${v}%`]} />
                  <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '10px', paddingTop: '8px', color: '#8e9192' }} />
                  <Bar dataKey="Gross"     fill="#ffffff" fillOpacity={0.85} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Operating" fill="#a0a0a0" fillOpacity={0.85} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Net"       fill="#38bdf8" fillOpacity={0.9} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#8e9192', marginTop: '10px' }}>
                Note: bank gross margin may be null — shown as 0
              </p>
            </CardSpotlight>

            <CardSpotlight style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    5-Year Margin Trend
                  </h2>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    FY2021–FY2025
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
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
                        padding: '4px 9px', borderRadius: '4px',
                        border: '1px solid',
                        borderColor: trendMetric === opt.key ? 'rgba(255,255,255,0.4)' : '#444748',
                        backgroundColor: trendMetric === opt.key ? 'rgba(255,255,255,0.06)' : 'transparent',
                        color: trendMetric === opt.key ? '#ffffff' : '#8e9192',
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
                  <CartesianGrid vertical={false} stroke="#1a1a1a" />
                  <XAxis dataKey="year" tick={{ ...axisTick }} axisLine={{ stroke: '#383838' }} tickLine={false} />
                  <YAxis tick={{ ...axisTick }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} formatter={(v: unknown) => [`${v}%`]} />
                  <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '10px', paddingTop: '8px', color: '#8e9192' }} />
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
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#8e9192', marginTop: '10px' }}>
                FY2021–FY2025 · Only years with available data are plotted
              </p>
            </CardSpotlight>

          </div>
        )}
      </div>
        </div>
  )
}
