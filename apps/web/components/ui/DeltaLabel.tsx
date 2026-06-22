import { formatDelta, getDeltaDirection } from '@/lib/utils'
import { tokens } from '@/lib/tokens'

interface DeltaLabelProps {
  value: number
  size?: 'sm' | 'md'
}

const COLOR_MAP = {
  positive: tokens.color.deltaPos,
  negative: tokens.color.deltaNeg,
  neutral:  tokens.color.deltaNeutral,
}

export default function DeltaLabel({ value, size = 'md' }: DeltaLabelProps) {
  const direction = getDeltaDirection(value)
  return (
    <span
      style={{
        fontFamily: tokens.font.mono,
        fontSize: size === 'sm' ? '10px' : '11px',
        color: COLOR_MAP[direction],
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatDelta(value)}
    </span>
  )
}
