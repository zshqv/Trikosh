'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { GitBranch, Sun, Moon } from 'lucide-react'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('trikosh-theme') as 'dark' | 'light' | null
    const initial = saved ?? 'dark'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('trikosh-theme', next)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          height: 'var(--nav-h)',
          backgroundColor: scrolled
            ? theme === 'dark' ? 'rgba(19,19,19,0.82)' : 'rgba(245,244,242,0.82)'
            : 'var(--background)',
          backdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
          borderBottom: '1px solid var(--outline-variant)',
          transition: 'background-color 200ms ease',
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

          {/* Desktop nav links */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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

            <a
              href="https://github.com/zshqv/Trikosh"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 10px',
                color: '#8e9192',
                transition: 'color 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#c4c7c8' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#8e9192' }}
            >
              <GitBranch size={16} strokeWidth={1.5} />
            </a>

            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 10px',
                background: 'none',
                border: 'none',
                color: '#8e9192',
                cursor: 'pointer',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c4c7c8' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8e9192' }}
            >
              {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>

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

          {/* Mobile: auth + hamburger */}
          <div className="show-on-mobile" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
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
                    padding: '5px 12px',
                    backgroundColor: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                width: '32px',
                height: '32px',
              }}
            >
              <span style={{
                display: 'block',
                width: '20px',
                height: '1px',
                backgroundColor: '#ffffff',
                transition: 'transform 200ms ease, opacity 200ms ease',
                transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display: 'block',
                width: '20px',
                height: '1px',
                backgroundColor: '#ffffff',
                transition: 'opacity 200ms ease',
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: 'block',
                width: '20px',
                height: '1px',
                backgroundColor: '#ffffff',
                transition: 'transform 200ms ease, opacity 200ms ease',
                transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="show-on-mobile"
        style={{
          position: 'fixed',
          top: 'var(--nav-h)',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--background)',
          zIndex: 49,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: menuOpen ? 1 : 0,
          transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 200ms ease',
          overflowY: 'auto',
          borderBottom: '1px solid var(--outline-variant)',
        }}
      >
        <div style={{ padding: '8px 0 32px' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: active ? 500 : 400,
                  color: active ? '#ffffff' : '#8e9192',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderBottom: '1px solid var(--surface-container-low)',
                }}
              >
                {label}
                {active && (
                  <span style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    flexShrink: 0,
                  }} />
                )}
              </Link>
            )
          })}

          <a
            href="https://github.com/zshqv/Trikosh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 24px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: '#8e9192',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderBottom: '1px solid var(--outline-variant)',
            }}
          >
            <GitBranch size={14} strokeWidth={1.5} />
            GitHub
          </a>

          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '16px 24px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: '#8e9192',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark'
              ? <Sun size={14} strokeWidth={1.5} />
              : <Moon size={14} strokeWidth={1.5} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-on-mobile { display: none !important; }
          .hide-on-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
