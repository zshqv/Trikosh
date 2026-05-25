'use client'

import Link from 'next/link'

const NAV_COLUMNS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Companies',  href: '/companies' },
      { label: 'Sectors',    href: '/sectors' },
      { label: 'Compare',    href: '/compare' },
      { label: 'Glossary',   href: '/glossary' },
      { label: 'Research',   href: '/research' },
    ],
  },
  {
    heading: 'Data',
    links: [
      { label: 'Sources',     href: '/about#data' },
      { label: 'Methodology', href: '/about#methodology' },
      { label: 'Disclaimer',  href: '/disclaimer' },
      { label: 'Changelog',   href: '/about#changelog' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'GitHub',       href: 'https://github.com/ashutoshatri/trikosh' },
      { label: 'Contributing', href: 'https://github.com/ashutoshatri/trikosh/blob/main/CONTRIBUTING.md' },
      { label: 'Roadmap',      href: 'https://github.com/ashutoshatri/trikosh/blob/main/ROADMAP.md' },
      { label: 'About',        href: '/about' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface-1)',
        borderTop: 'var(--border-rest)',
      }}
    >
      {/* Main grid: brand column + nav columns */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px 32px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
        }}
      >
        {/* Brand column */}
        <div>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Trikosh
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                display: 'block',
                marginTop: '3px',
              }}
            >
              v1.0 · 50 companies
            </span>
          </Link>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '240px',
              margin: 0,
            }}
          >
            Open-source financial research infrastructure for students and aspiring analysts.
          </p>
        </div>

        {/* Nav columns */}
        {NAV_COLUMNS.map(({ heading, links }) => (
          <div key={heading}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
                margin: '0 0 14px 0',
              }}
            >
              {heading}
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar: disclaimer + copyright */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 24px 24px',
          borderTop: 'var(--border-rest)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            lineHeight: 1.5,
          }}
        >
          Data sourced via yFinance for educational use only — not financial advice.{' '}
          <Link
            href="/disclaimer"
            style={{
              color: 'var(--text-tertiary)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Full disclaimer
          </Link>
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            whiteSpace: 'nowrap',
          }}
        >
          © 2025 Trikosh Contributors — MIT License
        </span>
      </div>
    </footer>
  )
}
