export const tokens = {
  color: {
    bgBase:      'var(--bg-base)',
    bgSurface1:  'var(--bg-surface-1)',
    bgSurface2:  'var(--bg-surface-2)',
    bgMuted:     'var(--bg-muted)',
    bgLowest:    'var(--bg-surface-lowest)',
    textPrimary:   'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    textTertiary:  'var(--text-tertiary)',
    accentPrimary: 'var(--accent-primary)',
    accentData:    'var(--accent-data)',
    accentArchive: 'var(--accent-archive)',
    accentGlow:    'var(--accent-glow)',
    deltaPos:      'var(--delta-pos)',
    deltaNeg:      'var(--delta-neg)',
    deltaNeutral:  'var(--delta-neutral)',
    deltaWarn:     'var(--delta-warn)',
    deltaEstimate: 'var(--delta-estimate)',
    cardMetaBg:    'var(--card-meta-bg)',
    outline:       'var(--outline)',
    outlineVariant:'var(--outline-variant)',
  },
  font: {
    display: 'var(--font-display)',
    sans:    'var(--font-sans)',
    mono:    'var(--font-mono)',
  },
  border: {
    rest:   'var(--border-rest)',
    hover:  'var(--border-hover)',
    subtle: 'var(--border-subtle)',
  },
  radius: {
    card: 'var(--card-radius)',
  },
  transition: {
    card: 'var(--card-transition)',
  },
  layout: {
    navH: 'var(--nav-h)',
  },
} as const
