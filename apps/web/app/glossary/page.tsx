'use client'

import { useState, useMemo } from 'react'
import { GLOSSARY as GLOSSARY_TERMS } from '@/lib/mockData'
import TickerBadge from '@/components/ui/TickerBadge'
import { Reveal } from '@/components/effects/Reveal'

export default function GlossaryPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const terms = q
      ? GLOSSARY_TERMS.filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
      : GLOSSARY_TERMS
    return [...terms].sort((a, b) => a.term.localeCompare(b.term))
  }, [search])

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(term)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-data)', marginBottom: '12px' }}>
            Reference
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(32px, 5vw, 46px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '24px',
            }}
          >
            Glossary
          </h1>
        </Reveal>

        <input
          type="text"
          placeholder="Search terms…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-surface-1)',
            border: 'var(--border-rest)',
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            maxWidth: '400px',
            outline: 'none',
            marginBottom: '36px',
          }}
        />

        {grouped.length === 0 && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-tertiary)' }}>
            No terms match &ldquo;{search}&rdquo;.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {grouped.map(([letter, terms]) => (
            <div key={letter}>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: 'var(--accent-primary)',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: 'var(--border-rest)',
                }}
              >
                {letter}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {terms.map(term => (
                  <div
                    key={term.term}
                    style={{
                      backgroundColor: 'var(--bg-surface-1)',
                      border: 'var(--border-rest)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                      }}
                    >
                      {term.term}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                        marginBottom: term.analystNote || (term.relatedTickers && term.relatedTickers.length > 0) ? '14px' : 0,
                      }}
                    >
                      {term.definition}
                    </p>

                    {term.analystNote && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface-2)',
                          borderRadius: '6px',
                          padding: '14px',
                          marginBottom: term.relatedTickers && term.relatedTickers.length > 0 ? '12px' : 0,
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--accent-archive)',
                            marginBottom: '6px',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Analyst Note
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.65,
                          }}
                        >
                          {term.analystNote}
                        </p>
                      </div>
                    )}

                    {term.relatedTickers && term.relatedTickers.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {term.relatedTickers.map(t => {
                          const exchange = t === 'MSFT' || t === 'NVDA' || t === 'AAPL' || t === 'GOOGL' || t === 'META' || t === 'AMZN' || t === 'ADBE' || t === 'INTC' || t === 'AMGN' ? 'NASDAQ' : 'NYSE'
                          return <TickerBadge key={t} ticker={t} exchange={exchange} />
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
