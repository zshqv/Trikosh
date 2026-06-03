'use client'

import { useEffect, useRef } from 'react'

interface StarfieldProps {
  starColor?: string
  bgColor?: string
  speed?: number
  quantity?: number
  opacity?: number
}

export default function Starfield({
  starColor = 'rgba(255,255,255,0.6)',
  bgColor = 'rgba(0,0,0,0)',
  speed = 0.5,
  quantity = 300,
  opacity = 0.15,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0
    let h = 0

    type Star = {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      alpha: number
      twinkleDir: number
      twinkleSpeed: number
    }

    let stars: Star[] = []

    function init() {
      w = canvas!.offsetWidth
      h = canvas!.offsetHeight
      canvas!.width = w
      canvas!.height = h

      stars = Array.from({ length: quantity }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        vx: (Math.random() - 0.5) * speed * 0.4,
        vy: (Math.random() - 0.5) * speed * 0.4,
        alpha: Math.random() * opacity * 0.8 + opacity * 0.2,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        twinkleSpeed: Math.random() * 0.005 + 0.001,
      }))
    }

    /* Parse `rgba(r,g,b,a)` → `rgba(r,g,b,{alpha})` */
    function applyAlpha(color: string, alpha: number): string {
      const m = color.match(/rgba?\(([^)]+)\)/)
      if (!m) return color
      const parts = m[1].split(',').map(s => s.trim())
      return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha.toFixed(3)})`
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)

      if (bgColor !== 'rgba(0,0,0,0)' && bgColor !== 'transparent') {
        ctx!.fillStyle = bgColor
        ctx!.fillRect(0, 0, w, h)
      }

      for (const s of stars) {
        /* gentle twinkle */
        s.alpha += s.twinkleDir * s.twinkleSpeed
        if (s.alpha >= opacity) { s.alpha = opacity; s.twinkleDir = -1 }
        if (s.alpha <= opacity * 0.15) { s.alpha = opacity * 0.15; s.twinkleDir = 1 }

        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = applyAlpha(starColor, s.alpha)
        ctx!.fill()

        s.x += s.vx
        s.y += s.vy

        if (s.x < -2) s.x = w + 2
        if (s.x > w + 2) s.x = -2
        if (s.y < -2) s.y = h + 2
        if (s.y > h + 2) s.y = -2
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animId)
      init()
      draw()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [starColor, bgColor, speed, quantity, opacity])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
