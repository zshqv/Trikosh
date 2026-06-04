'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <>

        {/* ── Section 1: Hero ─────────────────────────────────────────── */}
        <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(56px, 8vw, 96px) 0 clamp(48px, 7vw, 80px)' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#8e9192',
              marginBottom: '20px',
            }}>
              Origin Story
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              color: '#e5e2e1',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '24px',
              maxWidth: '680px',
            }}>
              Honestly, it started with a rejection.
            </h1>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: '#c4c7c8',
              lineHeight: 1.75,
              maxWidth: '672px',
              margin: 0,
            }}>
              Earlier this year I interviewed at Third Bridge — a financial research firm. Didn&apos;t get the job. But going through the process made me look closely at what they actually do: structured, institutional-grade financial intelligence, built for professionals who know exactly where to look and what to ask. Students don&apos;t have that. I didn&apos;t have that.
            </p>
          </div>
        </section>

        {/* ── Section 2: The Problem ──────────────────────────────────── */}
        <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: '#c4c7c8',
              lineHeight: 1.75,
              maxWidth: '672px',
              margin: 0,
            }}>
              When I tried writing my own equity research report I had no idea where to start. The data was everywhere but unusable — scattered across PDFs, locked behind paywalls, inconsistent formats, no framework. I could&apos;ve buried myself in tutorials for weeks. Or I could&apos;ve just asked an AI to write it for me. I didn&apos;t want either of those things. An AI-generated report I don&apos;t understand is worthless. And I shouldn&apos;t need a Bloomberg terminal subscription to learn how to read a balance sheet.
            </p>
          </div>
        </section>

        {/* ── Section 3: What Trikosh Is ──────────────────────────────── */}
        <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              color: '#e5e2e1',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}>
              So I built Trikosh.
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: '#c4c7c8',
              lineHeight: 1.75,
              maxWidth: '672px',
              marginBottom: '48px',
            }}>
              Not to replace thinking — to make thinking possible. A free, open-source library of standardised financial data across 100+ companies spanning different sectors, with a published methodology so you know exactly how every number was calculated. No paywalls. No AI doing the work for you. Just the blueprint — the thinking is yours.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Open Infrastructure',
                  body:  'Financial data should be a public good, not a competitive advantage for institutions with Bloomberg terminals.',
                },
                {
                  title: 'Standardised, Not Summarised',
                  body:  'We give you the numbers and the framework. You build the understanding. No pre-digested answers.',
                },
                {
                  title: 'Built for Students',
                  body:  'Finance students, CFA candidates, and aspiring analysts who deserve the same data quality as the institutions they want to work for.',
                },
              ].map(card => (
                <div
                  key={card.title}
                  style={{
                    border: '1px solid #444748',
                    backgroundColor: '#1c1b1b',
                    borderRadius: '10px',
                    padding: '32px',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#e5e2e1',
                    lineHeight: 1.25,
                    marginBottom: '12px',
                  }}>
                    {card.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: '#c4c7c8',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: The Name ─────────────────────────────────────── */}
        <section style={{ borderBottom: '1px solid #444748', padding: 'clamp(48px, 7vw, 80px) 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              color: '#e5e2e1',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}>
              The Name
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: '#c4c7c8',
              lineHeight: 1.75,
              maxWidth: '672px',
              margin: 0,
            }}>
              Trikosh comes from Sanskrit. Tri maps to three — the three financial statements, and to Tripathi. Kosha means a structured treasury of knowledge. The name is rooted in the Pancha Kosha philosophy — five layers of understanding, each deeper than the last.
            </p>
          </div>
        </section>

        {/* ── Section 5: Open Source ──────────────────────────────────── */}
        <section style={{ padding: 'clamp(48px, 7vw, 80px) 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              color: '#e5e2e1',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}>
              Open Source Forever
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              color: '#c4c7c8',
              lineHeight: 1.75,
              maxWidth: '672px',
              marginBottom: '36px',
            }}>
              Trikosh is MIT licensed. The methodology is published. The pipeline is on GitHub. If you find an error, open an issue. If you want to add a company, submit a PR.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="https://github.com/Trikosh"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#131313',
                  backgroundColor: '#ffffff',
                  padding: '12px 32px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'opacity 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
              >
                View on GitHub
              </a>
              <Link
                href="/research"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#e5e2e1',
                  backgroundColor: 'transparent',
                  border: '1px solid #444748',
                  padding: '12px 32px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1c1b1b' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent' }}
              >
                Read the Methodology
              </Link>
            </div>
          </div>
        </section>

    </>
  )
}
