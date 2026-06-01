'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  // Dot tracks exactly; ring follows with spring lag.
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { damping: 28, stiffness: 380, mass: 0.6 })
  const ringY = useSpring(dotY, { damping: 28, stiffness: 380, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return

    setEnabled(true)
    document.documentElement.classList.add('cursor-ready')

    function move(e: MouseEvent) {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      setHovering(!!t && !!t.closest(INTERACTIVE))
    }
    function leave() {
      setVisible(false)
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.documentElement.classList.remove('cursor-ready')
    }
  }, [dotX, dotY])

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
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          translateX: dotX,
          translateY: dotY,
          x: '-50%',
          y: '-50%',
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
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          opacity: visible ? (hovering ? 1 : 0.6) : 0,
          borderColor: hovering ? 'rgba(167,139,250,0.9)' : 'rgba(245,245,245,0.5)',
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          border: '1px solid rgba(245,245,245,0.5)',
          translateX: ringX,
          translateY: ringY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
    </>
  )
}
