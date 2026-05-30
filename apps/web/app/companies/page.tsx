'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Sector } from '@/lib/types'
import { COMPANIES, MOCK_CARDS } from '@/lib/mockData'
import SectorPill from '@/components/data/SectorPill'
import DataAssetCard from '@/components/ui/DataAssetCard'

type SortKey = 'name' | 'sector' | 'metric'

function buildCardData(ticker: string) {
  const existing = MOCK_CARDS.find(c => c.company.ticker === ticker)
  if (existing) return existing
  const company = COMPANIES.find(c => c.ticker === ticker)!
  const sectorDefaults: Record<Sector, { primary: string; secondary: string; sparkline: number[] }> = {
    'Financial Services':                   { primary: 'ROE', secondary: 'Net Interest Margin', sparkline: [0.10, 0.11, 0.10, 0.12, 0.12, 0.11] },
    'AI & Technology':                      { primary: 'FCF Margin', secondary: 'Revenue Growth YoY', sparkline: [50e9, 60e9, 72e9, 85e9, 98e9, 112e9] },
    'Healthcare':                           { primary: 'Gross Margin', secondary: 'R&D as % Revenue', sparkline: [0.58, 0.60, 0.61, 0.62, 0.63, 0.63] },
    'Consumer & Retail':                    { primary: 'Gross Margin', secondary: 'Same-Store Sales Growth', sparkline: [0.32, 0.33, 0.34, 0.33, 0.35, 0.36] },
    'Consumer Internet & Digital Platforms':{ primary: 'Revenue Growth YoY', secondary: 'EBITDA Margin', sparkline: [0.20, 0.25, 0.30, 0.35, 0.38, 0.40] },
  }
  const def = sectorDefaults[company.sector]

  return {
    company,
    primaryMetric:   { label: def.primary,   value: 0.12,  unit: 'PCT'      as const, period: 'FY2024' },
    secondaryMetric: { label: def.secondary,  value: 0.025, unit: 'PCT'      as const, period: 'FY2024' },
    ratios: [
      { label: 'P/E', value: 16.0, unit: 'MULTIPLE' as const, period: 'FY2024' },
      { label: 'ROE', value: 0.12,  unit: 'PCT'     as const, period: 'FY2024' },
    ],
    sparkline: def.sparkline,
    source: {
      source: 'SEC 10-K' as const,
      standard: 'GAAP' as const,
      period: 'FY2024',
      updatedAt: '2025-01-14',
      currency: 'USD' as const,
    },
  }
}

export default function CompaniesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sectors, setSectors] = useState<Sector[]>([])
  const [activeSector, setActiveSector] = useState<Sector | null>(null)
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [sortKey, setSortKey] = useState<SortKey>('sector')

  useEffect(() => {
    fetch('/api/sectors')
      .then(r => r.json())
      .then(data => setSectors(data.sectors))
      .catch(() => setSectors([
        'Financial Services',
        'AI & Technology',
        'Healthcare',
        'Consumer & Retail',
        'Consumer Internet & Digital Platforms',
      ]))
  }, [])

  useEffect(() => {
    setSearch(searchParams.get('q') ?? '')
  }, [searchParams])

  const cards = useMemo(() => {
    let result = COMPANIES.map(c => buildCardData(c.ticker))
    if (activeSector) result = result.filter(c => c.company.sector === activeSector)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => c.company.name.toLowerCase().includes(q) || c.company.ticker.toLowerCase().includes(q))
    }
    if (sortKey === 'name') result.sort((a, b) => a.company.name.localeCompare(b.company.name))
    else if (sortKey === 'sector') result.sort((a, b) => a.company.sector.localeCompare(b.company.sector) || a.company.name.localeCompare(b.company.name))
    else if (sortKey === 'metric') result.sort((a, b) => b.primaryMetric.value - a.primaryMetric.value)
    return result
  }, [activeSector, search, sortKey])

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            marginBottom: '28px',
          }}
        >
          Companies
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {sectors.map(s => (
              <SectorPill
                key={s}
                sector={s}
                active={activeSector === s}
                onClick={() => setActiveSector(activeSector === s ? null : s)}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search companies or tickers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface-1)',
                border: 'var(--border-rest)',
                borderRadius: '8px',
                padding: '8px 14px',
                width: '280px',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['name', 'sector', 'metric'] as SortKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'var(--border-rest)',
                    backgroundColor: sortKey === key ? 'var(--accent-primary)' : 'var(--bg-surface-1)',
                    color: sortKey === key ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {key === 'metric' ? 'Primary Metric' : `By ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            marginBottom: '20px',
          }}
        >
          {cards.length} companies{activeSector ? ` in ${activeSector}` : ''}{search ? ` matching "${search}"` : ''}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {cards.map(card => (
            <DataAssetCard
              key={card.company.ticker}
              data={card}
              onClick={() => router.push(`/companies/${card.company.ticker}`)}
            />
          ))}
        </div>

        {cards.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-tertiary)' }}>
              No companies match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
