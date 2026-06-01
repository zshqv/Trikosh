'use client'

import { useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function BentoGrid({
  children,
  style,
  className,
}: {
  children: ReactNode
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '14px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Bento cell with violet mouse-follow glow + subtle lift on hover.
 * `colSpan` is in a 6-column grid. Collapses to full width under ~720px
 * via the inline media handling in the consuming page.
 */
export function BentoCard({
  children,
  colSpan = 2,
  rowSpan = 1,
  style,
}: {
  children: ReactNode
  colSpan?: number
  rowSpan?: number
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null)

  function onMove(e: React.MouseEvent) {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setGlow({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setGlow(null)}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid #1f1f1f',
        borderRadius: '16px',
        padding: '28px',
        ...style,
      }}
    >
      {glow && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(220px circle at ${glow.x}px ${glow.y}px, rgba(124,58,237,0.16), transparent 70%)`,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  )
}
