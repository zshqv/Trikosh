'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

const NAV_LINKS = [
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors'   },
  { label: 'Compare',   href: '/compare'   },
  { label: 'Research',  href: '/research'  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 'var(--nav-h)',
        backgroundColor: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '17px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '0.01em',
          }}>
            Trikosh
          </span>
        </Link>

        {/* Nav + auth */}
        <div
          onMouseLeave={() => setHovered(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '0' }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            const isHot = hovered ? hovered === href : isActive
            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: isHot ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 14px',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                  letterSpacing: '0.01em',
                }}
              >
                {label}
                {isHot && (
                  <span style={{
                    position: 'absolute',
                    left: 14,
                    right: 14,
                    bottom: 4,
                    height: '1px',
                    backgroundColor: 'var(--text-primary)',
                    display: 'block',
                    opacity: 0.5,
                  }} />
                )}
              </Link>
            )
          })}

          <SignedOut>
            <Link
              href="/companies"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                color: '#080808',
                backgroundColor: 'var(--text-primary)',
                borderRadius: '3px',
                padding: '6px 14px',
                marginLeft: '12px',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                transition: 'opacity 150ms ease',
              }}
            >
              Browse →
            </Link>
          </SignedOut>

          <SignedIn>
            <div style={{ marginLeft: '16px' }}>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
