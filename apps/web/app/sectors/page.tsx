'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { SECTOR_SNAPSHOTS } from '@/lib/mockData'
import { formatPercent } from '@/lib/utils'
import { Reveal } from '@/components/effects/Reveal'

const SECTOR_ICONS: Record<string, string> = {
  'Financial Services': '◈',
  'AI & Technology': '◬',
  'Healthcare': '◍',
  'Consumer & Retail': '◻',
  'Consumer Internet & Digital Platforms': '◎',
  'Industrials': '◧',
}

const SECTOR_NUMS = ['01', '02', '03', '04', '05', '06']

export default function SectorsPage() {
  const reduce = useReducedMotion()

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #444748', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 28px' }}>
          <Reveal>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10.5px',
              textTransform: 'uppercase', letterSpacing: '0.14em',
              color: '#e5e2e1', marginBottom: '10px',
            }}>
              Analytical frameworks
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                color: 'var(--text-primary)', marginBottom: 0,
              }}>
                Sectors
              </h1>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '14px',
                color: '#8e9192', marginBottom: 0, maxWidth: '420px',
              }}>
                Six sector frameworks — metrics, value drivers, and risks.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SECTOR_SNAPSHOTS.map((snapshot, i) => (
            <motion.div
              key={snapshot.sector}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: Math.min(i * 0.05, 0.2) }}
              style={{
                backgroundColor: 'var(--bg-surface-1)',
                border: '1px solid #444748',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 200ms ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#444748')}
            >
              <div style={{ padding: '24px 28px' }}>

                {/* Sector header */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      color: '#8e9192', minWidth: '22px',
                    }}>
                      {SECTOR_NUMS[i]}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '18px',
                      fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em',
                    }}>
                      {SECTOR_ICONS[snapshot.sector] ?? '○'}{' '}
                      {snapshot.sector}
                    </span>
                  </div>
                  <Link
                    href={`/sectors/${encodeURIComponent(snapshot.sector)}`}
                    style={{
                      fontFamily: 'var(--font-sans)', fontSize: '12.5px',
                      color: '#ffffff', textDecoration: 'none', flexShrink: 0,
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    Deep dive <span>→</span>
                  </Link>
                </div>

                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13.5px',
                  color: '#8e9192', lineHeight: 1.7, maxWidth: '700px', marginBottom: '24px',
                }}>
                  {snapshot.analyticalFramework}
                </p>

                {/* Drivers + Risks */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px', marginBottom: '20px',
                }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                      fontWeight: 600, color: 'var(--delta-pos)',
                      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px',
                    }}>
                      Value Drivers
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {snapshot.keyValueDrivers.map(driver => (
                        <li key={driver} style={{
                          fontFamily: 'var(--font-sans)', fontSize: '12.5px',
                          color: '#8e9192', lineHeight: 1.5,
                          paddingLeft: '14px', position: 'relative',
                        }}>
                          <span style={{ position: 'absolute', left: 0, color: 'var(--delta-pos)', fontSize: '10px' }}>+</span>
                          {driver}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                      fontWeight: 600, color: 'var(--delta-neg)',
                      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px',
                    }}>
                      Risks
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {snapshot.sectorRisks.map(risk => (
                        <li key={risk} style={{
                          fontFamily: 'var(--font-sans)', fontSize: '12.5px',
                          color: '#8e9192', lineHeight: 1.5,
                          paddingLeft: '14px', position: 'relative',
                        }}>
                          <span style={{ position: 'absolute', left: 0, color: 'var(--delta-neg)', fontSize: '10px' }}>−</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Metrics strip */}
                <div style={{
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  borderRadius: '7px',
                  border: '1px solid #383838',
                  display: 'flex', gap: '0', flexWrap: 'wrap',
                  overflow: 'hidden',
                }}>
                  {[
                    { label: 'Avg Gross Margin', value: formatPercent(snapshot.avgGrossMargin) },
                    { label: 'Avg ROE',           value: formatPercent(snapshot.avgROE) },
                    { label: 'Avg Rev Growth',    value: formatPercent(snapshot.avgRevenueGrowth) },
                    { label: 'Companies',         value: String(snapshot.companyCount) },
                  ].map((m, mi) => (
                    <div key={m.label} style={{
                      flex: '1 1 100px',
                      padding: '13px 18px',
                      borderRight: mi < 3 ? '1px solid #383838' : 'none',
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: '#8e9192', marginBottom: '5px',
                      }}>
                        {m.label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '18px',
                        fontWeight: 500, fontVariantNumeric: 'tabular-nums',
                        color: 'var(--text-primary)', margin: 0,
                        letterSpacing: '-0.01em',
                      }}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with links */}
              <div style={{
                padding: '12px 28px',
                borderTop: '1px solid #383838',
                display: 'flex', alignItems: 'center', gap: '16px',
                backgroundColor: 'rgba(0,0,0,0.15)',
              }}>
                <Link
                  href={`/companies?sector=${encodeURIComponent(snapshot.sector)}`}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px',
                    color: '#8e9192', textDecoration: 'none',
                  }}
                >
                  {snapshot.companyCount} companies →
                </Link>
                <Link
                  href={`/sectors/${encodeURIComponent(snapshot.sector)}`}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px',
                    color: '#8e9192', textDecoration: 'none',
                  }}
                >
                  Full framework →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
