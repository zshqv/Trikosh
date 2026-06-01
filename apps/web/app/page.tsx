'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import SectorPill from '@/components/data/SectorPill'
import DataAssetCard from '@/components/ui/DataAssetCard'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Reveal, RevealGroup, RevealItem } from '@/components/effects/Reveal'
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid'
import type { Sector } from '@/lib/types'
import { MOCK_CARDS, RESEARCH_KITS } from '@/lib/mockData'

const STATS = [
  { value: 102, label: 'Companies' },
  { value: 5, label: 'Sectors' },
  { value: 15, label: 'Financial Ratios' },
]

const FEATURES = [
  {
    eyebrow: 'Frameworks',
    claim: 'Understand why margins matter before you read a 10-K',
    body: 'Ratio analysis and sector frameworks explain what the numbers mean, not just what they are. Build the mental model before you open the filing.',
  },
  {
    eyebrow: 'Peers',
    claim: 'See how peers perform before you judge a single company',
    body: 'No company operates in isolation. Compare gross margins, ROE, and growth across the full peer set to calibrate what good performance actually is.',
  },
  {
    eyebrow: 'Method',
    claim: 'Know what questions to ask, not just what numbers to find',
    body: 'Research kits and sector checklists give you the investigative frame. The data answers the questions — but you have to know which to ask first.',
  },
]

const SECTORS: Sector[] = ['Financial Services', 'AI & Technology', 'Healthcare', 'Consumer & Retail', 'Consumer Internet & Digital Platforms']

const HR: React.CSSProperties = { border: 'none', borderTop: '1px solid #1f1f1f', margin: 0 }

export default function LandingPage() {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [activeSector, setActiveSector] = useState<Sector | null>(null)
  const [search, setSearch] = useState('')

  const filteredCards = MOCK_CARDS.filter(c => {
    const matchSector = !activeSector || c.company.sector === activeSector
    const matchSearch = !search || c.company.name.toLowerCase().includes(search.toLowerCase()) || c.company.ticker.toLowerCase().includes(search.toLowerCase())
    return matchSector && matchSearch
  }).slice(0, 6)

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', overflow: 'hidden' }}>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - var(--nav-h))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px 64px',
        }}
      >
        {/* ambient violet glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(900px, 90vw)',
            height: '480px',
            background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18), transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 880 }}>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent-data)',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginBottom: '28px',
            }}
          >
            Open-source · Free forever · MIT License
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 10vw, 128px)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '0.02em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            TRIKOSH
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.12 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              fontSize: 'clamp(15px, 2vw, 19px)',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              lineHeight: 1.6,
              margin: '28px auto 0',
            }}
          >
            Standardised financial data for 100+ companies — built for equity research,
            not trading. The starting point that didn&rsquo;t exist when I tried to research my first company.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '36px' }}
          >
            <Link
              href="/companies"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'var(--accent-primary)',
                padding: '12px 24px',
                borderRadius: '8px',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                boxShadow: '0 8px 30px -8px rgba(124,58,237,0.6)',
              }}
            >
              Explore Companies
            </Link>
            <a
              href="https://github.com/zshqv/Trikosh"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                border: '1px solid #2a2a2a',
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-1)',
              }}
            >
              View on GitHub
            </a>
          </motion.div>

          {/* Stat tickers */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.28 }}
            style={{ display: 'flex', gap: 'clamp(28px, 6vw, 64px)', justifyContent: 'center', marginTop: '64px', flexWrap: 'wrap' }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                  <NumberTicker
                    value={value}
                    className="tabular-nums"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(34px, 5vw, 52px)',
                      fontWeight: 700,
                      color: '#ffffff',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 700, color: 'var(--accent-data)' }}>+</span>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <hr style={HR} />

      {/* ───────────────────── Why Trikosh — Bento ───────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '96px 24px' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-data)', marginBottom: '12px' }}>
            Why Trikosh exists
          </p>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', maxWidth: 640, lineHeight: 1.15, marginBottom: '48px' }}>
            Research infrastructure, not a data dump.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <BentoGrid className="bento">
            <BentoCard colSpan={6}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-data)', marginBottom: '14px' }}>
                {FEATURES[0].eyebrow}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '14px', maxWidth: 720 }}>
                {FEATURES[0].claim}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 620 }}>
                {FEATURES[0].body}
              </p>
            </BentoCard>

            {FEATURES.slice(1).map(f => (
              <BentoCard key={f.claim} colSpan={3}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-data)', marginBottom: '14px' }}>
                  {f.eyebrow}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '12px' }}>
                  {f.claim}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {f.body}
                </p>
              </BentoCard>
            ))}
          </BentoGrid>
        </Reveal>
      </section>

      <hr style={HR} />

      {/* ───────────────────── Company preview ───────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '96px 24px' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-data)', marginBottom: '12px' }}>
            The coverage universe
          </p>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 700, color: 'var(--text-primary)', maxWidth: 640, lineHeight: 1.2, marginBottom: '8px' }}>
            Companies chosen because they define their sectors.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Not because they are the biggest.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {SECTORS.map(sector => (
              <SectorPill
                key={sector}
                sector={sector}
                active={activeSector === sector}
                onClick={() => setActiveSector(activeSector === sector ? null : sector)}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Search companies or tickers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface-1)',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              padding: '10px 14px',
              width: '100%',
              maxWidth: '420px',
              outline: 'none',
              marginBottom: '28px',
            }}
          />
        </Reveal>

        <RevealGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredCards.map(card => (
            <RevealItem key={card.company.ticker}>
              <DataAssetCard data={card} onClick={() => router.push(`/companies/${card.company.ticker}`)} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            href="/companies"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--accent-data)',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '10px 24px',
              backgroundColor: 'var(--bg-surface-1)',
            }}
          >
            View all 100+ companies →
          </Link>
        </div>
      </section>

      <hr style={HR} />

      {/* ───────────────────── Research kits ───────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '96px 24px' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-data)', marginBottom: '12px' }}>
            Research kits
          </p>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Structured frameworks for analysing each sector.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '36px' }}>
            From scratch.
          </p>
        </Reveal>

        <RevealGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {RESEARCH_KITS.map(kit => (
            <RevealItem key={kit.id}>
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-1)',
                  border: '1px solid #1f1f1f',
                  borderRadius: '14px',
                  padding: '26px',
                  height: '100%',
                }}
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-data)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  {kit.sector}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.3 }}>
                  {kit.title}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '18px' }}>
                  {kit.description}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {kit.tickers.map(t => (
                    <span
                      key={t}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--accent-data)',
                        backgroundColor: 'rgba(124,58,237,0.12)',
                        borderRadius: '4px',
                        padding: '3px 7px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <style jsx global>{`
        @media (max-width: 760px) {
          .bento {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
