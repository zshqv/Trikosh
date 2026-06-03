'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors' },
  { label: 'Compare',   href: '/compare' },
  { label: 'Research',  href: '/research' },
  { label: 'Glossary',  href: '/glossary' },
  { label: 'About',     href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 'var(--nav-h)',
        backgroundColor: scrolled ? 'rgba(19,19,19,0.8)' : '#131313',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid #444748',
        transition: 'background-color 200ms ease, backdrop-filter 200ms ease',
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
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}>
            Trikosh
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: active ? 500 : 400,
                  color: active ? '#ffffff' : '#8e9192',
                  padding: '8px 10px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#c4c7c8' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#8e9192' }}
              >
                {label}
                {active && (
                  <span style={{
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 2,
                    height: '1px',
                    backgroundColor: '#ffffff',
                    display: 'block',
                  }} />
                )}
              </Link>
            )
          })}

          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#000000',
                  border: '1px solid #ffffff',
                  borderRadius: '4px',
                  padding: '6px 14px',
                  marginLeft: '8px',
                  backgroundColor: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 150ms',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div style={{ marginLeft: '12px' }}>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
