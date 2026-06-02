'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const SESSION_KEY = 'trikosh:loaded'

export default function LoadingScreen() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const already = sessionStorage.getItem(SESSION_KEY)
    if (already) return

    setShow(true)
    document.body.style.overflow = 'hidden'

    const dwell = reduce ? 300 : 1400
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
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#080808',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(32px, 6vw, 60px)',
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: '#f0f0f0',
              lineHeight: 1,
            }}
          >
            Trikosh
          </motion.span>

          <div
            style={{
              width: 'min(160px, 50vw)',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: reduce ? 0.3 : 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.55)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
