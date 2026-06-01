'use client'

import { useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Card with a violet radial spotlight that follows the cursor, plus a
 * border that lights up on hover. Aceternity-style, dark-themed.
 */
export default function CardSpotlight({
  children,
  style,
  radius = 280,
}: {
  children: ReactNode
  style?: CSSProperties
  radius?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [hover, setHover] = useState(false)

  function onMove(e: React.MouseEvent) {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPos(null) }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid #1f1f1f',
        borderRadius: '14px',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        borderColor: hover ? 'rgba(124,58,237,0.45)' : '#1f1f1f',
        boxShadow: hover ? '0 0 0 1px rgba(124,58,237,0.15), 0 12px 40px -12px rgba(124,58,237,0.35)' : 'none',
        ...style,
      }}
    >
      {pos && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: hover ? 1 : 0,
            transition: 'opacity 200ms ease',
            background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.18), transparent 65%)`,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
