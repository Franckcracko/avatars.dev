import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Palette,
  Download,
  Sparkles,
  Heart,
  Database,
  AlertTriangle,
  Plus,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Settings,
  Search,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia
} from '@/components/ui/empty'
import { useFavoriteAvatarsStorage } from '@/stores/useFavoriteAvatarsStorage'
import { usePreferencesStore, ACCENT_PRESETS } from '@/stores/usePreferencesStore'
import { useTheme } from '@/components/theme/ThemeProvider'
import { usePageMeta } from '@/hooks/usePageMeta'
import { CardAvatar } from '@/components/CardAvatar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  CLOTHING_COLORS_DEFAULT,
  HAIR_COLORS,
  SKIN_COLORS
} from '@/configs/colors'

const PRESET_COLORS = [
  '#0d9488',
  '#fb7185',
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#a855f7',
  '#ec4899',
  '#facc15',
  '#0ea5e9',
  '#ef4444',
  '#ffffff',
  '#000000'
]

const SECTIONS = [
  {
    id: 'appearance',
    label: 'Apariencia',
    short: 'Tema y estilo',
    icon: Palette,
    description: 'Tema, forma y color de acento'
  },
  {
    id: 'export',
    label: 'Exportar',
    short: 'Formato y descarga',
    icon: Download,
    description: 'Formato, tamaño y fondo de las descargas'
  },
  {
    id: 'animation',
    label: 'Animación',
    short: 'Ruleta y confeti',
    icon: Sparkles,
    description: 'Efectos visuales al generar'
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    short: 'Tus avatares guardados',
    icon: Heart,
    description: 'Tu colección personal'
  },
  {
    id: 'data',
    label: 'Datos',
    short: 'Colores y zona peligrosa',
    icon: Database,
    description: 'Paleta guardada y reset'
  }
]

const SectionNav = ({ active, onSelect, favoritesCount, customColorCount }) => (
  <nav
    aria-label="Secciones de preferencias"
    className="space-y-1"
  >
    {SECTIONS.map((s) => {
      const Icon = s.icon
      const count =
        s.id === 'favorites'
          ? favoritesCount
          : s.id === 'data'
            ? customColorCount
            : null
      return (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          aria-current={active === s.id ? 'true' : undefined}
          className={cn(
            'group/nav flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all',
            active === s.id
              ? 'border-primary/30 bg-primary/10 text-primary shadow-sm'
              : 'border-transparent text-foreground/80 hover:border-border/60 hover:bg-muted hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-lg ring-1 ring-foreground/10 transition-colors',
              active === s.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover/nav:bg-card'
            )}
          >
            <Icon className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span>{s.label}</span>
              {count !== null && count > 0 && (
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  {count}
                </Badge>
              )}
            </div>
            <p className="text-xs font-normal text-muted-foreground">
              {s.short}
            </p>
          </div>
          <ChevronRight
            className={cn(
              'size-3.5 shrink-0 text-muted-foreground transition-transform',
              active === s.id && 'translate-x-0.5 text-primary'
            )}
            aria-hidden
          />
        </button>
      )
    })}
  </nav>
)

