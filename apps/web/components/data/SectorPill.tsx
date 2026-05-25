'use client'

import type { Sector } from '@/lib/types'

interface SectorPillProps {
  sector: Sector
  active?: boolean
  onClick?: () => void
}

export default function SectorPill({ sector, active = false, onClick }: SectorPillProps) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        fontWeight: 400,
        padding: '4px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        border: active ? 'none' : 'var(--border-rest)',
        backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface-2)',
        color: active ? '#FFFFFF' : 'var(--text-secondary)',
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      {sector}
    </button>
  )
}
