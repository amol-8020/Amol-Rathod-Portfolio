  import { motion } from 'framer-motion'
  import { Cpu, Orbit, Zap } from 'lucide-react'
  import { useSectionReveal } from '../../hooks/useSectionReveal'

  const chips: readonly string[] = ['Gaming', 'GUI Design', 'Figma', 'Canva', 'AI Tools']

  export function AboutSection(): JSX.Element {
    const ref = useSectionReveal<HTMLElement>()

    return (
      <section ref={ref} id="about" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div>
            <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">ABOUT ME</p>
            <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Focused on becoming a <span className="text-gradient">game developer</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[color:var(--muted)]">
              I am a final year diploma student in computer engineering, aiming to become a game developer.
              I have a strong interest in AI tools and enjoy designing graphical user interfaces using Figma
              and Canva. I like working on real-world projects and continuously improving my technical and
              creative skills.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="glass-panel rounded-2xl p-5">
                <Zap className="h-5 w-5 text-[color:var(--accent)]" aria-hidden />
                <p className="mt-3 font-display text-lg font-semibold">Goals</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                  Become a game developer, build creative and interactive games, and improve both technical
                  and design skills through consistent practice.
                </p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <Orbit className="h-5 w-5 text-[color:var(--accent2)]" aria-hidden />
                <p className="mt-3 font-display text-lg font-semibold">Interests</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                  Gaming, GUI design using AI tools, Figma and Canva, and practical use of AI tools for better
                  productivity and creativity.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="glass-panel relative overflow-hidden rounded-3xl p-8">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle at center, color-mix(in oklab, var(--accent3) 45%, transparent), transparent)',
                }}
              />
              <Cpu className="relative h-8 w-8 text-[color:var(--accent)]" aria-hidden />
              <p className="relative mt-4 font-display text-xl font-semibold">Current focus</p>
              <p className="relative mt-2 text-sm text-[color:var(--muted)]">
                Learning modern technologies for game and interface development, with a practical approach to
                building polished and interactive digital products.
              </p>
              <div className="relative mt-8 flex flex-wrap gap-2">
                {(Array.isArray(chips) ? chips : []).map((c, i) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ delay: 0.04 * i, duration: 0.45 }}
                    className="rounded-full border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_8%,transparent)] px-3 py-1 text-xs text-[color:var(--fg)]"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
