import { motion } from 'framer-motion'
import { useLoader } from '../../context/LoaderContext'
import { useSectionReveal } from '../../hooks/useSectionReveal'

export function ProfileSection() {
  const ref = useSectionReveal<HTMLElement>()
  const { done } = useLoader()

  return (
    <section ref={ref} id="profile" className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:px-8">
      <motion.div
        className="glass-panel relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={done ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, color-mix(in oklab, var(--accent3) 40%, transparent), transparent)',
          }}
        />
        <p className="relative font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">PROFILE</p>
        <h2 className="relative mt-2 font-display text-2xl font-semibold md:text-3xl">Amol Manna Rathod</h2>
        <p className="relative mt-4 max-w-3xl text-base leading-relaxed text-[color:var(--muted)] md:text-lg">
          Amol Manna Rathod is a final year diploma computer engineering student with a strong interest in
          game development and modern technologies. He enjoys using AI tools and creating graphical user
          interfaces with Figma and Canva to build interactive and visually engaging digital experiences.
        </p>
      </motion.div>
    </section>
  )
}
