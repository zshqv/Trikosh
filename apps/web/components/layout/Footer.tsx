'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors'   },
  { label: 'Compare',   href: '/compare'   },
  { label: 'Research',  href: '/research'  },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-base)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '36px 32px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--text-primary)',
          }}>
            Trikosh
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color 150ms ease',
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
          padding: '16px 32px 28px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.02em',
        }}>
          Open source · MIT · Built by Ashutosh Tripathi
        </span>
        <a
          href="https://github.com/zshqv/Trikosh"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            transition: 'color 150ms ease',
          }}
        >
          GitHub ↗
        </a>
      </div>
    </footer>
  )
}
