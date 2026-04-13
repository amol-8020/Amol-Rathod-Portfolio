import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLoader } from '../../context/LoaderContext'

export function PageLoader() {
  const { done, setDone } = useLoader()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const min = reduce ? 200 : 1800
    const t = window.setTimeout(() => setDone(true), min)
    return () => clearTimeout(t)
  }, [setDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-[color:var(--bg0)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(18px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="relative h-28 w-28"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
            >
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: 'var(--accent)',
                  borderRightColor: 'var(--accent2)',
                  filter: 'drop-shadow(0 0 16px color-mix(in oklab, var(--accent) 40%, transparent))',
                }}
              />
              <div
                className="absolute inset-3 rounded-full border border-dashed opacity-60"
                style={{ borderColor: 'color-mix(in oklab, var(--accent3) 55%, transparent)' }}
              />
            </motion.div>
            <div className="text-center">
              <p className="font-display text-xs tracking-[0.35em] text-[color:var(--muted)]">INITIALIZING</p>
              <p className="font-display mt-2 text-2xl font-semibold text-gradient">AR PORTFOLIO</p>
            </div>
            <motion.div
              className="h-1 w-48 overflow-hidden rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, color-mix(in oklab, var(--accent) 18%, transparent), transparent)',
              }}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3))',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
