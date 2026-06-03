'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

const NAV_LINKS = [
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors' },
  { label: 'Compare',   href: '/compare' },
  { label: 'Research',  href: '/research' },
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
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #1f1f1f',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: 700,
            color: '#ffffff',
          }}>
            Trikosh
          </span>
        </Link>

        {/* Nav links + CTA */}
        <div
          onMouseLeave={() => setHovered(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
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
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive || isHot ? '#ffffff' : '#8a8a8a',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
              >
                {label}
                {isHot && (
                  <span style={{
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 2,
                    height: 1,
                    backgroundColor: '#b300ff',
                    display: 'block',
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
                fontSize: '13px',
                fontWeight: 500,
                color: '#ffffff',
                border: '1px solid #b300ff',
                borderRadius: '6px',
                padding: '7px 16px',
                marginLeft: '10px',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              Start researching
            </Link>
          </SignedOut>

          <SignedIn>
            <div style={{ marginLeft: '14px' }}>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
