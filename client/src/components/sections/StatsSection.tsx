import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useCountUp } from '../../hooks/useCountUp'
import { useSectionReveal } from '../../hooks/useSectionReveal'
import type { Project } from '../../types/project'

interface StatTile {
  label: string
  value: number
  suffix: string
}

export function StatsSection(): JSX.Element {
  const ref = useSectionReveal<HTMLElement>()
  const [projects, setProjects] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    api
      .get<Project[]>('/api/projects')
      .then((r) => {
        setProjects(Array.isArray(r.data) ? r.data.length : 0)
        setVisible(true)
      })
      .catch(() => {
        setProjects(0)
        setVisible(true)
      })
  }, [])

  const pCount = useCountUp(projects, 1400, visible)
  const sCount = useCountUp(5, 1400, visible)
  const focus = useCountUp(3, 1600, visible)

  const tiles: StatTile[] = [
    { label: 'Projects', value: pCount, suffix: '+' },
    { label: 'Skills', value: sCount, suffix: '+' },
    { label: 'Focus areas', value: focus, suffix: '+' },
  ]

  return (
    <section ref={ref} id="stats" className="relative z-10 mx-auto max-w-6xl px-4 py-24 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-[color:var(--muted)]">STATS</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Progress at a <span className="text-gradient">glance</span>
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
          Live project count from the dashboard with supporting highlights of current skill and interest
          growth.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {(Array.isArray(tiles) ? tiles : []).map((t) => (
          <div key={t.label} className="glass-panel relative overflow-hidden rounded-3xl p-8">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle at center, color-mix(in oklab, var(--accent) 40%, transparent), transparent)',
              }}
            />
            <p className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
              {t.value}
              <span className="text-gradient text-4xl md:text-5xl">{t.suffix}</span>
            </p>
            <p className="mt-3 text-sm text-[color:var(--muted)]">{t.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
