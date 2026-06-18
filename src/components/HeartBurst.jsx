import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const PARTICLES = 8

const buildParticles = () => {
  return Array.from({ length: PARTICLES }, (_, i) => {
    const angle = (i / PARTICLES) * Math.PI * 2 + Math.random() * 0.4
    const distance = 30 + Math.random() * 30
    return {
      id: i,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rot: (Math.random() * 60 - 30).toFixed(0),
      delay: Math.floor(Math.random() * 80)
    }
  })
}

export const HeartBurst = ({ active }) => {
  const [bumpKey, setBumpKey] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const [particles, setParticles] = useState(() => buildParticles())

  useEffect(() => {
    if (!active) return
    setBumpKey((k) => k + 1)
    setParticles(buildParticles())
    setShowParticles(true)
    const t = setTimeout(() => setShowParticles(false), 700)
    return () => clearTimeout(t)
  }, [active])

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 grid place-items-center"
    >
      {showParticles &&
        particles.map((p) => (
          <span
            key={`${bumpKey}-${p.id}`}
            className="absolute text-destructive animate-heart-burst"
            style={{
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
              animationDelay: `${p.delay}ms`
            }}
          >
            <Heart className="size-3 fill-current" />
          </span>
        ))}
    </span>
  )
}

export const HeartBounce = ({ trigger, children, className }) => {
  const [key, setKey] = useState(0)
  useEffect(() => {
    if (trigger > 0) setKey((k) => k + 1)
  }, [trigger])
  return (
    <span
      key={key}
      className={cn('inline-flex animate-heart-bounce', className)}
    >
      {children}
    </span>
  )
}
