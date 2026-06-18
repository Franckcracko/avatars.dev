import { Pencil, Download, Heart, RefreshCcw, Sparkles, Copy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RouletteAvatar } from '@/components/Roulette/RouletteAvatar'
import { ConfettiBurst } from '@/components/Confetti/ConfettiBurst'
import { ButtonFavorite } from '@/components/ButtonFavorite'
import { AvatarMarquee } from '@/components/AvatarMarquee'
import { useAvatarStore } from '@/stores/useAvatarStore'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { usePageMeta } from '@/hooks/usePageMeta'
import { downloadAvatar, copyAvatarToClipboard } from '@/utils/avatarExport'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'Ruleta mágica',
    description:
      'Gira la ruleta y deja que el destino elija tu próximo avatar en segundos.',
    icon: Sparkles,
    tone: 'primary'
  },
  {
    title: 'Personalización total',
    description:
      'Cambia peinado, ojos, ropa, accesorios y más con un solo clic.',
    icon: Pencil,
    tone: 'accent'
  },
  {
    title: 'Tus favoritos',
    description:
      'Guarda los avatares que más te gusten y reutilízalos cuando quieras.',
    icon: Heart,
    tone: 'primary'
  },
  {
    title: 'Descarga libre',
    description:
      'Exporta en SVG o PNG, listo para redes sociales, proyectos y más.',
    icon: Download,
    tone: 'accent'
  }
]

