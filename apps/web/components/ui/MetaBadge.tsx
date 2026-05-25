interface MetaBadgeProps {
  label: string
  variant: 'gaap' | 'ifrs' | 'sec' | 'warn'
}

const VARIANTS = {
  gaap: { bg: '#D1FAE5', color: '#065F46' },
  ifrs: { bg: '#DBEAFE', color: '#1E40AF' },
  sec:  { bg: '#DBEAFE', color: '#1E40AF' },
  warn: { bg: '#FEF3C7', color: '#92400E' },
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
