'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'

const NAV_LINKS = [
  { label: 'Companies', href: '/companies' },
  { label: 'Sectors',   href: '/sectors' },
  { label: 'Compare',   href: '/compare' },
  { label: 'Glossary',  href: '/glossary' },
  { label: 'Research',  href: '/research' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)
  const [companyCount, setCompanyCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.companies ?? []
        setCompanyCount(list.length)
      })
      .catch(() => setCompanyCount(null))
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/companies?q=${encodeURIComponent(q)}` : '/companies')
    setQuery('')
  }

  // The link whose underline is shown: hovered takes priority, else active route.
  const activeHref =
    NAV_LINKS.find(l => l.href === pathname || pathname.startsWith(l.href))?.href ?? null
  const highlight = hovered ?? activeHref

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 'var(--nav-h)',
        backgroundColor: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
        {/* Left: Brand */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              display: 'block',
              lineHeight: 1.1,
            }}
          >
            TRIKOSH
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              display: 'block',
            }}
          >
            v1.0 &middot; {companyCount !== null ? `${companyCount} companies` : 'loading...'}
          </span>
        </Link>

        {/* Center: Navigation links */}
        <div
          onMouseLeave={() => setHovered(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === activeHref
            const isHot = href === highlight
            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive || isHot ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 14px',
                  transition: 'color 180ms ease',
                }}
              >
                {label}
                {isHot && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                    style={{
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: -2,
                      height: 2,
                      borderRadius: 2,
                      backgroundColor: 'var(--accent-primary)',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right: Search + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <form onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search companies..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid #1f1f1f',
                borderRadius: '8px',
                padding: '6px 12px',
                width: '176px',
                outline: 'none',
              }}
            />
          </form>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: 'var(--accent-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}
