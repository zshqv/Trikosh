'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/companies?q=${encodeURIComponent(q)}` : '/companies')
    setQuery('')
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: '56px',
        backgroundColor: 'var(--bg-surface-1)',
        borderBottom: 'var(--border-rest)',
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
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
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
            }}
          >
            v1.0 · 50 companies
          </span>
        </Link>

        {/* Center: Navigation links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textDecoration: isActive ? 'underline' : 'none',
                  textDecorationColor: 'var(--accent-primary)',
                  textUnderlineOffset: '3px',
                  transition: 'color 150ms ease',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: Search + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <form onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search companies…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface-2)',
                border: 'var(--border-rest)',
                borderRadius: '6px',
                padding: '5px 10px',
                width: '176px',
                outline: 'none',
              }}
            />
          </form>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  )
}
