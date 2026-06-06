'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Starfield from '@/components/ui/starfield-1'
import { NumberTicker } from '@/components/ui/number-ticker'

/* ── Data ─────────────────────────────────────────────────────────── */

const STATS = [
  { value: 120, label: 'Companies',    startValue: 102 },
  { value: 6,   label: 'Sectors',      startValue: 0  },
  { value: 15,  label: 'Ratios tracked', startValue: 0 },
]

const JPM_REVENUE = [
  { year: 'FY20', value: 119.5 },
  { year: 'FY21', value: 121.6 },
  { year: 'FY22', value: 128.7 },
  { year: 'FY23', value: 154.3 },
  { year: 'FY24', value: 170.1 },
]

const JPM_RATIOS = [
  { label: 'ROE',  value: '16.2%' },
  { label: 'NIM',  value: '2.8%'  },
  { label: 'CET1', value: '15.3%' },
]

const SECTORS_COVERED = [
  { name: 'Financial Services',                       count: 21, n: '01' },
  { name: 'AI & Technology',                          count: 20, n: '02' },
  { name: 'Healthcare & Pharmaceuticals',             count: 20, n: '03' },
  { name: 'Consumer & Retail',                        count: 20, n: '04' },
  { name: 'Consumer Internet & Digital Platforms',    count: 19, n: '05' },
  { name: 'Industrials',                              count: 20, n: '06' },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick a company or sector',
    desc: 'Browse the full directory by sector or search for any company or ticker symbol.',
  },
  {
    n: '02',
    title: 'Read five years of standardised financials',
    desc: 'Income statement, balance sheet, and cash flow — pulled from public filings and laid out identically across every company.',
  },
  {
    n: '03',
    title: 'Compare across 15 ratios',
    desc: 'The comparison tool lets you put any two to four companies side by side on the metrics that matter for their sector.',
  },
]

const BENTO_SECTORS = [
  {
    n: '01',
    name: 'Financial Services',
    count: 21,
    description: 'Banks, asset managers, insurance, exchanges',
    metrics: 'ROE · NIM · CET1 Ratio',
    href: '/sectors',
    span: 1,
  },
  {
    n: '02',
    name: 'AI & Technology',
    count: 20,
    description: 'Hyperscalers, semiconductors, enterprise software',
    metrics: 'Rev Growth · P/S · R&D%',
    href: '/sectors',
    span: 2,
  },
  {
    n: '03',
    name: 'Healthcare & Pharmaceuticals',
    count: 20,
    description: 'Pharma, biotech, MedTech, diagnostics',
    metrics: 'Pipeline · EV/EBITDA · FCF/Rev',
    href: '/sectors',
    span: 2,
  },
  {
    n: '04',
    name: 'Consumer & Retail',
    count: 20,
    description: 'Consumer staples, discretionary, e-commerce',
    metrics: 'SSS · Gross Margin · Inventory',
    href: '/sectors',
    span: 1,
  },
  {
    n: '05',
    name: 'Consumer Internet & Digital Platforms',
    count: 19,
    description: 'Social, marketplaces, streaming, gaming — companies monetised through attention or transactions',
    metrics: 'MAU · ARPU · CAC/LTV',
    href: '/sectors',
    span: 2,
  },
  {
    n: '06',
    name: 'Industrials',
    count: 20,
    description: 'Aerospace & defence, industrial automation, power management, engineering conglomerates',
    metrics: 'Order Backlog · ROIC · FCF Conv.',
    href: '/sectors',
    span: 1,
  },
]

/* ── Editorial divider with mouse-proximity glow ─────────────────── */

function EditorialDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const [intensity, setIntensity] = useState(0)
  const [cursorX, setCursorX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const dist = Math.abs(e.clientY - rect.top)
      setIntensity(Math.max(0, 1 - dist / 100))
      setCursorX(e.clientX)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', height: '1px' }}>
      <div className="editorial-line" style={{ position: 'absolute', inset: 0 }} />
      {intensity > 0.01 && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            left: cursorX,
            transform: 'translate(-50%, -50%)',
            width: `${240 * intensity}px`,
            height: `${24 * intensity}px`,
            background: `radial-gradient(ellipse, rgba(255,255,255,${0.14 * intensity}), transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(72px, 11vw, 120px) 0 clamp(64px, 9vw, 104px)',
      }}>
        {/* starfield — hero only */}
        <Starfield
          starColor="rgba(255,255,255,0.6)"
          bgColor="rgba(0,0,0,0)"
          speed={0.5}
          quantity={280}
          opacity={0.14}
        />

        {/* dot grid */}
        <div
          className="dot-grid"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          {/* Eyebrow */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#e5e2e1',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(68,71,72,0.6)',
              padding: '5px 11px',
              borderRadius: '4px',
            }}>
              <span style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'inline-block',
                flexShrink: 0,
              }} />
              120 Companies · 6 Sectors · Open Research
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.07,
            letterSpacing: '-0.02em',
            maxWidth: 840,
            margin: '0 0 24px',
          }}>
            Five years of financial data on 120 companies,{' '}
            <span style={{ color: '#8e9192' }}>structured so you can actually learn from it.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: '#8e9192',
            lineHeight: 1.7,
            maxWidth: 540,
            margin: '0 0 44px',
          }}>
            Trikosh pulls income statements, balance sheets, and cash flows from public filings.
            You get the numbers — organised, comparable, and free.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <Link
              href="/companies"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: '11px 22px',
                borderRadius: '5px',
                textDecoration: 'none',
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              Browse directory
              <span style={{ fontSize: '12px', opacity: 0.65 }}>→</span>
            </Link>
            <Link
              href="/research"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#c4c7c8',
                border: '1px solid #444748',
                padding: '11px 22px',
                borderRadius: '5px',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                transition: 'border-color 150ms ease, color 150ms ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#8e9192'
                el.style.color = '#e5e2e1'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#444748'
                el.style.color = '#c4c7c8'
              }}
            >
              Research framework
            </Link>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'flex',
            width: 'fit-content',
            border: '1px solid #444748',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            {STATS.map(({ value, label, startValue }, i) => (
              <div
                key={label}
                style={{
                  padding: '18px 36px 16px',
                  borderRight: i < STATS.length - 1 ? '1px solid #444748' : 'none',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  minWidth: '112px',
                }}
              >
                <NumberTicker
                  value={value}
                  startValue={startValue}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(28px, 4.5vw, 44px)',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1,
                    display: 'block',
                    letterSpacing: '-0.03em',
                  }}
                />
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.11em',
                  color: '#8e9192',
                  marginTop: '8px',
                  marginBottom: 0,
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* ── What's in it ──────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#e5e2e1',
            marginBottom: '36px',
          }}>
            What&apos;s actually in it
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* JPMorgan Chase company card */}
            <div style={{
              border: '1px solid #444748',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#1c1b1b',
            }}>
              {/* Card header */}
              <div style={{
                padding: '18px 20px 14px',
                borderBottom: '1px solid #444748',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#e5e2e1',
                    margin: '0 0 4px',
                  }}>
                    JPMorgan Chase &amp; Co.
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', color: '#8e9192', margin: 0 }}>
                    Financial Services
                  </p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#8e9192',
                  border: '1px solid #444748',
                  padding: '3px 7px',
                  borderRadius: '3px',
                  flexShrink: 0,
                }}>
                  JPM
                </span>
              </div>

              {/* Revenue sparkline */}
              <div style={{ padding: '20px 20px 4px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#8e9192',
                  margin: '0 0 12px',
                }}>
                  Revenue (USD bn) — 5-year
                </p>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={JPM_REVENUE} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barCategoryGap="28%">
                    <XAxis
                      dataKey="year"
                      tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#8e9192' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[100, 180]}
                      tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#8e9192' }}
                      axisLine={false}
                      tickLine={false}
                      tickCount={3}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      contentStyle={{
                        backgroundColor: '#201f1f',
                        border: '1px solid #444748',
                        borderRadius: '6px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                        color: '#e5e2e1',
                      }}
                      formatter={(v) => (typeof v === 'number' ? [`$${v}B`, 'Revenue'] : ['—', 'Revenue'])}
                    />
                    <Bar dataKey="value" fill="#e5e2e1" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ratio chips */}
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 20px 20px',
              }}>
                {JPM_RATIOS.map(r => (
                  <div
                    key={r.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid #444748',
                      borderRadius: '6px',
                      padding: '8px 14px',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#8e9192',
                    }}>
                      {r.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#e5e2e1',
                      letterSpacing: '-0.01em',
                    }}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer link */}
              <div style={{
                padding: '10px 20px',
                borderTop: '1px solid rgba(68,71,72,0.35)',
              }}>
                <Link
                  href="/companies/JPM"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#8e9192',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#e5e2e1' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#8e9192' }}
                >
                  View full profile →
                </Link>
              </div>
            </div>

            {/* Coverage by sector */}
            <div style={{
              border: '1px solid #444748',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: 'var(--surface-container-low)',
            }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #444748' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', fontWeight: 600, color: '#e5e2e1', margin: '0 0 4px' }}>
                  Coverage by sector
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', color: '#8e9192', margin: 0 }}>
                  120 companies across 6 analytical frameworks
                </p>
              </div>

              <div style={{ padding: '4px 0' }}>
                {SECTORS_COVERED.map((s, i) => (
                  <div
                    key={s.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '13px 20px',
                      borderBottom: i < SECTORS_COVERED.length - 1 ? '1px solid rgba(68,71,72,0.3)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'rgba(68,71,72,0.8)',
                        minWidth: '20px',
                      }}>
                        {s.n}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: '#c4c7c8' }}>
                        {s.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#e5e2e1',
                      letterSpacing: '-0.01em',
                    }}>
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>

              <p style={{
                margin: 0,
                padding: '10px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#8e9192',
                borderTop: '1px solid rgba(68,71,72,0.35)',
                lineHeight: 1.55,
              }}>
                Data sourced from public filings via Yahoo Finance. Updated annually.
              </p>
            </div>
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* ── How it works ──────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#e5e2e1',
            marginBottom: '52px',
          }}>
            How it works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                style={{
                  padding: `0 ${i < STEPS.length - 1 ? '32px' : '0'} 0 0`,
                  borderRight: i < STEPS.length - 1 ? '1px solid #2a2a2a' : 'none',
                  marginRight: i < STEPS.length - 1 ? '32px' : '0',
                  paddingBottom: '0',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.1)',
                  margin: '0 0 20px',
                  letterSpacing: '-0.02em',
                }}>
                  {step.n}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#e5e2e1',
                  margin: '0 0 10px',
                  lineHeight: 1.35,
                }}>
                  {step.title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13.5px',
                  color: '#8e9192',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* ── Sector bento grid ─────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#e5e2e1',
              margin: 0,
            }}>
              Sectors covered
            </p>
            <Link
              href="/sectors"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#8e9192',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#c4c7c8' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#8e9192' }}
            >
              Explore all →
            </Link>
          </div>

          {/* Bento grid — 3 cols on md+, stacked on mobile */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              gap: '1px',
              backgroundColor: '#444748',
              border: '1px solid #444748',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {BENTO_SECTORS.map(sector => (
              <Link
                key={sector.n}
                href={sector.href}
                className={`col-span-1 md:col-span-${sector.span}`}
                style={{
                  display: 'block',
                  padding: sector.span === 3 ? '28px 32px' : '28px',
                  backgroundColor: 'var(--surface-container-low)',
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--surface-container)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--surface-container-low)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgba(68,71,72,0.9)',
                    letterSpacing: '0.04em',
                  }}>
                    {sector.n}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#8e9192',
                    letterSpacing: '0.04em',
                  }}>
                    {sector.count} co.
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: sector.span === 3 ? '22px' : '18px',
                  fontWeight: 700,
                  color: '#e5e2e1',
                  margin: '0 0 8px',
                  lineHeight: 1.2,
                }}>
                  {sector.name}
                </h3>

                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12.5px',
                  color: '#8e9192',
                  lineHeight: 1.55,
                  margin: '0 0 20px',
                  maxWidth: sector.span === 3 ? '560px' : undefined,
                }}>
                  {sector.description}
                </p>

                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: '#8e9192',
                  letterSpacing: '0.06em',
                  borderTop: '1px solid rgba(68,71,72,0.4)',
                  paddingTop: '14px',
                  display: 'block',
                }}>
                  {sector.metrics}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(80px, 11vw, 128px) 0',
        backgroundColor: 'var(--surface-container-lowest)',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
          }}>
            Five years of filings,{' '}
            <span style={{ color: '#8e9192' }}>zero cost of entry.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            color: '#8e9192',
            lineHeight: 1.75,
            margin: '0 0 40px',
          }}>
            Start with Goldman Sachs or browse all 120 companies across six sectors.
            Everything is structured, labelled, and free.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/companies"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#000000',
                backgroundColor: '#ffffff',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              Browse all companies →
            </Link>
            <Link
              href="/compare"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#c4c7c8',
                border: '1px solid #444748',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                transition: 'border-color 150ms ease, color 150ms ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#8e9192'
                el.style.color = '#e5e2e1'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#444748'
                el.style.color = '#c4c7c8'
              }}
            >
              Compare companies
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