const ThemeCard = ({ value, label, icon: Icon, current, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    aria-pressed={current === value}
    className={cn(
      'group/theme relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md',
      current === value
        ? 'border-primary bg-primary/5 shadow-md'
        : 'border-border/60 bg-card hover:border-primary/40'
    )}
  >
    <Icon
      className={cn(
        'size-6 transition-colors',
        current === value ? 'text-primary' : 'text-muted-foreground'
      )}
      aria-hidden
 />
    <span className="text-sm font-medium">{label}</span>
    {current === value && (
      <span
        aria-hidden
        className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
      >
        ✓
      </span>
    )}
  </button>
)

const SectionHeader = ({ icon: Icon, title, description, accent = 'primary' }) => (
  <div className="mb-6">
    <div className="mb-2 flex items-center gap-2">
      <div
        className={cn(
          'grid size-9 place-items-center rounded-lg ring-1 ring-foreground/10',
          accent === 'primary'
            ? 'bg-primary/10 text-primary'
            : 'bg-accent/10 text-accent'
        )}
      >
        <Icon className="size-4" aria-hidden />
      </div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
    </div>
    {description && (
      <p className="text-sm text-muted-foreground">{description}</p>
    )}
  </div>
)

const FieldRow = ({ children, label, description, htmlFor, badge }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
    <div className="space-y-0.5 sm:max-w-md">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
        {badge !== undefined && (
          <Badge variant="secondary" className="ml-2 text-[10px]">
            {badge}
          </Badge>
        )}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
)

const Divider = () => <div className="border-t border-border/60" />

const SettingsCard = ({ title, description, children, footer }) => (
  <Card className="gap-0 p-0">
    {(title || description) && (
      <CardHeader className="border-b border-border/60 px-5 py-4">
        {title && <CardTitle className="text-base">{title}</CardTitle>}
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
    )}
    <CardContent className="space-y-5 p-5">{children}</CardContent>
    {footer && (
      <div className="border-t border-border/60 bg-muted/30 px-5 py-3">
        {footer}
      </div>
    )}
  </Card>
)

const AppearanceSection = () => {
  const preferences = usePreferencesStore()
  const { theme, setTheme } = useTheme()
  const accentColor = preferences.accentColor

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Palette}
        title="Apariencia"
        description="Personaliza cómo se ve la app en general."
        accent="primary"
      />

      <SettingsCard
        title="Tema"
        description="Cambia entre modo claro, oscuro o sigue el sistema operativo."
      >
        <div
          className="grid grid-cols-3 gap-3"
          role="radiogroup"
          aria-label="Tema de la aplicación"
        >
          <ThemeCard
            value="light"
            label="Claro"
            icon={Sun}
            current={theme}
            onSelect={setTheme}
          />
          <ThemeCard
            value="dark"
            label="Oscuro"
            icon={Moon}
            current={theme}
            onSelect={setTheme}
          />
          <ThemeCard
            value="system"
            label="Sistema"
            icon={Monitor}
            current={theme}
            onSelect={setTheme}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Estilo del avatar"
        description="Define cómo se muestran tus avatares en la galería, favoritos y vista previa."
      >
        <FieldRow
          htmlFor="avatar-shape"
          label="Forma"
          description="Cambia la silueta del contenedor del avatar en las tarjetas."
        >
          <Select
            value={preferences.avatarStyle}
            onValueChange={(v) => preferences.setPreference('avatarStyle', v)}
          >
            <SelectTrigger id="avatar-shape" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="circle">Círculo</SelectItem>
              <SelectItem value="square">Cuadrado</SelectItem>
              <SelectItem value="rounded">Redondeado</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <Divider />
        <div className="space-y-2">
          <Label
            id="accent-color-label"
            className="text-sm font-semibold"
          >
            Color de acento
          </Label>
          <p className="text-xs text-muted-foreground">
            Cambia el color principal de botones, indicadores y elementos de marca.
          </p>
          <div
            className="flex flex-wrap gap-1.5 pt-1"
            role="radiogroup"
            aria-labelledby="accent-color-label"
          >
            {Object.values(ACCENT_PRESETS).map((preset) => {
              const active = accentColor === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={preset.label}
                  title={preset.label}
                  onClick={() => preferences.setPreference('accentColor', preset.id)}
                  className={cn(
                    'size-8 rounded-lg border-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    active
                      ? 'border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'border-border/60'
                  )}
                  style={{ background: preset.swatch }}
                />
              )
            })}
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}

