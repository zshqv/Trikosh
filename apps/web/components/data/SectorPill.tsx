'use client'

import type { Sector } from '@/lib/types'
import { tokens } from '@/lib/tokens'

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
        fontFamily: tokens.font.sans,
        fontSize: '13px',
        fontWeight: 400,
        padding: '4px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        border: active ? 'none' : tokens.border.rest,
        backgroundColor: active ? tokens.color.accentPrimary : tokens.color.bgSurface2,
        color: active ? '#FFFFFF' : tokens.color.textSecondary,
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      {sector}
    </button>
  )
}
