import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { IconGithub, IconLinkedin } from '../icons/BrandIcons'
import { useLoader } from '../../context/LoaderContext'
import { useTypewriter } from '../../hooks/useTypewriter'

export function HeroSection() {
  const { done } = useLoader()
  const line = useTypewriter(done)

  return (
    <section
      id="hero"
      className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pb-24 pt-32 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="max-w-4xl">
        <motion.p
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_8%,transparent)] px-3 py-1 text-xs tracking-[0.2em] text-[color:var(--muted)]"
          initial={{ opacity: 0, y: 12 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          PORTFOLIO
        </motion.p>
        <motion.h1
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Amol Manna Rathod
          <span className="block text-gradient">Final Year Computer Engineering Student</span>
        </motion.h1>
        <motion.div
          className="mt-8 min-h-[3.5rem] font-display text-xl text-[color:var(--muted)] md:text-2xl"
          initial={{ opacity: 0 }}
          animate={done ? { opacity: 1 } : {}}
          transition={{ delay: 0.18, duration: 0.6 }}
        >
          <span className="text-[color:var(--fg)]">{line}</span>
          <span className="ml-1 inline-block h-7 w-[2px] translate-y-1 animate-pulse bg-[color:var(--accent)]" />
        </motion.div>
        <motion.p
          className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.65 }}
        >
          Final year diploma computer engineering student with a strong interest in game development,
          AI-powered tools, and clean GUI design using Figma and Canva.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.65 }}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl px-6 py-3 font-medium text-[#031016]"
            style={{
              background: 'linear-gradient(120deg, var(--accent), var(--accent3))',
              boxShadow: '0 0 40px color-mix(in oklab, var(--accent) 35%, transparent)',
            }}
          >
            <span className="relative z-10">View work</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="glass-panel inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-medium text-[color:var(--fg)] transition hover:border-[color:color-mix(in_oklab,var(--accent)_55%,transparent)]"
          >
            Contact me
          </a>
          <div className="flex items-center gap-2 pl-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--stroke)] text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
              aria-label="GitHub"
            >
              <IconGithub className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--stroke)] text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
              aria-label="LinkedIn"
            >
              <IconLinkedin className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="pointer-events-none absolute -right-24 top-24 hidden h-[420px] w-[420px] rounded-full blur-3xl md:block"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--accent2) 55%, transparent), transparent 60%)',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      />
    </section>
  )
}
