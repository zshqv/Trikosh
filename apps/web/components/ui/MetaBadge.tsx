interface MetaBadgeProps {
  label: string
  variant: 'gaap' | 'ifrs' | 'sec' | 'warn'
}

const VARIANTS = {
  gaap: { bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
  ifrs: { bg: 'rgba(124,58,237,0.14)', color: '#a78bfa' },
  sec:  { bg: 'rgba(124,58,237,0.14)', color: '#a78bfa' },
  warn: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
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
      }}
    >
      {label}
    </span>
  )
}