const ExportSection = () => {
  const preferences = usePreferencesStore()

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Download}
        title="Exportar"
        description="Elige cómo se descargan tus avatares al guardarlos."
        accent="accent"
      />

      <SettingsCard
        title="Formato de descarga"
        description="SVG es vectorial, PNG mantiene transparencia, JPG es más ligero."
      >
        <FieldRow
          htmlFor="format"
          label="Formato"
        >
          <Select
            value={preferences.downloadFormat}
            onValueChange={(v) =>
              preferences.setPreference('downloadFormat', v)
            }
          >
            <SelectTrigger id="format" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">SVG — vectorial</SelectItem>
              <SelectItem value="png">PNG — con transparencia</SelectItem>
              <SelectItem value="jpg">JPG — fondo sólido</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <Divider />
        <FieldRow
          htmlFor="use-name"
          label="Usar nombre del avatar al descargar"
          description="Activa esta opción para guardar el archivo con el nombre del personaje (ej: mateo.svg). Si la desactivas, el archivo se llamará avatar.svg."
        >
          <Switch
            id="use-name"
            checked={preferences.useAvatarNameForDownload}
            onCheckedChange={(v) =>
              preferences.setPreference('useAvatarNameForDownload', v)
            }
          />
        </FieldRow>
        <Divider />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="size" className="text-sm font-semibold">
              Tamaño de descarga
            </Label>
            <Badge variant="secondary">{preferences.avatarSize}px</Badge>
          </div>
          <Slider
            id="size"
            min={64}
            max={1024}
            step={32}
            value={[preferences.avatarSize]}
            onValueChange={([v]) => preferences.setPreference('avatarSize', v)}
            aria-valuetext={`${preferences.avatarSize} píxeles`}
            aria-label="Tamaño de descarga en píxeles"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>64px (favicon)</span>
            <span>512px (redes)</span>
            <span>1024px (HD)</span>
          </div>
        </div>
        <Divider />
        <div className="space-y-2">
          <Label
            id="bg-color-label"
            className="text-sm font-semibold"
          >
            Color de fondo
          </Label>
          <p className="text-xs text-muted-foreground">
            Aplica un fondo a las descargas (no afecta al avatar en pantalla).
          </p>
          <div
            className="flex flex-wrap items-center gap-1.5 pt-1"
            role="radiogroup"
            aria-labelledby="bg-color-label"
          >
            <button
              type="button"
              role="radio"
              aria-checked={preferences.backgroundColor === 'transparent'}
              onClick={() =>
                preferences.setPreference('backgroundColor', 'transparent')
              }
              aria-label="Sin fondo (transparente)"
              title="Sin fondo"
              className={cn(
                'grid size-8 place-items-center rounded-lg border-2 text-xs font-bold',
                preferences.backgroundColor === 'transparent'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/60 bg-card text-muted-foreground'
              )}
            >
              <span aria-hidden>∅</span>
            </button>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={preferences.backgroundColor === c}
                onClick={() => preferences.setPreference('backgroundColor', c)}
                aria-label={`Color de fondo ${c}`}
                title={c}
                className={cn(
                  'size-8 rounded-lg border-2 transition-transform hover:scale-110',
                  preferences.backgroundColor === c
                    ? 'border-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'border-border/60'
                )}
                style={{ background: c }}
              />
            ))}
            <label
              className="grid size-8 cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-border/60 bg-card focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
              title="Color personalizado"
            >
              <span className="sr-only">Color personalizado</span>
              <input
                type="color"
                value={
                  preferences.backgroundColor === 'transparent'
                    ? '#ffffff'
                    : preferences.backgroundColor
                }
                onChange={(e) =>
                  preferences.setPreference('backgroundColor', e.target.value)
                }
                className="size-full cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}

const AnimationSection = () => {
  const preferences = usePreferencesStore()

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Sparkles}
        title="Animación"
        description="Controla los efectos visuales al generar un avatar."
        accent="primary"
      />

      <SettingsCard
        title="Efectos al generar"
        description="Personaliza la ruleta, el confeti y el movimiento."
      >
        <FieldRow
          htmlFor="confetti"
          label="Celebrar con confeti"
          description="Animación de confeti al generar un nuevo avatar."
        >
          <Switch
            id="confetti"
            checked={preferences.showConfetti}
            onCheckedChange={(v) =>
              preferences.setPreference('showConfetti', v)
            }
          />
        </FieldRow>
        <Divider />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="roulette-speed" className="text-sm font-semibold">
              Duración de la ruleta
            </Label>
            <Badge variant="secondary">
              {(preferences.rouletteDuration / 1000).toFixed(1)}s
            </Badge>
          </div>
          <Slider
            id="roulette-speed"
            min={400}
            max={2400}
            step={200}
            value={[preferences.rouletteDuration]}
            onValueChange={([v]) =>
              preferences.setPreference('rouletteDuration', v)
            }
            aria-valuetext={`${(preferences.rouletteDuration / 1000).toFixed(1)} segundos`}
            aria-label="Duración de la ruleta en segundos"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Rápida (0.4s)</span>
            <span>Media (1.4s)</span>
            <span>Lenta (2.4s)</span>
          </div>
        </div>
        <Divider />
        <FieldRow
          htmlFor="reduce-motion"
          label="Reducir movimiento"
          description="Desactiva animaciones largas para mayor comodidad."
        >
          <Switch
            id="reduce-motion"
            checked={preferences.reduceMotion}
            onCheckedChange={(v) =>
              preferences.setPreference('reduceMotion', v)
            }
          />
        </FieldRow>
      </SettingsCard>
    </div>
  )
}

