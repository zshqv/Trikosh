'use client'

import Link from 'next/link'
import { SECTOR_SNAPSHOTS } from '@/lib/mockData'
import { formatPercent } from '@/lib/utils'

export default function SectorsPage() {
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
            marginBottom: '8px',
          }}
        >
          Sectors
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '17px',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
          }}
        >
          The analytical frameworks behind the coverage.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {SECTOR_SNAPSHOTS.map(snapshot => (
            <div
              key={snapshot.sector}
              style={{
                backgroundColor: 'var(--bg-surface-1)',
                border: 'var(--border-rest)',
                borderRadius: '12px',
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
