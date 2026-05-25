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
        color: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.10)',
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
