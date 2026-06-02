interface MetaBadgeProps {
  label: string
  variant: 'gaap' | 'ifrs' | 'sec' | 'warn'
}

const VARIANTS = {
  gaap: { bg: 'rgba(74,222,128,0.10)',  color: '#4ade80' },
  ifrs: { bg: 'rgba(91,142,240,0.10)',  color: '#5b8ef0' },
  sec:  { bg: 'rgba(91,142,240,0.10)',  color: '#5b8ef0' },
  warn: { bg: 'rgba(251,146,60,0.12)',  color: '#fb923c' },
}

export default function MetaBadge({ label, variant }: MetaBadgeProps) {
  const { bg, color } = VARIANTS[variant]
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        backgroundColor: bg,
        color,
        padding: '1px 5px',
        borderRadius: '2px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  )
}
