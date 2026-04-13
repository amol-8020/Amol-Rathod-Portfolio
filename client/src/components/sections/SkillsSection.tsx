import { motion } from 'framer-motion'
import { useSectionReveal } from '../../hooks/useSectionReveal'

const groups = [
  {
    title: 'Programming',
    items: [
      { name: 'Java', value: 84 },
      { name: 'Python', value: 82 },
    ],
  },
  {
    title: 'Soft Skills',
    items: [
      { name: 'Active Listening', value: 88 },
      { name: 'Teamwork', value: 90 },
      { name: 'Self Confidence', value: 86 },
    ],
  },
  {
    title: 'Interests',
    items: [
      { name: 'Gaming', value: 85 },
      { name: 'GUI Design', value: 87 },
      { name: 'AI Tools', value: 89 },
    ],
  },
] as const

export function SkillsSection() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section ref={ref} id="skills" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">SKILLS</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Skills for <span className="text-gradient">development and design</span>
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
          A balanced mix of programming and soft skills, along with strong interest areas that support game
          and interface development.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {groups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ delay: 0.06 * gi, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel group relative overflow-hidden rounded-3xl p-6"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(600px 240px at 20% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent)',
              }}
            />
            <p className="relative font-display text-lg font-semibold">{g.title}</p>
            <div className="relative mt-6 space-y-5">
              {g.items.map((it) => (
                <div key={it.name}>
                  {/** Keep Programming fills identical to Soft Skills with guaranteed width animation */}
                  {(() => {
                    const isProgramming = g.title === 'Programming'
                    return (
                      <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[color:var(--fg)]">{it.name}</span>
                    <span className="text-[color:var(--muted)]">{it.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:color-mix(in_oklab,var(--accent)_10%,transparent)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                        boxShadow: '0 0 24px color-mix(in oklab, var(--accent) 40%, transparent)',
                      }}
                      initial={{ width: 0 }}
                      animate={isProgramming ? { width: `${it.value}%` } : undefined}
                      whileInView={!isProgramming ? { width: `${it.value}%` } : undefined}
                      viewport={{ once: true, margin: '-10%' }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                      </>
                    )
                  })()}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