const FavoritesSection = () => {
  const favorites = useFavoriteAvatarsStorage((s) => s.favorites)
  const clearFavorites = useFavoriteAvatarsStorage((s) => s.clearFavorites)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    if (!query.trim()) return favorites
    const q = query.toLowerCase()
    return favorites.filter((f) => f.name.toLowerCase().includes(q))
  }, [favorites, query])

  const handleClearFavorites = () => {
    clearFavorites()
    toast.success('Favoritos eliminados')
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Heart}
        title="Favoritos"
        description="Tu colección personal de avatares guardados."
        accent="accent"
      />

      <SettingsCard
        title="Avatares guardados"
        description={`${favorites.length} avatar${favorites.length === 1 ? '' : 'es'} en tu colección.`}
        footer={
          favorites.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Los favoritos se guardan en este navegador.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 data-icon="inline-start" />
                    Eliminar todos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Eliminar todos los favoritos?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminarán{' '}
                      {favorites.length} avatares de tu colección.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearFavorites}>
                      Sí, eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        }
      >
        {favorites.length === 0
          ? (
          <Empty className="border-dashed bg-transparent py-10">
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Sin favoritos todavía</EmptyTitle>
              <EmptyDescription>
                Toca el corazón en cualquier avatar para guardarlo aquí.
              </EmptyDescription>
            </EmptyHeader>
            <Button asChild>
              <Link to="/avatars">
                <ExternalLink data-icon="inline-start" />
                Explorar la galería
              </Link>
            </Button>
          </Empty>
            )
          : (
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en favoritos…"
                className="pl-9"
              />
            </div>
            {visible.length === 0
              ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Sin resultados para &ldquo;{query}&rdquo;.
                </p>
                )
              : (
                <ul
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                  aria-label={`${visible.length} avatares favoritos`}
                >
                  {visible.map((f) => (
                    <li key={f.id}>
                      <CardAvatar
                        avatar={f.avatar}
                        name={f.name}
                        id={f.id}
                      />
                    </li>
                  ))}
                </ul>
                )}
          </>
            )}
      </SettingsCard>
    </div>
  )
}

