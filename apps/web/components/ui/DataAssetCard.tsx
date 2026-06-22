'use client'

import { useState } from 'react'
import type { CardData } from '@/lib/types'
import { formatPercent } from '@/lib/utils'
import { tokens } from '@/lib/tokens'
import TickerBadge from './TickerBadge'
import DeltaLabel from './DeltaLabel'
import Sparkline from './Sparkline'
import RatioRail from '@/components/data/RatioRail'
import MetaStrip from '@/components/data/MetaStrip'

interface DataAssetCardProps {
  data: CardData
  onClick?: () => void
  isLoading?: boolean
}

function formatPrimaryValue(value: number): string {
  return formatPercent(value)
}

export default function DataAssetCard({ data, onClick, isLoading }: DataAssetCardProps) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  const { company, primaryMetric, secondaryMetric, ratios, sparkline, source, isPinned, isStale } = data

  const accentColor = isPinned ? tokens.color.accentArchive : tokens.color.accentPrimary

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: tokens.radius.card,
        backgroundColor: tokens.color.bgSurface1,
        border: hovered ? tokens.border.hover : tokens.border.rest,
        minWidth: '300px',
        maxWidth: '380px',
        cursor: onClick ? 'pointer' : 'default',
        transition: tokens.transition.card,
        transform: active ? 'scale(0.99)' : 'scale(1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: accentColor,
          borderRadius: '12px 12px 0 0',
          opacity: hovered || isPinned ? 1 : 0,
          transition: 'opacity 150ms ease',
          zIndex: 1,
        }}
      />

      {/* Zone A — Header */}
      <div style={{ padding: '14px 14px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <TickerBadge ticker={company.ticker} exchange={company.exchange} />
          <div
            style={{
              display: 'flex',
              gap: '6px',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 150ms ease',
            }}
          >
            <button
              aria-label="Expand"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: tokens.color.bgSurface2,
                border: tokens.border.rest,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: tokens.color.textSecondary,
              }}
            >
              ↗
            </button>
            <button
              aria-label="Download"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: tokens.color.bgSurface2,
                border: tokens.border.rest,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: tokens.color.textSecondary,
              }}
            >
              ↓
            </button>
          </div>
        </div>

        <p
          style={{
            fontFamily: tokens.font.sans,
            fontSize: '15px',
            fontWeight: 500,
            color: tokens.color.textPrimary,
            marginBottom: '3px',
            lineHeight: 1.3,
          }}
        >
          {company.name}
        </p>
        <p
          style={{
            fontFamily: tokens.font.sans,
            fontSize: '12px',
            fontWeight: 400,
            color: tokens.color.textTertiary,
            fontStyle: 'italic',
            marginBottom: '4px',
            lineHeight: 1.4,
          }}
        >
          {company.analyticalLens}
        </p>
        <p style={{ fontFamily: tokens.font.sans, fontSize: '12px', color: tokens.color.textTertiary }}>
          {company.sector} · {company.industry}
        </p>

        <div style={{ marginTop: '10px', borderTop: tokens.border.rest }} />
      </div>

      {/* Zone B — Core Data */}
      <div style={{ padding: '12px 14px' }}>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            {[0, 1].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="shimmer" style={{ height: '11px', width: '60%', borderRadius: '3px' }} />
                <div className="shimmer" style={{ height: '20px', width: '80%', borderRadius: '3px' }} />
                <div className="shimmer" style={{ height: '11px', width: '50%', borderRadius: '3px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <p
                style={{
                  fontFamily: tokens.font.mono,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: tokens.color.textTertiary,
                  marginBottom: '2px',
                }}
              >
                {primaryMetric.label}
              </p>
              <p
                style={{
                  fontFamily: tokens.font.sans,
                  fontSize: '20px',
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                  color: hovered ? tokens.color.accentPrimary : tokens.color.textPrimary,
                  transition: 'color 150ms ease',
                  marginBottom: '2px',
                }}
              >
                {formatPrimaryValue(primaryMetric.value)}
              </p>
              {primaryMetric.delta !== undefined && (
                <DeltaLabel value={primaryMetric.delta} size="sm" />
              )}
            </div>

            {secondaryMetric && (
              <div>
                <p
                  style={{
                    fontFamily: tokens.font.mono,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: tokens.color.textTertiary,
                    marginBottom: '2px',
                  }}
                >
                  {secondaryMetric.label}
                </p>
                <p
                  style={{
                    fontFamily: tokens.font.sans,
                    fontSize: '20px',
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums',
                    color: tokens.color.textPrimary,
                    marginBottom: '2px',
                  }}
                >
                  {formatPrimaryValue(secondaryMetric.value)}
                </p>
                {secondaryMetric.delta !== undefined && (
                  <DeltaLabel value={secondaryMetric.delta} size="sm" />
                )}
              </div>
            )}
          </div>
        )}

        <Sparkline
          data={sparkline}
          width={280}
          height={28}
          color={hovered ? tokens.color.accentPrimary : tokens.color.accentData}
        />
      </div>

      {/* Zone C — Ratio Rail */}
      <div style={{ padding: '0 14px 10px' }}>
        <RatioRail ratios={ratios} />
        <div style={{ marginTop: '10px', borderTop: tokens.border.rest }} />
      </div>

      {/* Zone D — Meta Strip */}
      <div
        style={{
          padding: '8px 14px',
          backgroundColor: tokens.color.cardMetaBg,
          borderRadius: '0 0 12px 12px',
          marginTop: 'auto',
        }}
      >
        <MetaStrip source={source} isStale={isStale} />
      </div>
    </div>
  )
}
