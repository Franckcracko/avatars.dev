import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const COLORS = [
  'oklch(0.55 0.13 192)',
  'oklch(0.7 0.18 25)',
  'oklch(0.65 0.16 152)',
  'oklch(0.7 0.18 320)',
  'oklch(0.7 0.18 80)'
]

const random = (min, max) => Math.random() * (max - min) + min

const buildPiece = (i) => ({
  id: i,
  x: random(0, 100),
  y: -10,
  rot: random(0, 360),
  delay: random(0, 200),
  color: COLORS[i % COLORS.length],
  size: random(6, 12),
  drift: random(-60, 60),
  duration: random(1200, 2000)
})

export function ConfettiBurst ({
  active,
  pieces = 60,
  reduceMotion = false,
  className = ''
}) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!active) return
    if (reduceMotion) {
      // Skip the burst when the user wants less motion.
      setItems([])
      return
    }
    const next = Array.from({ length: pieces }, (_, i) => buildPiece(i))
    setItems(next)
    const t = setTimeout(() => setItems([]), 2400)
    return () => clearTimeout(t)
  }, [active, pieces, reduceMotion])

  if (items.length === 0) return null

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 z-40 overflow-hidden',
        className
      )}
    >
      {items.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.x}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall ${p.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}ms forwards`,
            '--drift': `${p.drift}px`
          }}
          className="absolute rounded-sm"
        />
      ))}
    </div>
  )
}
