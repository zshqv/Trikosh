'use client'

import { useState, useMemo } from 'react'
import { GLOSSARY as GLOSSARY_TERMS } from '@/lib/mockData'
import TickerBadge from '@/components/ui/TickerBadge'
import { Reveal } from '@/components/effects/Reveal'

/* ── Stable sequential numbers for the full sorted glossary ─────────── */
const SORTED_ALL = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term))
const TERM_NUMBERS = new Map(SORTED_ALL.map((t, i) => [t.term, i + 1]))

function fmtN(n: number) { return `#${String(n).padStart(3, '0')}` }

/* ── Alphabet ────────────────────────────────────────────────────────── */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/* ── Page ────────────────────────────────────────────────────────────── */
export default function GlossaryPage() {
  const [search, setSearch]           = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  /* ── existing search + grouping logic (unchanged) ─────────────────── */
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
  /* ─────────────────────────────────────────────────────────────────── */

  const availableLetters = useMemo(() => new Set(grouped.map(([l]) => l)), [grouped])

  const visibleGroups = useMemo(
    () => activeLetter ? grouped.filter(([l]) => l === activeLetter) : grouped,
    [grouped, activeLetter]
  )

  return (
    <>
      <style>{`
        .glossary-search::placeholder { color: #8e9193; }
      `}</style>

        {/* Hero / header */}
        <div style={{ borderBottom: '1px solid #444749', backgroundColor: '#131315' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 0' }}>
            <Reveal>
              {/* Archive / Glossary label */}
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#8e9193',
                marginBottom: '12px',
              }}>
                Archive / Glossary
              </p>

              {/* Heading + term count */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4.5vw, 42px)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#e5e1e4',
                  marginBottom: 0,
                }}>
                  Financial Dictionary
                </h1>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#c4c7c9',
                  backgroundColor: '#1c1b1d',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  marginBottom: 4,
                }}>
                  {filtered.length} terms
                </span>
              </div>

              {/* Subtitle */}
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: '#c4c7c9',
                lineHeight: 1.65,
                maxWidth: '580px',
                margin: '0 0 20px',
              }}>
                Definitions, analyst notes, and sector context for the metrics and ratios used in equity research.
              </p>

              {/* Search — underline style */}
              <div style={{ position: 'relative', maxWidth: '480px' }}>
                <input
                  type="text"
                  placeholder="Search terms or definitions…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="glossary-search"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: '#e5e1e4',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #444749',
                    padding: '10px 32px 10px 0',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 150ms',
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = '#ffffff')}
                  onBlur={e => (e.target.style.borderBottomColor = '#444749')}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#8e9193',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      padding: '2px 4px',
                    }}
                  >×</button>
                )}
              </div>
            </Reveal>

            {/* Alphabet filter row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: '20px',
              borderTop: '1px solid #444749',
              paddingTop: '4px',
              paddingBottom: '0',
            }}>
              {ALPHABET.map(letter => {
                const hasTerms = availableLetters.has(letter)
                const isActive  = activeLetter === letter
                return (
                  <button
                    key={letter}
                    disabled={!hasTerms}
                    onClick={() => setActiveLetter(isActive ? null : letter)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      padding: '6px 8px',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
                      color: isActive ? '#ffffff' : hasTerms ? '#8e9193' : '#2a2a2c',
                      cursor: hasTerms ? 'pointer' : 'default',
                      transition: 'color 150ms ease, border-color 150ms ease',
                    }}
                    onMouseEnter={e => {
                      if (hasTerms && !isActive)
                        (e.currentTarget as HTMLButtonElement).style.color = '#e5e1e4'
                    }}
                    onMouseLeave={e => {
                      if (hasTerms && !isActive)
                        (e.currentTarget as HTMLButtonElement).style.color = '#8e9193'
                    }}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Cards content area */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 80px' }}>

          {visibleGroups.length === 0 && (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px solid #444749',
              borderRadius: '10px',
              backgroundColor: '#1c1b1d',
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#8e9193',
              }}>
                No terms match &ldquo;{search}&rdquo;
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {visibleGroups.map(([letter, terms]) => (
              <div key={letter}>

                {/* Letter section header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #444749',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#8e9193',
                    letterSpacing: '-0.01em',
                  }}>
                    {letter}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#c4c7c9',
                    backgroundColor: '#1c1b1d',
                    padding: '2px 8px',
                    borderRadius: '3px',
                  }}>
                    {terms.length} {terms.length === 1 ? 'term' : 'terms'}
                  </span>
                </div>

                {/* 3-column card grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {terms.map(term => {
                    const n = TERM_NUMBERS.get(term.term) ?? 0
                    return (
                      <div
                        key={term.term}
                        style={{
                          border: '1px solid #444749',
                          borderRadius: '9px',
                          padding: '18px 20px',
                          backgroundColor: '#131315',
                          transition: 'background-color 200ms ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#1c1b1d'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#131315'}
                      >
                        {/* Top row: category badge + term number */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: '#e5e1e4',
                            border: '1px solid #444749',
                            borderRadius: '3px',
                            padding: '2px 8px',
                          }}>
                            {letter}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: '#8e9193',
                            letterSpacing: '0.04em',
                          }}>
                            {fmtN(n)}
                          </span>
                        </div>

                        {/* Term name */}
                        <p style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '17px',
                          fontWeight: 700,
                          color: '#e5e1e4',
                          lineHeight: 1.2,
                          margin: 0,
                        }}>
                          {term.term}
                        </p>

                        {/* Definition */}
                        <p style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          color: '#c4c7c9',
                          lineHeight: 1.65,
                          margin: 0,
                        }}>
                          {term.definition}
                        </p>

                        {/* Analyst note */}
                        {term.analystNote && (
                          <div style={{
                            backgroundColor: '#1c1b1d',
                            border: '1px solid #444749',
                            borderRadius: '6px',
                            padding: '12px 14px',
                          }}>
                            <p style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '9px',
                              color: '#8e9193',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '6px',
                              margin: '0 0 6px',
                            }}>
                              Analyst Note
                            </p>
                            <p style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: '12px',
                              color: '#c4c7c9',
                              lineHeight: 1.65,
                              margin: 0,
                            }}>
                              {term.analystNote}
                            </p>
                          </div>
                        )}

                        {/* Related tickers */}
                        {term.relatedTickers && term.relatedTickers.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {term.relatedTickers.map(t => {
                              const exchange = ['MSFT','NVDA','AAPL','GOOGL','META','AMZN','ADBE','INTC','AMGN'].includes(t) ? 'NASDAQ' : 'NYSE'
                              return <TickerBadge key={t} ticker={t} exchange={exchange} />
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

              </div>
            ))}
          </div>
        </div>
    </>
  )
}
