'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'

/* Translate the tip down the rail in proportion to scroll progress. */
function useTipY(progress: MotionValue<number>, ref: React.RefObject<HTMLDivElement>) {
  return useTransform(progress, (p) => {
    const h = ref.current?.offsetHeight ?? 0
    return Math.max(0, (h - 32) * p)
  })
}

/**
 * Aceternity-style tracing beam. A violet line down the left edge that
 * fills as the reader scrolls through the wrapped content, with a glowing
 * tip. Beam is hidden on narrow viewports (content stays full width).
 */
export default function TracingBeam({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 12%', 'end 85%'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.6 })
  const tipY = useTipY(fill, ref)

  return (
    <div ref={ref} style={{ position: 'relative', maxWidth: 860, margin: '0 auto', width: '100%' }}>
      {/* Beam rail — desktop only */}
      <div
        aria-hidden
        className="tracing-beam-rail"
        style={{
          position: 'absolute',
          left: -36,
          top: 8,
          bottom: 8,
          width: 2,
          borderRadius: 2,
          backgroundColor: '#1f1f1f',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'top',
            scaleY: reduce ? 1 : fill,
            background: 'linear-gradient(180deg, #7c3aed, #a78bfa)',
            boxShadow: '0 0 12px rgba(124,58,237,0.6)',
          }}
        />
      </div>

      {/* Glowing tip that rides the fill */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="tracing-beam-rail"
          style={{
            position: 'absolute',
            left: -41,
            top: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#a78bfa',
            boxShadow: '0 0 14px 2px rgba(124,58,237,0.8)',
            y: tipY,
          }}
        />
      )}

      <div>{children}</div>

      <style jsx>{`
        @media (max-width: 1100px) {
          :global(.tracing-beam-rail) {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
