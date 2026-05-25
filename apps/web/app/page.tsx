'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectorPill from '@/components/data/SectorPill'
import DataAssetCard from '@/components/ui/DataAssetCard'
import type { Sector } from '@/lib/types'
import { MOCK_CARDS, RESEARCH_KITS } from '@/lib/mockData'

const STATS = [
  { value: '50', label: 'Companies' },
  { value: '5', label: 'Sectors' },
  { value: '5 Years', label: 'Of Data' },
  { value: 'MIT', label: 'License' },
]

const FEATURES = [
  {
    claim: 'Understand why margins matter before you read a 10-K',
    body: 'Ratio analysis and sector frameworks explain what the numbers mean, not just what they are. Build the mental model before you open the filing.',
  },
  {
    claim: 'See how peers perform before you judge a single company',
    body: 'No company operates in isolation. Compare gross margins, ROE, and growth across the full peer set to calibrate what is actually good performance.',
  },
  {
    claim: 'Know what questions to ask, not just what numbers to find',
    body: 'Research kits and sector checklists give you the investigative frame. The data answers the questions — but you have to know which questions to ask first.',
  },
]

const SECTORS: Sector[] = ['Financial Services', 'AI & Technology', 'Healthcare']

export default function LandingPage() {
  const [activeSector, setActiveSector] = useState<Sector | null>(null)
  const [search, setSearch] = useState('')

  const filteredCards = MOCK_CARDS.filter(c => {
    const matchSector = !activeSector || c.company.sector === activeSector
    const matchSearch = !search || c.company.name.toLowerCase().includes(search.toLowerCase()) || c.company.ticker.toLowerCase().includes(search.toLowerCase())
    return matchSector && matchSearch
  }).slice(0, 6)

  return (
    <div style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* ── Hero ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 64px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '24px',
          }}
        >
          Open-source · Free forever · MIT License
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '48px',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            maxWidth: '640px',
            marginBottom: '20px',
          }}
        >
          Open financial research infrastructure for serious students.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '17px',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.6,
            marginBottom: '36px',
          }}
        >
          Built after struggling to research Sony with fragmented data and no starting point.
          Trikosh gives students standardised financial data for 50 companies — built for
          equity research, not trading.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/companies"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
              backgroundColor: 'var(--accent-primary)',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'opacity 150ms ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Explore Companies →
          </Link>
          <a
            href="https://github.com/ashutoshatri/trikosh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              border: 'var(--border-rest)',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              backgroundColor: 'var(--bg-surface-1)',
              transition: 'border 150ms ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section
        style={{
          borderTop: 'var(--border-rest)',
          borderBottom: 'var(--border-rest)',
          backgroundColor: 'var(--bg-surface-1)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '20px 24px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            50 companies chosen because they define their sectors — not because they are the biggest.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface-2)',
                  border: 'var(--border-rest)',
                  borderRadius: '6px',
                  padding: '8px 14px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--accent-primary)',
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '20px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '32px',
          }}
        >
          Why Trikosh exists
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {FEATURES.map(({ claim, body }) => (
            <div
              key={claim}
              style={{
                backgroundColor: 'var(--bg-surface-1)',
                border: 'var(--border-rest)',
                borderRadius: '12px',
                padding: '28px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  lineHeight: 1.4,
                }}
              >
                {claim}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sector pills + search (transition hinge) ── */}
      <section
        style={{
          borderTop: 'var(--border-rest)',
          backgroundColor: 'var(--bg-surface-1)',
          padding: '32px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <SectorPill
              sector="Financial Services"
              active={activeSector === 'Financial Services'}
              onClick={() => setActiveSector(activeSector === 'Financial Services' ? null : 'Financial Services')}
            />
            <SectorPill
              sector="AI & Technology"
              active={activeSector === 'AI & Technology'}
              onClick={() => setActiveSector(activeSector === 'AI & Technology' ? null : 'AI & Technology')}
            />
            <SectorPill
              sector="Healthcare"
              active={activeSector === 'Healthcare'}
              onClick={() => setActiveSector(activeSector === 'Healthcare' ? null : 'Healthcare')}
            />
          </div>
          <input
            type="text"
            placeholder="Search companies or tickers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface-2)',
              border: 'var(--border-rest)',
              borderRadius: '8px',
              padding: '10px 14px',
              width: '100%',
              maxWidth: '420px',
              outline: 'none',
            }}
          />
        </div>
      </section>

      {/* ── Data cards ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredCards.map(card => (
            <DataAssetCard key={card.company.ticker} data={card} />
          ))}
        </div>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            href="/companies"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              border: 'var(--border-rest)',
              borderRadius: '6px',
              padding: '8px 20px',
              backgroundColor: 'var(--bg-surface-1)',
            }}
          >
            View all 50 companies →
          </Link>
        </div>
      </section>

      {/* ── Research Kit preview ── */}
      <section
        style={{
          borderTop: 'var(--border-rest)',
          backgroundColor: 'var(--bg-surface-1)',
          padding: '64px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Research Kits
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '28px',
            }}
          >
            Structured frameworks for analysing each sector, from scratch.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {RESEARCH_KITS.map(kit => (
              <div
                key={kit.id}
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: 'var(--border-rest)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--accent-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                  }}
                >
                  {kit.sector}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {kit.title}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                  }}
                >
                  {kit.description}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {kit.tickers.map(t => (
                    <span
                      key={t}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--accent-primary)',
                        backgroundColor: 'rgba(37,99,235,0.08)',
                        borderRadius: '3px',
                        padding: '2px 6px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
