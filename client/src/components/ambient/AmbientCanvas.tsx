import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number }

export function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const css = getComputedStyle(document.documentElement)
    const accent = css.getPropertyValue('--accent').trim() || '#39ffc8'
    const accent2 = css.getPropertyValue('--accent2').trim() || '#ff3cac'

    let raf = 0
    let particles: Particle[] = []
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(90, Math.floor((w * h) / 22000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      const t = performance.now() / 1600
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, `${accent}22`)
      g.addColorStop(0.5, `${accent2}14`)
      g.addColorStop(1, `${accent}10`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.a) * 0.08
        p.y += p.vy + Math.cos(t * 0.8 + p.a) * 0.08
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20
        ctx.beginPath()
        ctx.fillStyle = `${accent}55`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < 120 * 120) {
            const alpha = 1 - Math.sqrt(d2) / 120
            ctx.strokeStyle = `rgba(57, 255, 200, ${(alpha * 0.32).toFixed(3)})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-80 mix-blend-screen"
      aria-hidden
    />
  )
}
