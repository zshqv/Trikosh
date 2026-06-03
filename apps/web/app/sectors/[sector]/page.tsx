'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { SECTOR_SNAPSHOTS } from '@/lib/mockData'
import { COMPANIES } from '@/lib/mockData'
import { formatPercent } from '@/lib/utils'
import type { Sector } from '@/lib/types'

export default function SectorDetailPage() {
  const { sector: rawSector } = useParams<{ sector: string }>()
  const sector = decodeURIComponent(rawSector) as Sector

  const snapshot = useMemo(
    () => SECTOR_SNAPSHOTS.find(s => s.sector === sector) ?? null,
    [sector]
  )

  const sectorCompanies = useMemo(
    () => COMPANIES.filter(c => c.sector === sector),
    [sector]
  )

  if (!snapshot) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8e9192', marginBottom: '16px' }}>
          Sector not found: {sector}
        </p>
        <Link href="/sectors" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '13px' }}>
          ← All Sectors
        </Link>
      </div>
    )
  }

  const metrics = [
    { label: 'Avg Gross Margin', value: formatPercent(snapshot.avgGrossMargin) },
    { label: 'Avg ROE',           value: formatPercent(snapshot.avgROE) },
    { label: 'Avg Revenue Growth', value: formatPercent(snapshot.avgRevenueGrowth) },
    { label: 'Companies',         value: String(snapshot.companyCount) },
  ]

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #444748', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 28px' }}>
          <Link
            href="/sectors"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: '#8e9192', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              marginBottom: '20px',
            }}
          >
            ← Sectors
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10.5px',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: '#8e9192', marginBottom: '10px',
              }}>
                Sector Analysis · {sectorCompanies.length} companies
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em',
                color: 'var(--text-primary)', marginBottom: 0,
              }}>
                {snapshot.sector}
              </h1>
            </div>
            <Link
              href={`/companies?sector=${encodeURIComponent(sector)}`}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '12.5px',
                color: '#ffffff', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px', padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                flexShrink: 0, alignSelf: 'flex-end',
              }}
            >
              Browse companies →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Analytical framework */}
        <div style={{
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid #444748',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '20px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9.5px',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: '#8e9192', marginBottom: '12px',
          }}>
            Analytical Framework
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            color: '#8e9192', lineHeight: 1.75, maxWidth: '800px',
            marginBottom: '24px',
          }}>
            {snapshot.analyticalFramework}
          </p>

          {/* Metrics row */}
          <div style={{
            display: 'flex', gap: '0', flexWrap: 'wrap',
            border: '1px solid #383838', borderRadius: '7px', overflow: 'hidden',
          }}>
            {metrics.map((m, mi) => (
              <div key={m.label} style={{
                flex: '1 1 100px', padding: '14px 20px',
                borderRight: mi < metrics.length - 1 ? '1px solid #383838' : 'none',
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: '#8e9192', marginBottom: '6px',
                }}>
                  {m.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '20px',
                  fontWeight: 500, fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em',
                }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Drivers + Risks */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px', marginBottom: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-1)',
            border: '1px solid rgba(52,211,153,0.1)',
            borderRadius: '10px', padding: '22px',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '9.5px',
              fontWeight: 600, color: 'var(--delta-pos)',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px',
            }}>
              Key Value Drivers
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {snapshot.keyValueDrivers.map(driver => (
                <li key={driver} style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13.5px',
                  color: '#8e9192', lineHeight: 1.5,
                  paddingLeft: '16px', position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--delta-pos)', fontWeight: 700, fontSize: '11px' }}>+</span>
                  {driver}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface-1)',
            border: '1px solid rgba(248,113,113,0.1)',
            borderRadius: '10px', padding: '22px',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '9.5px',
              fontWeight: 600, color: 'var(--delta-neg)',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px',
            }}>
              Sector Risks
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {snapshot.sectorRisks.map(risk => (
                <li key={risk} style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13.5px',
                  color: '#8e9192', lineHeight: 1.5,
                  paddingLeft: '16px', position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--delta-neg)', fontWeight: 700, fontSize: '11px' }}>−</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Companies table */}
        <div style={{
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid #444748',
          borderRadius: '10px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 24px 16px',
            borderBottom: '1px solid #444748',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-sans)', fontSize: '15px',
                fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px',
              }}>
                Companies in this sector
              </h2>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: '#8e9192', margin: 0,
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                {sectorCompanies.length} companies · click to view financials
              </p>
            </div>
            <Link
              href={`/companies?sector=${encodeURIComponent(sector)}`}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '12px',
                color: '#ffffff', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              View all →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #383838', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  {['Ticker', 'Company', 'Industry', 'Exchange', ''].map((h, hi) => (
                    <th key={hi} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9.5px',
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em',
                      color: '#8e9192', padding: '10px 20px',
                      textAlign: hi === 4 ? 'right' : 'left',
                      minWidth: hi === 0 ? '80px' : hi === 4 ? '80px' : undefined,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectorCompanies.map((co, i) => (
                  <tr
                    key={co.ticker}
                    style={{
                      borderBottom: i < sectorCompanies.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '11px 20px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                        color: 'var(--accent-primary)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2px 8px', borderRadius: '3px',
                      }}>
                        {co.ticker}
                      </span>
                    </td>
                    <td style={{ padding: '11px 20px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        {co.name}
                      </span>
                    </td>
                    <td style={{ padding: '11px 20px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: '#8e9192' }}>
                        {co.industry}
                      </span>
                    </td>
                    <td style={{ padding: '11px 20px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10.5px',
                        color: '#8e9192', backgroundColor: 'var(--bg-muted)',
                        padding: '2px 6px', borderRadius: '3px',
                      }}>
                        {co.exchange}
                      </span>
                    </td>
                    <td style={{ padding: '11px 20px', textAlign: 'right' }}>
                      <Link
                        href={`/companies/${co.ticker}`}
                        style={{
                          fontFamily: 'var(--font-sans)', fontSize: '11.5px',
                          color: '#8e9192', textDecoration: 'none',
                          border: '1px solid #444748', borderRadius: '4px',
                          padding: '4px 10px', transition: 'all 150ms ease',
                          display: 'inline-block',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'
                          ;(e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#444748'
                          ;(e.currentTarget as HTMLAnchorElement).style.color = '#8e9192'
                        }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
