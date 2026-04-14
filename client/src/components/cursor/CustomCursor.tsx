import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export function CustomCursor() {
  const on =
    typeof window !== 'undefined' &&
    !window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.45 })
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.45 })
  const hx = useSpring(x, { stiffness: 1200, damping: 55 })
  const hy = useSpring(y, { stiffness: 1200, damping: 55 })

  useEffect(() => {
    if (!on) return

    document.documentElement.classList.add('no-cursor')
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.classList.remove('no-cursor')
    }
  }, [on, x, y])

  if (!on) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-screen"
        style={{ x: sx, y: sy }}
      >
        <div
          className="h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            borderColor: 'color-mix(in oklab, var(--accent) 55%, transparent)',
            boxShadow: '0 0 40px color-mix(in oklab, var(--accent) 35%, transparent)',
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000]"
        style={{ x: hx, y: hy }}
      >
        <div
          className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 0 18px var(--accent)',
          }}
        />
      </motion.div>
    </>
  )
}
