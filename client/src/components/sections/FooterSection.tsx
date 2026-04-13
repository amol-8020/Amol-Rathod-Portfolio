import { Link } from 'react-router-dom'
import { IconGithub, IconInstagram, IconLinkedin } from '../icons/BrandIcons'

export function FooterSection() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
      <div className="glass-panel flex flex-col items-start justify-between gap-6 rounded-3xl px-6 py-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg font-semibold">
            Amol Manna Rathod<span className="text-gradient">.</span>
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Final Year Computer Engineering Student | Aspiring Game Developer | GUI Design Enthusiast
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <a
            href="https://www.instagram.com/mr__amol89"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--stroke)] text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
            aria-label="Instagram"
          >
            <IconInstagram className="h-5 w-5" />
          </a>
          <Link
            to="/dashboard"
            className="rounded-xl border border-[color:var(--stroke)] px-4 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
          >
            Dashboard
          </Link>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-[color:var(--muted)]">© 2026 Amol Manna Rathod. All rights reserved.</p>
    </footer>
  )
}