const FeatureCard = ({ title, description, icon: Icon, tone, delay = 0 }) => (
  <article
    className={cn(
      'group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
      'animate-fade-up'
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      aria-hidden
      className={cn(
        'grid size-10 place-items-center rounded-xl ring-1 ring-foreground/10 transition-transform group-hover:scale-110',
        tone === 'primary'
          ? 'bg-primary/10 text-primary'
          : 'bg-accent/10 text-accent'
      )}
    >
      <Icon />
    </div>
    <h3 className="font-display text-base font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </article>
)

export function Home () {
  usePageMeta({
    title: undefined,
    description:
      'Genera, personaliza y descarga avatares únicos en segundos. Ruleta mágica, editor con más de 100 rasgos, paletas personalizables y exportación en SVG, PNG o JPG. 100% gratis y sin registro.',
    path: '/',
    keywords: [
      'generador de avatares',
      'avatar generator',
      'ruleta mágica',
      'avataaars',
      'crear avatar',
      'avatar personalizado',
      'random avatar',
      'profile picture',
      'pfp maker',
      'avatares gratis',
      'discord avatar',
      'twitter avatar',
      'avatar svg',
      'avatar png'
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://avatars.dev/#webpage',
      url: 'https://avatars.dev/',
      name: 'Avatars.Dev — Generador de avatares con ruleta mágica',
      isPartOf: { '@id': 'https://avatars.dev/#website' },
      about: { '@id': 'https://avatars.dev/#organization' },
      inLanguage: 'es-ES',
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://avatars.dev/og-image.svg',
        width: 1200,
        height: 630
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        xpath: ['/html/head/title', '/html/head/meta[@name="description"]/@content']
      }
    }
  })

  const seed = useAvatarStore((state) => state.seed)
  const name = useAvatarStore((state) => state.name)
  const configs = useAvatarStore((state) => state.configs)
  const shuffleAll = useAvatarStore((state) => state.shuffleAll)

  const backgroundColor = usePreferencesStore((s) => s.backgroundColor)
  const format = usePreferencesStore((s) => s.downloadFormat)
  const avatarSize = usePreferencesStore((s) => s.avatarSize)
  const useAvatarNameForDownload = usePreferencesStore(
    (s) => s.useAvatarNameForDownload
  )
  const showConfetti = usePreferencesStore((s) => s.showConfetti)
  const rouletteDuration = usePreferencesStore((s) => s.rouletteDuration)
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion)

  const [spinning, setSpinning] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [revealedName, setRevealedName] = useState(name)
  const [nameVisible, setNameVisible] = useState(true)

  useEffect(() => {
    if (spinning) {
      setNameVisible(false)
    } else {
      setRevealedName(name)
    }
  }, [spinning, name])

  const handleSpin = () => {
    if (spinning) return
    shuffleAll()
    setSpinning(true)
  }

  const handleSettle = () => {
    setSpinning(false)
    setNameVisible(true)
    if (showConfetti) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 2400)
    }
    toast.success('¡Nuevo avatar generado!', {
      description: `${name} está listo para usar.`
    })
  }

  const handleDownload = async () => {
    try {
      await downloadAvatar(seed, configs, {
        name,
        format,
        useName: useAvatarNameForDownload,
        backgroundColor,
        size: avatarSize
      })
      toast.success('Descarga iniciada', {
        description: `Formato: ${format.toUpperCase()}`
      })
    } catch (err) {
      toast.error('No se pudo descargar', { description: err.message })
    }
  }

  const handleCopy = async () => {
    try {
      await copyAvatarToClipboard(seed, configs, {
        backgroundColor,
        size: avatarSize
      })
      toast.success('Copiado al portapapeles', {
        description: 'Pega la imagen con Ctrl + V'
      })
    } catch (err) {
      toast.error('No se pudo copiar', { description: err.message })
    }
  }

  return (
    <div className="relative">
      {/* HERO */}
      <section
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:pb-20 lg:pt-24"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm animate-fade-up"
            style={{ animationDelay: '40ms' }}
          >
            <Sparkles className="size-3 text-primary" aria-hidden />
            Nuevo · Ruleta interactiva
          </span>
          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            Crea tu avatar{' '}
            <span className="text-gradient-brand">único</span>
            <br className="hidden sm:block" /> en un giro.
          </h1>
          <p
            className="mt-2 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg animate-fade-up"
            style={{ animationDelay: '160ms' }}
          >
            Pulsa <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-xs shadow-sm">generar</kbd>{' '}
            y deja que la ruleta decida tu próximo personaje.
            Personalízalo, guárdalo y descárgalo cuando quieras.
          </p>
        </div>

        {/* ROULETTE */}
        <div
          className="mt-10 flex flex-col items-center gap-6 animate-fade-up sm:mt-14"
          style={{ animationDelay: '240ms' }}
        >
          <div className="relative">
            <ConfettiBurst active={confetti} reduceMotion={reduceMotion} />
            <RouletteAvatar
              finalSeed={seed}
              configs={configs}
              size="xl"
              spinning={spinning}
              duration={rouletteDuration}
              reduceMotion={reduceMotion}
              onSettle={handleSettle}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl"
            />
          </div>

          <div
            className="text-center"
            aria-live="polite"
          >
            <p
              key={nameVisible ? 'visible' : 'spinning'}
              className={cn(
                'font-display text-2xl font-bold text-foreground sm:text-3xl transition-all duration-300',
                nameVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-2 blur-sm'
              )}
            >
              {nameVisible ? revealedName : '••••••'}
            </p>
            <p
              className={cn(
                'text-xs text-muted-foreground sm:text-sm transition-opacity duration-200',
                !nameVisible && 'opacity-60'
              )}
            >
              {spinning
                ? 'Generando avatar…'
                : 'Avatar generado · listo para usar'}
            </p>
          </div>

          {/* BIG CTA */}
          <Button
            type="button"
            size="lg"
            onClick={handleSpin}
            disabled={spinning}
            className="h-12 gap-2 rounded-full px-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 disabled:scale-100"
            aria-label={spinning ? 'Generando avatar...' : 'Generar nuevo avatar aleatorio'}
          >
            <RefreshCcw
              data-icon="inline-start"
              className={cn(spinning && 'animate-spin')}
              aria-hidden
            />
            {spinning ? 'Generando…' : 'Generar nuevo avatar'}
          </Button>

          {/* SECONDARY ACTIONS */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/editar">
                <Pencil data-icon="inline-start" />
                Personalizar
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleDownload}
            >
              <Download data-icon="inline-start" />
              Descargar {format.toUpperCase()}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleCopy}
            >
              <Copy data-icon="inline-start" />
              Copiar
            </Button>
            <ButtonFavorite variant="outline" size="sm" className="rounded-full" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        aria-labelledby="features-heading"
        className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24"
      >
        <div className="mb-8 text-center sm:mb-10">
          <h2
            id="features-heading"
            className="font-display text-2xl font-bold sm:text-3xl"
          >
            Todo lo que necesitas para destacar
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Diseñado para que crear tu avatar sea rápido, divertido y
            memorable.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <section
        aria-label="Avatares en movimiento"
        className="space-y-3 pb-16 sm:pb-20"
      >
        <AvatarMarquee count={20} speed={50} />
        <AvatarMarquee count={20} speed={60} reverse />
      </section>
    </div>
  )
}
