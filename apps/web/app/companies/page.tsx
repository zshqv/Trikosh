'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { COMPANIES, MOCK_CARDS } from '@/lib/mockData'
import type { Sector, CardData } from '@/lib/types'

/* ── Navigation ────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors'   },
  { label: 'Compare',   href: '/compare'   },
  { label: 'Research',  href: '/research'  },
  { label: 'Glossary',  href: '/glossary'  },
  { label: 'About',     href: '/about'     },
]

/* ── Filter / sort options ─────────────────────────────────────────── */

const SECTOR_OPTIONS: { value: Sector | 'all'; label: string }[] = [
  { value: 'all',                                   label: 'All Sectors' },
  { value: 'Financial Services',                    label: 'Financial Services' },
  { value: 'AI & Technology',                       label: 'AI & Technology' },
  { value: 'Healthcare',                            label: 'Healthcare & Pharmaceuticals' },
  { value: 'Consumer & Retail',                     label: 'Consumer & Retail' },
  { value: 'Consumer Internet & Digital Platforms', label: 'Consumer Internet & Digital Platforms' },
]

type SortOption = 'pe_desc' | 'roe_desc' | 'name_asc'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'pe_desc',  label: 'P/E Ratio (Desc)'   },
  { value: 'roe_desc', label: '5YR AVG ROE (Desc)' },
  { value: 'name_asc', label: 'Company Name (A-Z)'  },
]

/* ── Data builder ──────────────────────────────────────────────────── */

function buildCardData(ticker: string): CardData {
  const existing = MOCK_CARDS.find(c => c.company.ticker === ticker)
  if (existing) return existing
  const company = COMPANIES.find(c => c.ticker === ticker)!
  const sectorDefaults: Record<Sector, { primary: string; secondary: string; sparkline: number[] }> = {
    'Financial Services':                    { primary: 'ROE',               secondary: 'Net Interest Margin',     sparkline: [0.10, 0.11, 0.10, 0.12, 0.12, 0.11] },
    'AI & Technology':                       { primary: 'FCF Margin',        secondary: 'Revenue Growth YoY',      sparkline: [50e9, 60e9, 72e9, 85e9, 98e9, 112e9] },
    'Healthcare':                            { primary: 'Gross Margin',      secondary: 'R&D as % Revenue',        sparkline: [0.58, 0.60, 0.61, 0.62, 0.63, 0.63] },
    'Consumer & Retail':                     { primary: 'Gross Margin',      secondary: 'Same-Store Sales Growth', sparkline: [0.32, 0.33, 0.34, 0.33, 0.35, 0.36] },
    'Consumer Internet & Digital Platforms': { primary: 'Revenue Growth YoY', secondary: 'EBITDA Margin',         sparkline: [0.20, 0.25, 0.30, 0.35, 0.38, 0.40] },
  }
  const def = sectorDefaults[company.sector]
  return {
    company,
    primaryMetric:   { label: def.primary,   value: 0.12,  unit: 'PCT'      as const, period: 'FY2024' },
    secondaryMetric: { label: def.secondary,  value: 0.025, unit: 'PCT'      as const, period: 'FY2024' },
    ratios: [
      { label: 'P/E', value: 16.0, unit: 'MULTIPLE' as const, period: 'FY2024' },
      { label: 'ROE', value: 0.12, unit: 'PCT'      as const, period: 'FY2024' },
    ],
    sparkline: def.sparkline,
    source: { source: 'SEC 10-K' as const, standard: 'GAAP' as const, period: 'FY2024', updatedAt: '2025-01-14', currency: 'USD' as const },
  }
}

/* ── Formatters ────────────────────────────────────────────────────── */

function fmtGrossMargin(card: CardData): string {
  const fromRatios = card.ratios.find(r => r.label === 'Gross Margin')
  if (fromRatios) return (fromRatios.value * 100).toFixed(1) + '%'
  if (card.primaryMetric.label === 'Gross Margin') return (card.primaryMetric.value * 100).toFixed(1) + '%'
  if (card.secondaryMetric?.label === 'Gross Margin') return (card.secondaryMetric.value * 100).toFixed(1) + '%'
  return '—'
}

function fmtPE(card: CardData): string {
  const pe = card.ratios.find(r => r.label === 'P/E')
  return pe ? pe.value.toFixed(1) + 'x' : '—'
}

/* ── Shared select style ───────────────────────────────────────────── */

