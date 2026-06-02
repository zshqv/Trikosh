'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'
const DOT  = 5
const RING = 28

export default function CustomCursor() {
  const [enabled, setEnabled]   = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible]   = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const dotX = useTransform(rawX, v => v - DOT / 2)
  const dotY = useTransform(rawY, v => v - DOT / 2)

  const springCfg = { damping: 30, stiffness: 400, mass: 0.5 }
  const springX   = useSpring(rawX, springCfg)
  const springY   = useSpring(rawY, springCfg)
  const ringX     = useTransform(springX, v => v - RING / 2)
  const ringY     = useTransform(springY, v => v - RING / 2)

  useEffect(() => {
    const fine   = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return

    setEnabled(true)
    document.documentElement.classList.add('cursor-ready')

    function move(e: MouseEvent) {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      setHovering(!!t && !!t.closest(INTERACTIVE))
    }
    function leave() { setVisible(false) }
    function enter() { setVisible(true) }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      document.documentElement.classList.remove('cursor-ready')
    }
  }, [rawX, rawY])

  if (!enabled) return null

  return (
    <>
      {/* Dot */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: DOT,
          height: DOT,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          translateX: dotX,
          translateY: dotY,
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: visible ? 1 : 0,
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <motion.div
        aria-hidden
        animate={{
          scale: hovering ? 1.4 : 1,
          opacity: visible ? (hovering ? 0.8 : 0.35) : 0,
          borderColor: hovering
            ? 'rgba(255,255,255,0.6)'
            : 'rgba(255,255,255,0.35)',
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 340 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: RING,
          height: RING,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.35)',
          translateX: ringX,
          translateY: ringY,
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
    </>
  )
}
