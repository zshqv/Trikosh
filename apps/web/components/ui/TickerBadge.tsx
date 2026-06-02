interface TickerBadgeProps {
  ticker: string
  exchange: string
}

export default function TickerBadge({ ticker, exchange }: TickerBadgeProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--accent-data)',
        backgroundColor: 'rgba(91,142,240,0.10)',
        padding: '2px 7px',
        borderRadius: '2px',
        display: 'inline-block',
        letterSpacing: '0.02em',
      }}
    >
      {ticker} · {exchange}
    </span>
  )
}
