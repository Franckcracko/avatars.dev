import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function Logo ({ to = '/', compact = false, className = '' }) {
  return (
    <Link
      to={to}
      aria-label="Avatars.Dev — Inicio"
      className={`group inline-flex items-center gap-2 outline-none ${className}`}
    >
      <span
        aria-hidden
        className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm ring-1 ring-foreground/10 transition-transform group-hover:rotate-6 group-hover:scale-105"
      >
        <Sparkles className="size-4 transition-transform group-hover:scale-110" />
        <span className="pointer-events-none absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Avatars<span className="text-gradient-brand">.dev</span>
        </span>
      )}
    </Link>
  )
}
