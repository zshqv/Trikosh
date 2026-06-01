'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

const EASE = [0.25, 0.1, 0.25, 1] as const

/**
 * Single scroll-in reveal. opacity 0 / y 24 -> opacity 1 / y 0.
 * Fires once when scrolled into view. No-ops under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger container — children animate 0.08s apart. Wrap each child in
 * <RevealItem>. No-ops under prefers-reduced-motion.
 */
export function RevealGroup({
  children,
  className,
  style,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  stagger?: number
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

export function RevealItem({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div className={className} style={style} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
