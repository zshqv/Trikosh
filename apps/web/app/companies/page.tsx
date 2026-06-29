'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { COMPANIES, MOCK_CARDS } from '@/lib/mockData'
import type { Sector, CardData } from '@/lib/types'

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

/**
 * @deprecated Populate via the yfinance ETL pipeline (infrastructure/scripts/yfinance_etl.py)
 * then read from /api/companies. This function should only be called for companies
 * that already have a real entry in MOCK_CARDS. No placeholder financial values are
 * generated for companies without real data — the UI shows "—" instead.
 */
function buildCardData(ticker: string): CardData {
  const existing = MOCK_CARDS.find(c => c.company.ticker === ticker)
  if (existing) return existing
  const company = COMPANIES.find(c => c.ticker === ticker)!
  // Return company directory info only — no fake financial values pending DB connection
  return {
    company,
    primaryMetric:   { label: 'Data Pending', value: 0, unit: 'PCT' as const, period: '—' },
    secondaryMetric: undefined,
    ratios:          [],
    sparkline:       [],
    source: { source: 'SEC 10-K' as const, standard: 'GAAP' as const, period: '—', updatedAt: '—', currency: 'USD' as const },
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

function fmtROE(card: CardData): string {
  const roe = card.ratios.find(r => r.label === 'ROE')
  if (roe) return (roe.value * 100).toFixed(1) + '%'
  if (card.primaryMetric.label === 'ROE') return (card.primaryMetric.value * 100).toFixed(1) + '%'
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
  const router = useRouter()
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-h))', overflow: 'hidden', backgroundColor: 'var(--background)' }}>

        {/* Filter bar */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px',
          borderBottom: '1px solid var(--outline-variant)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--background)',
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
                      backgroundColor: 'var(--background)',
                      borderBottom: '1px solid var(--outline-variant)',
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
                    transition: 'background-color 150ms ease, box-shadow 150ms ease',
                  }}
                  onMouseEnter={e => {
                    const row = e.currentTarget as HTMLTableRowElement
                    row.style.backgroundColor = 'var(--surface-container-low)'
                    row.style.boxShadow = 'inset 3px 0 0 var(--primary)'
                  }}
                  onMouseLeave={e => {
                    const row = e.currentTarget as HTMLTableRowElement
                    row.style.backgroundColor = 'transparent'
                    row.style.boxShadow = 'none'
                  }}
                >
                  {/* Company Name */}
                  <td style={{
                    padding: '11px 16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
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
                      color: 'var(--text-secondary)',
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
                      color: 'var(--text-tertiary)',
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
                    color: 'var(--text-primary)',
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
                    color: 'var(--text-primary)',
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
  )
}