const DataSection = () => {
  const preferences = usePreferencesStore()
  const customColors = usePreferencesStore((s) => s.customColors)
  const addCustomColor = usePreferencesStore((s) => s.addCustomColor)
  const removeCustomColor = usePreferencesStore((s) => s.removeCustomColor)
  const clearCustomColors = usePreferencesStore((s) => s.clearCustomColors)

  const [draft, setDraft] = useState({
    skin: '#3b82f6',
    hair: '#a855f7',
    clothing: '#22c55e'
  })

  const allCustom = useMemo(
    () => [
      ...(customColors.skinColor || []),
      ...(customColors.hairColor || []),
      ...(customColors.clothesColor || [])
    ],
    [customColors]
  )

  const handleResetPreferences = () => {
    preferences.resetPreferences()
    toast.success('Preferencias restablecidas')
  }

  const handleClearAllCustom = () => {
    clearCustomColors('skinColor')
    clearCustomColors('hairColor')
    clearCustomColors('clothesColor')
    toast.success('Colores personalizados eliminados')
  }

  const handleAddCustom = (target) => {
    const value = draft[target === 'skinColor' ? 'skin' : target === 'hairColor' ? 'hair' : 'clothing']
    if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
      toast.error('Color inválido', { description: 'Usa el formato #RRGGBB' })
      return
    }
    addCustomColor(target, value)
    toast.success(`Color ${value} guardado`)
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Database}
        title="Datos"
        description="Tus colores personalizados y opciones avanzadas."
        accent="primary"
      />

      <SettingsCard
        title="Colores personalizados"
        description="Añade tus propios colores a las paletas de Piel, Cabello y Ropa."
        footer={
          allCustom.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {allCustom.length} color{allCustom.length === 1 ? '' : 'es'} personalizado{allCustom.length === 1 ? '' : 's'}.
              </p>
              <Button variant="ghost" size="sm" onClick={handleClearAllCustom}>
                Eliminar todos
              </Button>
            </div>
          )
        }
      >
        {[
          { id: 'skinColor', label: 'Piel', draftKey: 'skin', palette: SKIN_COLORS },
          { id: 'hairColor', label: 'Cabello', draftKey: 'hair', palette: HAIR_COLORS },
          {
            id: 'clothesColor',
            label: 'Ropa',
            draftKey: 'clothing',
            palette: CLOTHING_COLORS_DEFAULT
          }
        ].map((cat) => {
          const pickerId = `custom-color-${cat.id}`
          const hexId = `custom-hex-${cat.id}`
          return (
            <div key={cat.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={hexId} className="text-sm font-semibold">
                  {cat.label}
                </Label>
                <Badge variant="secondary" className="text-[10px]">
                  {(customColors[cat.id] || []).length} guardados
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={pickerId}
                  className="grid size-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-border/60 bg-card p-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
                  title={`Selector de color para ${cat.label}`}
                >
                  <span className="sr-only">
                    Selector de color para {cat.label}
                  </span>
                  <input
                    id={pickerId}
                    type="color"
                    value={draft[cat.draftKey]}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        [cat.draftKey]: e.target.value
                      }))
                    }
                    className="size-full cursor-pointer border-0 bg-transparent p-0"
                  />
                </label>
                <Input
                  id={hexId}
                  value={draft[cat.draftKey]}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [cat.draftKey]: e.target.value }))
                  }
                  className="h-9 w-28 font-mono text-xs"
                  maxLength={7}
                  spellCheck={false}
                  placeholder="#3b82f6"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddCustom(cat.id)}
                >
                  <Plus data-icon="inline-start" />
                  Añadir
                </Button>
              </div>
              {(customColors[cat.id] || []).length > 0 && (
                <div
                  className="flex flex-wrap gap-1.5 pt-1"
                  role="list"
                  aria-label={`Colores personalizados de ${cat.label}`}
                >
                  {(customColors[cat.id] || []).map((c) => (
                    <span
                      key={c}
                      className="group/cc relative size-7 overflow-hidden rounded-md ring-1 ring-border/60"
                      title={c}
                      role="listitem"
                    >
                      <span
                        className="absolute inset-0"
                        style={{ background: c }}
                        aria-hidden
                      />
                      <button
                        type="button"
                        onClick={() => {
                          removeCustomColor(cat.id, c)
                          toast.success('Color eliminado')
                        }}
                        aria-label={`Eliminar ${c}`}
                        className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100 group-hover/cc:opacity-100 focus-visible:opacity-100"
                      >
                        <X className="size-3" aria-hidden />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </SettingsCard>

      <Card className="gap-0 border-destructive/40 bg-destructive/5 p-0">
        <CardHeader className="border-b border-destructive/20 px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" aria-hidden />
            Zona peligrosa
          </CardTitle>
          <CardDescription>
            Restablece todas las preferencias a sus valores predeterminados.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <p className="text-sm text-muted-foreground">
            Volverás al tema del sistema, formato SVG, tamaño 256 y todas las
            demás opciones por defecto. Tus avatares favoritos no se ven
            afectados.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 data-icon="inline-start" />
                Restablecer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Restablecer preferencias?</AlertDialogTitle>
                <AlertDialogDescription>
                  Volverás al tema del sistema, formato SVG, tamaño 256 y
                  todas las demás opciones por defecto. Esta acción no afecta
                  a tus avatares favoritos guardados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetPreferences}>
                  Sí, restablecer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

const SECTIONS_RENDERERS = {
  appearance: AppearanceSection,
  export: ExportSection,
  animation: AnimationSection,
  favorites: FavoritesSection,
  data: DataSection
}

export const Preferences = () => {
  usePageMeta({
    title: 'Preferencias',
    description:
      'Personaliza Avatars.Dev a tu gusto: tema claro/oscuro, color de acento, formato de descarga (SVG/PNG/JPG), tamaño, animación de ruleta, gestión de favoritos y paleta de colores personalizados.',
    path: '/preferencias',
    keywords: [
      'preferencias avatares',
      'configuración',
      'tema oscuro',
      'formato svg png jpg',
      'paleta personalizada'
    ]
  })

  const favorites = useFavoriteAvatarsStorage((s) => s.favorites)
  const customColors = usePreferencesStore((s) => s.customColors)
  const [active, setActive] = useState('appearance')

  const allCustom =
    (customColors.skinColor?.length || 0) +
    (customColors.hairColor?.length || 0) +
    (customColors.clothesColor?.length || 0)

  const ActiveSection = SECTIONS_RENDERERS[active]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Settings className="size-3 text-primary" aria-hidden />
          Preferencias
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Ajusta tu <span className="text-gradient-brand">experiencia</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Personaliza cómo se ve la app, cómo se descargan tus avatares y
          gestiona tu colección.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <div className="sticky top-20">
            <SectionNav
              active={active}
              onSelect={setActive}
              favoritesCount={favorites.length}
              customColorCount={allCustom}
            />
          </div>
        </aside>

        <div className="min-w-0">
          {ActiveSection && <ActiveSection />}
        </div>
      </div>
    </div>
  )
}
