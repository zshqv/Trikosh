'use client'

import Link from 'next/link'

const LEGAL_LINKS = [
  { label: 'Privacy Policy',  href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security',         href: '/security' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#131313', borderTop: '1px solid #444748' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '36px 24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '16px',
            fontWeight: 700,
            color: '#ffffff',
          }}>
            Trikosh
          </span>
        </Link>

        {/* Legal links */}
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
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
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 24px 24px',
          borderTop: '1px solid rgba(68,71,72,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#8e9192',
        }}>
          Open source · MIT License · Built by Ashutosh Tripathi
        </span>
        <a
          href="https://github.com/zshqv/Trikosh"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#e5e2e1',
            textDecoration: 'none',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#e5e2e1' }}
        >
          GitHub ↗
        </a>
      </div>
    </footer>
  )
}
