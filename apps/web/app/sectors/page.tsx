'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { SECTOR_SNAPSHOTS } from '@/lib/mockData'
import { formatPercent } from '@/lib/utils'
import { Reveal } from '@/components/effects/Reveal'

export default function SectorsPage() {
  const reduce = useReducedMotion()
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-data)', marginBottom: '12px' }}>
            Analytical frameworks
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(32px, 5vw, 46px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            Sectors
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '17px',
              color: 'var(--text-secondary)',
              marginBottom: '48px',
            }}
          >
            The analytical frameworks behind the coverage.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {SECTOR_SNAPSHOTS.map((snapshot, i) => (
            <motion.div
              key={snapshot.sector}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: Math.min(i * 0.06, 0.24) }}
              whileHover={reduce ? undefined : { y: -4, boxShadow: '0 18px 50px -18px rgba(124,58,237,0.45)', borderColor: 'rgba(124,58,237,0.45)' }}
              style={{
                backgroundColor: 'var(--bg-surface-1)',
                border: '1px solid #1f1f1f',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '24px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {snapshot.sector}
                  </h2>
                  <Link
                    href={`/companies?sector=${encodeURIComponent(snapshot.sector)}`}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'var(--accent-primary)',
                      textDecoration: 'none',
                      flexShrink: 0,
                    }}
                  >
                    View all {snapshot.sector} companies →
                  </Link>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    maxWidth: '720px',
                    marginBottom: '24px',
                  }}
                >
                  {snapshot.analyticalFramework}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                      }}
                    >
                      Key Value Drivers
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {snapshot.keyValueDrivers.map(driver => (
                        <li
                          key={driver}
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            paddingLeft: '12px',
                            position: 'relative',
                          }}
                        >
                          <span style={{ position: 'absolute', left: 0, color: 'var(--delta-pos)' }}>·</span>
                          {driver}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                      }}
                    >
                      Sector Risks
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {snapshot.sectorRisks.map(risk => (
                        <li
                          key={risk}
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            paddingLeft: '12px',
                            position: 'relative',
                          }}
                        >
                          <span style={{ position: 'absolute', left: 0, color: 'var(--delta-neg)' }}>·</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sector snapshot metrics */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-2)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    display: 'flex',
                    gap: '32px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                      Avg Gross Margin
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                      {formatPercent(snapshot.avgGrossMargin)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                      Avg ROE
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                      {formatPercent(snapshot.avgROE)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                      Avg Revenue Growth
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                      {formatPercent(snapshot.avgRevenueGrowth)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                      Companies
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                      {snapshot.companyCount}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
