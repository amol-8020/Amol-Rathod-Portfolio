import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { IconGithub } from '../icons/BrandIcons'
import { useEffect, useState } from 'react'
import { api, mediaUrl } from '../../lib/api'
import type { Project } from '../../types/project'
import { useSectionReveal } from '../../hooks/useSectionReveal'
import amolPortfolioImage from '../../assets/AmolPortfolio-Homepage.png'
import campusVoiceImage from '../../assets/CampusVoice-Dashboard.png'

const projectImagesByTitle: Record<string, string> = {
  'Portfolio Web Application': amolPortfolioImage,
  'CampusVoice: Online Complaint, Suggestion & Lost and Found Portal': campusVoiceImage,
}

export function ProjectsSection() {
  const ref = useSectionReveal<HTMLElement>()
  const [items, setItems] = useState<Project[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<Project[]>('/api/projects')
      .then((r) => setItems(r.data))
      .catch(() => setErr('Unable to load projects. Start the API server on port 4000.'))
  }, [])

  return (
    <section ref={ref} id="projects" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">PROJECTS</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Featured <span className="text-gradient">projects</span>
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
          These projects highlight practical problem-solving, clean interfaces, and interactive web
          development work.
        </p>
      </div>

      {err && (
        <p className="mt-8 rounded-2xl border border-[color:color-mix(in_oklab,var(--accent2)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--accent2)_10%,transparent)] px-4 py-3 text-sm text-[color:var(--fg)]">
          {err}
        </p>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <motion.article
            key={p.id}
            layout
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ delay: 0.05 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
            className="glass-panel group relative overflow-hidden rounded-3xl"
            style={{ transformStyle: 'preserve-3d', perspective: 900 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={projectImagesByTitle[p.title] ?? mediaUrl(p.imageUrl)}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
                style={{
                  background:
                    'linear-gradient(120deg, color-mix(in oklab, var(--accent) 35%, transparent), transparent, color-mix(in oklab, var(--accent2) 35%, transparent))',
                }}
              />
            </div>
            <div className="relative space-y-3 p-6">
              <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--muted)]">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[color:var(--stroke)] px-2 py-0.5 text-[11px] uppercase tracking-wide text-[color:var(--muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {p.projectUrl && (
                  <a
                    href={p.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--stroke)] px-3 py-2 text-sm transition hover:border-[color:color-mix(in_oklab,var(--accent)_55%,transparent)]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View project
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--stroke)] px-3 py-2 text-sm transition hover:border-[color:color-mix(in_oklab,var(--accent2)_55%,transparent)]"
                  >
                    <IconGithub className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
