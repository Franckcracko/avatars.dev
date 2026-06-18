import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCcw,
  Sparkles,
  Users,
  Heart,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { getAvatar } from '@/utils/getAvatar'
import { CONFIG_AVATAAARS } from '@/configs/avatar'
import { getRandomName, useAvatarStore } from '@/stores/useAvatarStore'
import { useFavoriteAvatarsStorage } from '@/stores/useFavoriteAvatarsStorage'
import { downloadAvatar } from '@/utils/avatarExport'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { usePageMeta } from '@/hooks/usePageMeta'
import { CardAvatar } from '@/components/CardAvatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const LIMIT = 20

const generateAvatars = () => {
  return Array.from({ length: LIMIT }, () => {
    const id = crypto.randomUUID()
    const seed = id
    const name = getRandomName()
    return {
      id,
      seed,
      name,
      avatar: getAvatar({
        seed,
        configs: { ...CONFIG_AVATAAARS.avataaars.configs_initial, size: 256 }
      }).toDataUriSync()
    }
  })
}

export const Avatars = () => {
  usePageMeta({
    title: 'Galería',
    description:
      'Explora una galería de 20 avatares generados al azar. Filtra por nombre, guarda tus favoritos o úsalos como base para personalizarlos en el editor.',
    path: '/avatars',
    keywords: [
      'galería de avatares',
      'avatares al azar',
      'random avatars',
      'avatares favoritos',
      'filtro de avatares'
    ]
  })
  const [avatars, setAvatars] = useState(() => generateAvatars())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'favorites'
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const setCurrentAvatar = useAvatarStore((s) => s.loadAvatar)
  const favorites = useFavoriteAvatarsStorage((s) => s.favorites)
  const format = usePreferencesStore((s) => s.downloadFormat)
  const backgroundColor = usePreferencesStore((s) => s.backgroundColor)
  const avatarSize = usePreferencesStore((s) => s.avatarSize)

  const visible = useMemo(() => {
    if (filter === 'favorites') {
      let list = favorites.map((f) => ({
        id: f.id,
        seed: f.seed || f.id,
        name: f.name,
        avatar: f.avatar,
        configs: f.configs
      }))
      if (query.trim()) {
        const q = query.toLowerCase()
        list = list.filter((a) => a.name.toLowerCase().includes(q))
      }
      return list
    }
    let list = avatars
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((a) => a.name.toLowerCase().includes(q))
    }
    return list
  }, [avatars, filter, favorites, query])

  const handleRefresh = () => {
    setLoading(true)
    // simulate network for nicer UX
    setTimeout(() => {
      setAvatars(generateAvatars())
      setLoading(false)
      toast.success('Galería actualizada', {
        description: 'Hemos generado nuevos avatares para ti.'
      })
    }, 350)
  }

  const handleUseAvatar = (a) => {
    setCurrentAvatar({ seed: a.seed, name: a.name })
    navigate('/editar')
    toast.success(`${a.name} está listo`, {
      description: 'Personalízalo en el editor.'
    })
  }

  const handleDownload = (a) => {
    downloadAvatar(a.seed, CONFIG_AVATAAARS.avataaars.configs_initial, {
      name: a.name,
      format,
      backgroundColor,
      size: avatarSize
    })
    toast.success('Descarga iniciada')
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Users className="size-3 text-primary" aria-hidden />
            Galería
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Explora una <span className="text-gradient-brand">galería</span>{' '}
            de personajes
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {LIMIT} avatares generados al azar. Filtra por nombre, guarda tus
            favoritos o úsalos como base para editarlos.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleRefresh}
          disabled={loading || filter === 'favorites'}
          size="lg"
          className="rounded-full shadow-md shadow-primary/20"
        >
          <RefreshCcw
            data-icon="inline-start"
            className={cn(loading && 'animate-spin')}
            aria-hidden
          />
          {loading ? 'Generando…' : 'Generar nuevos'}
        </Button>
      </header>

      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Filtros de galería"
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre…"
              className="pl-9"
              aria-label="Buscar avatares por nombre"
            />
          </div>

          <div
            role="group"
            aria-label="Filtro de favoritos"
            className="inline-flex items-center rounded-full border border-border/60 bg-card p-1 shadow-sm"
          >
            <FilterChip
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              label={`Todos (${avatars.length})`}
            />
            <FilterChip
              active={filter === 'favorites'}
              onClick={() => setFilter('favorites')}
              label={`Favoritos (${favorites.length})`}
              icon={Heart}
            />
          </div>
        </div>

        <Link
          to="/preferencias"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Ver mis favoritos
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      {/* Grid */}
      {loading
        ? (
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
          aria-busy="true"
          aria-label="Cargando avatares"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-3"
            >
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-7 w-full" />
            </div>
          ))}
        </div>
          )
        : visible.length === 0
          ? (
        <Empty className="border border-border/60 bg-card py-16">
          <EmptyMedia variant="icon">
            <Sparkles />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>
              {filter === 'favorites' && !query.trim()
                ? 'Sin favoritos aún'
                : 'Sin resultados'}
            </EmptyTitle>
            <EmptyDescription>
              {filter === 'favorites' && !query.trim()
                ? 'Guarda tu primer avatar tocando el corazón en la galería o desde el editor.'
                : query.trim()
                  ? `No encontramos avatares que coincidan con "${query}".`
                  : 'Aún no tienes favoritos en esta tanda. Toca el corazón para guardar.'}
            </EmptyDescription>
          </EmptyHeader>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setQuery('')
              setFilter('all')
            }}
          >
            Limpiar filtros
          </Button>
        </Empty>
            )
          : (
        <ul
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
          aria-label={`Galería de ${visible.length} avatares`}
        >
          {visible.map((a) => (
            <li key={a.id}>
              <CardAvatar
                avatar={a.avatar}
                name={a.name}
                id={a.id}
                seed={a.seed}
                showUseButton
                onUse={() => handleUseAvatar(a)}
                onDownload={() => handleDownload(a)}
              />
            </li>
          ))}
        </ul>
            )}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {visible.length} avatares visibles
      </div>

      {!loading && visible.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center">
          <Badge variant="secondary">
            {filter === 'favorites'
              ? `${visible.length} favorito${visible.length === 1 ? '' : 's'}`
              : `${visible.length} de ${avatars.length} avatares`}
          </Badge>
          {filter === 'favorites' && (
            <Badge variant="outline">Filtrando favoritos</Badge>
          )}
          {query.trim() && (
            <Badge variant="outline">Búsqueda: “{query}”</Badge>
          )}
        </div>
      )}
    </div>
  )
}

const FilterChip = ({ active, onClick, label, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    )}
  >
    {Icon && <Icon className="size-3" aria-hidden />}
    {label}
  </button>
)
