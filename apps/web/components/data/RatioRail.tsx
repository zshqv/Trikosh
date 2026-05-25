import type { FinancialMetric } from '@/lib/types'
import { formatPercent, formatMultiple } from '@/lib/utils'

interface RatioRailProps {
  ratios: FinancialMetric[]
}

function formatRatioValue(metric: FinancialMetric): string {
  if (metric.unit === 'PCT') return formatPercent(metric.value)
  if (metric.unit === 'MULTIPLE') return formatMultiple(metric.value)
  return metric.value.toFixed(2)
}

export default function RatioRail({ ratios }: RatioRailProps) {
  const displayed = ratios.slice(0, 4)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {displayed.map((ratio) => (
        <div key={ratio.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 'max-content' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-tertiary)',
              fontWeight: 400,
            }}
          >
            {ratio.label}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-primary)',
            }}
          >
            {formatRatioValue(ratio)}
          </span>
        </div>
      ))}
    </div>
  )
}
