'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const SESSION_KEY = 'trikosh:loaded'

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  // Render nothing on the server and on subsequent client navigations.
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const already = sessionStorage.getItem(SESSION_KEY)
    if (already) return

    setShow(true)
    // Lock scroll while the loader is up.
    document.body.style.overflow = 'hidden'

    const dwell = reduce ? 300 : 1500
    const t = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1')
      setShow(false)
    }, dwell)

    return () => clearTimeout(t)
  }, [reduce])

  function handleExitComplete() {
    document.body.style.overflow = ''
  }

  if (!mounted) return null

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 8vw, 72px)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#f5f5f5',
              lineHeight: 1,
            }}
          >
            TRIKOSH
          </motion.span>

          {/* progress track */}
          <div
            style={{
              width: 'min(220px, 60vw)',
              height: '2px',
              backgroundColor: '#1f1f1f',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: reduce ? 0.3 : 1.3, ease: [0.4, 0, 0.2, 1] }}
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                borderRadius: '2px',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
