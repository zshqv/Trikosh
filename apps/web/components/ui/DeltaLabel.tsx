import { formatDelta, getDeltaDirection } from '@/lib/utils'

interface DeltaLabelProps {
  value: number
  size?: 'sm' | 'md'
}

const COLOR_MAP = {
  positive: 'var(--delta-pos)',
  negative: 'var(--delta-neg)',
  neutral:  'var(--delta-neutral)',
}

export default function DeltaLabel({ value, size = 'md' }: DeltaLabelProps) {
  const direction = getDeltaDirection(value)
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: size === 'sm' ? '10px' : '11px',
        color: COLOR_MAP[direction],
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatDelta(value)}
    </span>
  )
}
