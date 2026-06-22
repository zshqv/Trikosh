import { tokens } from '@/lib/tokens'

interface TickerBadgeProps {
  ticker: string
  exchange: string
}

export default function TickerBadge({ ticker, exchange }: TickerBadgeProps) {
  return (
    <span
      style={{
        fontFamily: tokens.font.mono,
        fontSize: '11px',
        fontWeight: 500,
        color: tokens.color.accentData,
        backgroundColor: 'rgba(124,58,237,0.14)',
        padding: '2px 7px',
        borderRadius: '3px',
        display: 'inline-block',
        letterSpacing: '0.01em',
      }}
    >
      {ticker} · {exchange}
    </span>
  )
}
