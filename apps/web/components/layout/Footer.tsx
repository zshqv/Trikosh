'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors' },
  { label: 'Compare',   href: '/compare' },
  { label: 'Research',  href: '/research' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1f1f1f' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 700,
            color: '#ffffff',
          }}>
            Trikosh
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: '#8a8a8a',
                textDecoration: 'none',
              }}
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
          padding: '16px 24px 28px',
          borderTop: '1px solid #1f1f1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6b6b6b' }}>
          Open source · MIT License · Built by Ashutosh Tripathi
        </span>
        <a
          href="https://github.com/zshqv/Trikosh"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: '#b300ff',
            textDecoration: 'none',
          }}
        >
          GitHub ↗
        </a>
      </div>
    </footer>
  )
}
