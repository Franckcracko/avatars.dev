import { useEffect, useMemo, useRef, useState } from 'react'
import { getAvatar } from '@/utils/getAvatar'
import { CONFIG_AVATAAARS } from '@/configs/avatar'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const STRIP_LENGTH = 28
const FRAME_HEIGHT = 100
const FAST_TICK_MS = 65
const DEFAULT_ROULETTE_MS = 1500
const FAST_PHASE_MS = 800

const buildStripAsync = (finalUri) => {
  return new Promise((resolve) => {
    const cells = []
    for (let i = 0; i < STRIP_LENGTH - 1; i++) {
      const seed = crypto.randomUUID()
      const avatar = getAvatar({
        seed,
        configs: { ...CONFIG_AVATAAARS.avataaars.configs_initial, size: 128 }
      })
      cells.push(avatar.toDataUriSync())
    }
    cells.push(finalUri)
    resolve(cells)
  })
}

export function RouletteAvatar ({
  finalSeed,
  configs,
  size = 'lg',
  spinning,
  duration = DEFAULT_ROULETTE_MS,
  reduceMotion = false,
  className = '',
  onSettle
}) {
  const finalUri = useMemo(() => {
    if (!finalSeed) return ''
    return getAvatar({
      seed: finalSeed,
      configs: { ...configs, size: 256 }
    }).toDataUriSync()
  }, [finalSeed, configs])

  // When reduce motion is on, collapse the whole animation to a single tick.
  const effectiveDuration = reduceMotion ? 120 : Math.max(120, duration)
  const effectiveFastPhase = reduceMotion ? 60 : FAST_PHASE_MS
  const effectiveTick = reduceMotion ? 60 : FAST_TICK_MS

  const [strip, setStrip] = useState([finalUri])
  const [previewIndex, setPreviewIndex] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [ready, setReady] = useState(false)
  const intervalRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    if (finalUri) {
      buildStripAsync(finalUri).then((cells) => {
        if (cancelled) return
        setStrip(cells)
        setPreviewIndex(cells.length - 1)
        setReady(true)
      })
    }
    return () => {
      cancelled = true
    }
  }, [finalUri])

  useEffect(() => {
    if (!spinning || !ready) return
    setPhase('fast')
    setPreviewIndex(0)
    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timerRef.current)
    }
  }, [spinning, ready])

  useEffect(() => {
    if (phase !== 'fast') return
    intervalRef.current = setInterval(() => {
      setPreviewIndex((i) => (i + 1) % (STRIP_LENGTH - 1))
    }, effectiveTick)
    timerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      setPhase('slow')
      setPreviewIndex(STRIP_LENGTH - 1)
    }, effectiveFastPhase)
    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timerRef.current)
    }
  }, [phase, effectiveTick, effectiveFastPhase])

  useEffect(() => {
    if (phase !== 'slow') return
    const slowMs = Math.max(0, effectiveDuration - effectiveFastPhase)
    timerRef.current = setTimeout(() => {
      setPhase('done')
      onSettle?.()
    }, slowMs)
    return () => clearTimeout(timerRef.current)
  }, [phase, effectiveDuration, effectiveFastPhase, onSettle])

  const visibleIndex = phase === 'fast' ? previewIndex : STRIP_LENGTH - 1
  const slowMs = Math.max(0, effectiveDuration - effectiveFastPhase)

  const sizeClasses = {
    sm: 'size-24 sm:size-28',
    md: 'size-40 sm:size-48',
    lg: 'size-56 sm:size-64 md:size-72',
    xl: 'size-72 sm:size-80'
  }

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 ring-glow',
        sizeClasses[size] || sizeClasses.lg,
        className
      )}
      role="img"
      aria-label={spinning ? 'Generando nuevo avatar' : 'Avatar generado'}
      aria-busy={spinning || !ready}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-card to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-card to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1/2 z-20 -translate-y-1/2 rounded-xl ring-2 ring-accent/80"
      />

      {!ready
        ? <Skeleton className="absolute inset-0 rounded-2xl" />
        : (
          <div
            className="absolute inset-0 transition-transform"
            style={{
              transform: `translateY(-${visibleIndex * 100}%)`,
              transitionDuration: phase === 'slow' ? `${slowMs}ms` : '60ms',
              transitionTimingFunction:
                phase === 'slow'
                  ? 'cubic-bezier(0.15, 0.85, 0.25, 1)'
                  : 'linear'
            }}
          >
            {strip.map((uri, i) => (
              <div
                key={i}
                className="grid place-items-center"
                style={{ height: `${FRAME_HEIGHT}%` }}
              >
                <img
                  src={uri}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-contain p-2"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          )}

      {phase === 'done' && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 animate-pop"
        >
          <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/60 ring-offset-2 ring-offset-card" />
        </div>
      )}
    </div>
  )
}
