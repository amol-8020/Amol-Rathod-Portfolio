import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useLoader } from '../../context/LoaderContext'

const links = [
  { id: 'profile', label: 'Profile' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'stats', label: 'Stats' },
  { id: 'contact', label: 'Contact' },
] as const

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function NavBar() {
  const { theme, toggle } = useTheme()
  const { done } = useLoader()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8"
      initial={{ y: -24, opacity: 0 }}
      animate={done ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="glass-panel mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-shadow md:px-6"
        style={
          scrolled
            ? {
                boxShadow:
                  '0 0 0 1px color-mix(in oklab, var(--accent) 22%, transparent), 0 20px 60px -30px color-mix(in oklab, var(--accent2) 35%, transparent)',
              }
            : undefined
        }
      >
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_35%,transparent),color-mix(in_oklab,var(--accent2)_25%,transparent))]">
            <Sparkles className="h-4 w-4 text-[color:var(--fg)]" aria-hidden />
          </span>
          <span className="hidden sm:inline">
            Amol M Rathod<span className="text-gradient">.</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => scrollTo(l.id)}
              className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:color-mix(in_oklab,var(--accent)_10%,transparent)] hover:text-[color:var(--fg)]"
            >
              {l.label}
            </button>
          ))}
          <Link
            to="/dashboard"
            className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:color-mix(in_oklab,var(--accent2)_12%,transparent)] hover:text-[color:var(--fg)]"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ResumeButton />
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] text-[color:var(--fg)] transition hover:border-[color:color-mix(in_oklab,var(--accent)_45%,transparent)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--stroke)] bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)] text-[color:var(--fg)] md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[color:color-mix(in_oklab,var(--bg0)_70%,black)] backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mx-auto flex h-full max-w-md flex-col gap-3 p-6 pt-24">
              <button
                type="button"
                className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--stroke)]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              {links.map((l, i) => (
                <motion.button
                  key={l.id}
                  type="button"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass-panel rounded-2xl px-4 py-4 text-left font-display text-xl"
                  onClick={() => {
                    setOpen(false)
                    scrollTo(l.id)
                  }}
                >
                  {l.label}
                </motion.button>
              ))}
              <Link
                to="/dashboard"
                className="glass-panel rounded-2xl px-4 py-4 text-left font-display text-xl"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function ResumeButton() {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    fetch('/resume.pdf', { method: 'HEAD' })
      .then((r) => setOk(r.ok))
      .catch(() => setOk(false))
  }, [])

  if (ok === false) {
    return (
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="hidden rounded-xl border border-[color:var(--stroke)] px-3 py-2 text-sm text-[color:var(--muted)] transition hover:border-[color:color-mix(in_oklab,var(--accent)_45%,transparent)] hover:text-[color:var(--fg)] md:inline-flex"
      >
        Request CV
      </a>
    )
  }

  return (
    <a
      href="/resume.pdf"
      download
      className="hidden rounded-xl border border-[color:var(--stroke)] px-3 py-2 text-sm text-[color:var(--muted)] transition hover:border-[color:color-mix(in_oklab,var(--accent)_45%,transparent)] hover:text-[color:var(--fg)] md:inline-flex"
    >
      Resume
    </a>
  )
}