const selectStyle: React.CSSProperties = {
  padding: '7px 12px',
  fontFamily: 'var(--font-sans)',
  fontSize: '13px',
  color: '#e5e2e1',
  backgroundColor: '#1c1b1b',
  border: '1px solid #444749',
  borderRadius: '6px',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CompaniesPage() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [search,  setSearch]  = useState('')
  const [sector,  setSector]  = useState<Sector | 'all'>('all')
  const [sort,    setSort]    = useState<SortOption>('pe_desc')

  const allCards = useMemo(() => COMPANIES.map(c => buildCardData(c.ticker)), [])

  const rows = useMemo(() => {
    let result = allCards.slice()
    if (sector !== 'all') result = result.filter(c => c.company.sector === sector)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.company.name.toLowerCase().includes(q) || c.company.ticker.toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      if (sort === 'name_asc') return a.company.name.localeCompare(b.company.name)
      if (sort === 'roe_desc') {
        const av = a.ratios.find(r => r.label === 'ROE')?.value ?? a.primaryMetric.value
        const bv = b.ratios.find(r => r.label === 'ROE')?.value ?? b.primaryMetric.value
        return bv - av
      }
      const ap = a.ratios.find(r => r.label === 'P/E')?.value ?? 0
      const bp = b.ratios.find(r => r.label === 'P/E')?.value ?? 0
      return bp - ap
    })
    return result
  }, [allCards, sector, search, sort])

  function exportCSV() {
    const lines = [
      'Company Name,Ticker,Sector,5YR AVG ROE,P/E Ratio',
      ...rows.map(c =>
        `"${c.company.name}",${c.company.ticker},"${c.company.sector}",${fmtROE(c)},${fmtPE(c)}`
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'trikosh-companies.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sectorLabel = SECTOR_OPTIONS.find(o => o.value === sector)?.label ?? ''

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - var(--nav-h))',
      overflow: 'hidden',
      backgroundColor: '#131315',
    }}>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside style={{
        width: '256px',
        flexShrink: 0,
        borderRight: '1px solid #444749',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#131315',
        overflow: 'hidden',
      }}>
        {/* Wordmark */}
        <div style={{
          padding: '20px 20px 18px',
          borderBottom: '1px solid rgba(68,71,73,0.5)',
          flexShrink: 0,
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}>
              Trikosh
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '9px 20px 9px 18px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: active ? 500 : 400,
                  color: active ? '#ffffff' : '#8e9192',
                  textDecoration: 'none',
                  backgroundColor: active ? '#353534' : 'transparent',
                  borderLeft: active ? '2px solid #ffffff' : '2px solid transparent',
                  transition: 'background-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    el.style.color = '#c4c7c8'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.backgroundColor = 'transparent'
                    el.style.color = '#8e9192'
                  }
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid rgba(68,71,73,0.5)',
          padding: '10px 0',
        }}>
          {[
            { label: 'Docs',   href: '#' },
            { label: 'GitHub', href: 'https://github.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                display: 'block',
                padding: '8px 20px',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: '#8e9192',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#c4c7c8' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#8e9192' }}
            >
              {label}
            </a>
          ))}
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Filter bar */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px',
          borderBottom: '1px solid #444749',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#131315',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '280px' }}>
            <span style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '13px',
              color: '#8e9192',
              pointerEvents: 'none',
              fontFamily: 'var(--font-mono)',
            }}>
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search companies or tickers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 28px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: '#e5e2e1',
                backgroundColor: '#1c1b1b',
                border: '1px solid #444749',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 150ms',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.3)')}
              onBlur={e => (e.target.style.borderColor = '#444749')}
            />
          </div>

          {/* Sector dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={sector}
              onChange={e => setSector(e.target.value as Sector | 'all')}
              style={{ ...selectStyle, paddingRight: '32px', minWidth: '190px' }}
            >
              {SECTOR_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '10px',
              color: '#8e9192',
            }}>▾</span>
          </div>

          {/* Metric sort dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              style={{ ...selectStyle, paddingRight: '32px', minWidth: '190px' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '10px',
              color: '#8e9192',
            }}>▾</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            style={{
              flexShrink: 0,
              padding: '7px 16px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#e5e2e1',
              backgroundColor: 'transparent',
              border: '1px solid #444749',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, color 150ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = '#8e9192'
              el.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = '#444749'
              el.style.color = '#e5e2e1'
            }}
          >
            Export CSV
          </button>
        </div>

        {/* Result count strip */}
        <div style={{
          flexShrink: 0,
          padding: '8px 20px',
          borderBottom: '1px solid rgba(68,71,73,0.3)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#8e9192',
          }}>
            {rows.length} {rows.length === 1 ? 'company' : 'companies'}
            {sector !== 'all' ? ` · ${sectorLabel}` : ''}
            {search.trim() ? ` · "${search.trim()}"` : ''}
          </span>
        </div>

        {/* Scrollable table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr>
                {(['Company', 'Ticker', 'Sector', 'GROSS MARGIN', 'P/E Ratio'] as const).map((h, i) => (
                  <th
                    key={h}
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      padding: '10px 16px',
                      textAlign: i >= 3 ? 'right' : 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                      color: '#8e9192',
                      whiteSpace: 'nowrap',
                      backgroundColor: '#131315',
                      borderBottom: '1px solid #444749',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(card => (
                <tr
                  key={card.company.ticker}
                  onClick={() => router.push(`/companies/${card.company.ticker}`)}
                  style={{
                    borderBottom: '1px solid rgba(68,71,73,0.25)',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#1c1b1b'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'
                  }}
                >
                  {/* Company Name */}
                  <td style={{
                    padding: '11px 16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: '#e5e2e1',
                    maxWidth: '280px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {card.company.name}
                  </td>

                  {/* Ticker */}
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: '#c4c7c8',
                      letterSpacing: '0.05em',
                    }}>
                      {card.company.ticker}
                    </span>
                  </td>

                  {/* Sector */}
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#8e9192',
                    }}>
                      {card.company.sector}
                    </span>
                  </td>

                  {/* Gross Margin */}
                  <td style={{
                    padding: '11px 16px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: '#e5e2e1',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {fmtGrossMargin(card)}
                  </td>

                  {/* P/E Ratio */}
                  <td style={{
                    padding: '11px 16px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: '#e5e2e1',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {fmtPE(card)}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '64px 20px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: '#8e9192',
                    }}
                  >
                    No companies match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
