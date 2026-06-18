import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  RefreshCcw,
  Undo2,
  Redo2,
  Download,
  Heart,
  Shuffle,
  Save,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  Smile,
  Glasses,
  Shirt,
  Brush,
  Plus,
  X,
  Pencil,
  Check,
  Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAvatarStore } from '@/stores/useAvatarStore'
import { CONFIG_AVATAAARS, ALL_TOPS } from '@/configs/avatar'
import {
  CLOTHING_COLORS_DEFAULT,
  HAIR_COLORS,
  SKIN_COLORS
} from '@/configs/colors'
import { useFavoriteAvatarsStorage } from '@/stores/useFavoriteAvatarsStorage'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { usePageMeta } from '@/hooks/usePageMeta'
import { downloadAvatar, copyAvatarToClipboard } from '@/utils/avatarExport'
import { getOptionPreview } from '@/utils/avatarPreviews'
import { getOptionLabel } from '@/utils/avatarLabels'
import { HeartBurst } from '@/components/HeartBurst'
import { toast } from 'sonner'

const SECTIONS = [
  {
    id: 'cara',
    title: 'Cara',
    description: 'Rasgos faciales',
    icon: Smile,
    accent: 'primary',
    fields: [
      { name: 'eyes', label: 'Ojos' },
      { name: 'eyebrows', label: 'Cejas' },
      { name: 'mouth', label: 'Boca' },
      { name: 'facialHair', label: 'Vello facial' }
    ]
  },
  {
    id: 'cabeza',
    title: 'Cabeza',
    description: 'Peinado y accesorios',
    icon: Glasses,
    accent: 'accent',
    fields: [
      { name: 'top', label: 'Peinado' },
      { name: 'accessories', label: 'Accesorios' }
    ]
  },
  {
    id: 'ropa',
    title: 'Ropa',
    description: 'Estilo y estampado',
    icon: Shirt,
    accent: 'primary',
    fields: [
      { name: 'clothing', label: 'Camisa' },
      { name: 'clothingGraphic', label: 'Estampado' }
    ]
  },
  {
    id: 'colores',
    title: 'Colores',
    description: 'Piel, cabello y ropa',
    icon: Brush,
    accent: 'accent',
    isColor: true,
    fields: [
      {
        name: 'skin',
        label: 'Piel',
        palette: SKIN_COLORS,
        target: 'skinColor'
      },
      {
        name: 'hair',
        label: 'Cabello',
        palette: HAIR_COLORS,
        target: 'hairColor'
      },
      {
        name: 'clothing',
        label: 'Ropa',
        palette: CLOTHING_COLORS_DEFAULT,
        target: 'clothesColor'
      }
    ]
  }
]

const baseConfigs = CONFIG_AVATAAARS.avataaars.configs_initial
// Show every top style (including hats) in the Peinado picker so the user
// can still wear a hat if they want; the shuffle prefers hair styles.
const TOP_OPTIONS = ALL_TOPS

const OptionCard = ({ value, preview, active, onPick, label }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        onClick={() => onPick(value)}
        aria-pressed={active}
        aria-label={`${label}: ${getOptionLabel(value)}`}
        className={cn(
          'group/option relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-1.5 transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:-translate-y-0.5',
          active
            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
            : 'border-border/60 bg-card hover:border-primary/40'
        )}
      >
        <div
          className={cn(
            'grid aspect-square w-full place-items-center overflow-hidden rounded-lg',
            active ? 'bg-primary/5' : 'bg-muted/40'
          )}
        >
          <img
            src={preview}
            alt=""
            aria-hidden
            className="size-full object-contain p-1 transition-transform duration-200 group-hover/option:scale-105"
            draggable={false}
            loading="lazy"
          />
        </div>
        <span
          className={cn(
            'line-clamp-2 w-full text-center text-[10px] font-medium leading-tight sm:text-xs',
            active ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {getOptionLabel(value)}
        </span>
      </button>
    </TooltipTrigger>
    <TooltipContent>{getOptionLabel(value)}</TooltipContent>
  </Tooltip>
)

const ColorSwatch = ({ color, active, onPick, onRemove, label, removable }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        onClick={() => onPick(color)}
        aria-pressed={active}
        aria-label={`${label}: ${color}`}
        className={cn(
          'group/swatch relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:-translate-y-0.5',
          active
            ? 'border-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background'
            : 'border-border/60 hover:border-primary/40'
        )}
        style={{ background: color }}
      >
        {removable && (
          <span
            role="button"
            tabIndex={-1}
            aria-label={`Quitar ${color}`}
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.(color)
            }}
            className="absolute right-0.5 top-0.5 grid size-4 cursor-pointer place-items-center rounded-full bg-background/85 text-foreground opacity-0 transition-opacity group-hover/swatch:opacity-100"
          >
            <X className="size-2.5" />
          </span>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-1 bottom-1 truncate rounded bg-background/85 px-1.5 py-0.5 text-center font-mono text-[9px] text-foreground"
        >
          {color}
        </span>
      </button>
    </TooltipTrigger>
    <TooltipContent>{color}</TooltipContent>
  </Tooltip>
)

const CustomColorInput = ({ onAdd, defaultValue = '#3b82f6' }) => {
  const [value, setValue] = useState(defaultValue)
  const [text, setText] = useState(defaultValue)

  const handleChange = (next) => {
    setValue(next)
    setText(next)
  }

  const handleAdd = () => {
    if (!/^#[0-9a-fA-F]{6}$/.test(text)) {
      toast.error('Color inválido', {
        description: 'Usa el formato #RRGGBB'
      })
      return
    }
    onAdd(text)
    toast.success(`Color ${text} guardado`)
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Selector de color"
        className="size-9 shrink-0 cursor-pointer rounded-lg border-2 border-border/60 bg-card p-0.5"
      />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          if (/^#[0-9a-fA-F]{6}$/.test(text)) {
            setValue(text)
          }
        }}
        placeholder="#3b82f6"
        className="h-9 flex-1 font-mono text-xs"
        maxLength={7}
        spellCheck={false}
      />
      <Button
        type="button"
        size="icon-sm"
        variant="default"
        onClick={handleAdd}
        aria-label="Añadir color personalizado"
        className="shrink-0"
      >
        <Plus />
      </Button>
    </div>
  )
}

const ColorFieldBlock = ({ field, configs, onPick, customColors, onAddCustom, onRemoveCustom }) => {
  const target = field.target
  const rawVal = configs[target]?.[0]
  // Stored value is normalized (no leading "#"). Compare both forms.
  const normalized = rawVal ? rawVal.replace(/^#+/, '').toLowerCase() : ''
  const allColors = useMemo(
    () => Array.from(new Set([...(customColors || []), ...field.palette])),
    [customColors, field.palette]
  )
  const activeColor = rawVal ? `#${normalized}` : ''

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {field.label}
          {customColors?.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {customColors.length} personalizado{customColors.length === 1 ? '' : 's'}
            </Badge>
          )}
        </h4>
        {rawVal && (
          <span
            aria-hidden
            className="size-3 rounded-full ring-1 ring-border"
            style={{ background: activeColor }}
            title={`#${normalized}`}
          />
        )}
      </div>

      <div className="mb-3">
        <CustomColorInput onAdd={(c) => onAddCustom(target, c)} />
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-7">
        {allColors.map((c) => {
          const isCustom = customColors?.includes(c)
          const cNorm = c.replace(/^#+/, '').toLowerCase()
          return (
            <ColorSwatch
              key={c}
              color={c}
              active={normalized === cNorm}
              onPick={onPick}
              onRemove={onRemoveCustom}
              label={field.label}
              removable={isCustom}
            />
          )
        })}
      </div>
    </div>
  )
}

const FieldBlock = ({
  field,
  configs,
  onPick,
  isColor,
  customColors,
  onAddCustom,
  onRemoveCustom
}) => {
  const currentVal = isColor
    ? configs[field.target]?.[0]
    : configs[field.name]?.[0]

  const handlePick = (val) => {
    if (isColor) {
      onPick({ [field.target]: [val] })
    } else {
      onPick({ [field.name]: [val] })
    }
  }

  if (isColor) {
    return (
      <ColorFieldBlock
        field={field}
        configs={configs}
        onPick={handlePick}
        customColors={customColors}
        onAddCustom={onAddCustom}
        onRemoveCustom={onRemoveCustom}
      />
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{field.label}</h4>
        {currentVal && (
          <Badge variant="secondary" className="text-[10px]">
            {getOptionLabel(currentVal)}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
        {((field.name === 'top' ? TOP_OPTIONS : baseConfigs[field.name]) || []).map((opt) => (
          <OptionCard
            key={opt}
            value={opt}
            preview={getOptionPreview(field.name, opt)}
            active={currentVal === opt}
            onPick={handlePick}
            label={field.label}
          />
        ))}
      </div>
    </div>
  )
}

const SectionCard = ({
  section,
  configs,
  onPick,
  onShuffle,
  onAddCustom,
  onRemoveCustom,
  customColors,
  innerRef
}) => {
  const Icon = section.icon
  const handleShuffle = () => {
    if (section.isColor) {
      section.fields.forEach((f) => onShuffle(f.target))
    } else {
      section.fields.forEach((f) => onShuffle(f.name))
    }
    toast.success(`${section.title} aleatorizado`)
  }

  return (
    <Card
      ref={innerRef}
      data-section={section.id}
      className="scroll-mt-24 gap-4 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-foreground/10',
              section.accent === 'primary'
                ? 'bg-primary/10 text-primary'
                : 'bg-accent/10 text-accent'
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">
              {section.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {section.description}
            </p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleShuffle}
              aria-label={`Aleatorizar ${section.title}`}
            >
              <Shuffle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Aleatorizar sección</TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-5">
        {section.fields.map((f) => (
          <FieldBlock
            key={f.name}
            field={f}
            configs={configs}
            onPick={onPick}
            onShuffle={onShuffle}
            isColor={section.isColor}
            customColors={customColors?.[f.target] || []}
            onAddCustom={onAddCustom}
            onRemoveCustom={(color) => onRemoveCustom(f.target, color)}
          />
        ))}
      </div>
    </Card>
  )
}

export const Edit = () => {
  usePageMeta({
    title: 'Editor de avatares',
    description:
      'Personaliza cada rasgo de tu avatar: ojos, cejas, boca, peinado, ropa, accesorios y más de 130 colores. Vista previa en tiempo real y descarga inmediata.',
    path: '/editar',
    keywords: [
      'editor de avatares',
      'avatar editor',
      'personalizar avatar',
      'cambiar color de pelo',
      'avatares avataaars',
      'cambiar rasgos'
    ]
  })

  const avatar = useAvatarStore((s) => s.avatar)
  const name = useAvatarStore((s) => s.name)
  const seed = useAvatarStore((s) => s.seed)
  const configs = useAvatarStore((s) => s.configs)
  const editAvatar = useAvatarStore((s) => s.editAvatar)
  const randomizePart = useAvatarStore((s) => s.randomizePart)
  const randomizeColors = useAvatarStore((s) => s.randomizeColors)
  const shuffleAll = useAvatarStore((s) => s.shuffleAll)
  const undo = useAvatarStore((s) => s.undo)
  const redo = useAvatarStore((s) => s.redo)
  const history = useAvatarStore((s) => s.history)
  const historyIndex = useAvatarStore((s) => s.historyIndex)
  const resetAvatar = useAvatarStore((s) => s.resetAvatar)
  const setName = useAvatarStore((s) => s.setName)

  const addFavorite = useFavoriteAvatarsStorage((s) => s.addFavoriteAvatar)
  const isFavorite = useFavoriteAvatarsStorage((s) => s.isFavorite)

  const format = usePreferencesStore((s) => s.downloadFormat)
  const backgroundColor = usePreferencesStore((s) => s.backgroundColor)
  const avatarSize = usePreferencesStore((s) => s.avatarSize)
  const useAvatarNameForDownload = usePreferencesStore(
    (s) => s.useAvatarNameForDownload
  )
  const customColors = usePreferencesStore((s) => s.customColors)
  const addCustomColorPref = usePreferencesStore((s) => s.addCustomColor)
  const removeCustomColorPref = usePreferencesStore((s) => s.removeCustomColor)

  const [showPreview, setShowPreview] = useState(true)
  const [activeSection, setActiveSection] = useState('cara')
  const [renaming, setRenaming] = useState(false)
  const [draftName, setDraftName] = useState(name)
  const [bursting, setBursting] = useState(false)
  const sectionRefs = useRef({})

  useEffect(() => {
    if (!renaming) setDraftName(name)
  }, [name, renaming])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleDownload = () => {
    downloadAvatar(seed, configs, {
      name,
      format,
      useName: useAvatarNameForDownload,
      backgroundColor,
      size: avatarSize
    })
    toast.success('Descarga iniciada', {
      description: useAvatarNameForDownload
        ? `Guardado como ${name.toLowerCase().replace(/\s+/g, '-')}.${format}`
        : `Formato ${format.toUpperCase()}`
    })
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

  const handleSaveFavorite = () => {
    const wasFavorite = isFavorite(seed)
    addFavorite({
      id: seed,
      seed,
      avatar: avatar.toDataUriSync(),
      name,
      configs
    })
    if (!wasFavorite) {
      setBursting(true)
      setTimeout(() => setBursting(false), 800)
    }
    toast.success(
      wasFavorite
        ? `${name} actualizado en favoritos`
        : `${name} guardado en favoritos`
    )
  }

  const handleStartRename = () => {
    setDraftName(name)
    setRenaming(true)
  }

  const handleConfirmRename = () => {
    const next = draftName.trim()
    if (next && next !== name) {
      setName(next)
      toast.success(`Renombrado a ${next}`)
    }
    setRenaming(false)
  }

  const handleCancelRename = () => {
    setDraftName(name)
    setRenaming(false)
  }

  const handleShuffleAll = () => {
    shuffleAll()
    toast.success('¡Avatar mezclado!', {
      description: 'Rasgos y colores aleatorios'
    })
  }

  const handleShuffleColors = () => {
    randomizeColors()
    toast.success('Colores aleatorios')
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          setActiveSection(visible.target.dataset.section)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/">
            <ArrowLeft data-icon="inline-start" />
            Volver al inicio
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Deshacer"
              >
                <Undo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deshacer</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Rehacer"
              >
                <Redo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rehacer</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={resetAvatar}
                aria-label="Restablecer"
              >
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restablecer</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* PREVIEW */}
        <aside className="order-1 lg:sticky lg:top-20 lg:self-start">
          <Card className="overflow-hidden p-0">
            <div className="relative grid place-items-center bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-10">
              <img
                src={avatar.toDataUriSync()}
                alt={`Avatar editable llamado ${name}`}
                className={cn(
                  'size-48 object-contain transition-all duration-300 sm:size-64',
                  !showPreview && 'blur-md'
                )}
                draggable={false}
              />
              <HeartBurst active={bursting} />
              <Button
                type="button"
                size="icon-sm"
                variant="secondary"
                className="absolute right-3 top-3 rounded-full"
                onClick={() => setShowPreview((v) => !v)}
                aria-pressed={!showPreview}
                aria-label={
                  showPreview ? 'Ocultar vista previa' : 'Mostrar vista previa'
                }
              >
                {showPreview ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Personaje
                </p>
                {renaming
                  ? (
                    <div className="mt-1 flex items-center gap-1">
                      <Input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmRename()
                          if (e.key === 'Escape') handleCancelRename()
                        }}
                        autoFocus
                        maxLength={32}
                        aria-label="Nuevo nombre del avatar"
                        className="h-9 text-base font-semibold"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="default"
                            onClick={handleConfirmRename}
                            aria-label="Guardar nombre"
                          >
                            <Check />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Guardar nombre</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={handleCancelRename}
                            aria-label="Cancelar"
                          >
                            <X />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancelar</TooltipContent>
                      </Tooltip>
                    </div>
                    )
                  : (
                    <div className="mt-1 flex items-center gap-1.5">
                      <h2 className="font-display text-2xl font-bold">
                        {name}
                      </h2>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={handleStartRename}
                            aria-label="Renombrar avatar"
                            className="size-7 rounded-full"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cambiar nombre</TooltipContent>
                      </Tooltip>
                    </div>
                    )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleSaveFavorite}
                  variant={isFavorite(seed) ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <Heart
                    data-icon="inline-start"
                    className={cn(isFavorite(seed) && 'fill-current')}
                  />
                  {isFavorite(seed) ? 'Guardado' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download data-icon="inline-start" />
                  {format.toUpperCase()}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={handleCopy}
                      variant="outline"
                      size="icon-sm"
                      aria-label="Copiar al portapapeles"
                    >
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copiar al portapapeles</TooltipContent>
                </Tooltip>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleShuffleColors}
                className="w-full"
              >
                <Brush data-icon="inline-start" />
                Mezclar colores
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleShuffleAll}
                className="w-full"
              >
                <Sparkles data-icon="inline-start" />
                Mezclar todo
              </Button>
            </div>
          </Card>
        </aside>

        {/* EDITOR */}
        <section className="order-2 min-w-0 space-y-4">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Palette className="size-3 text-primary" aria-hidden />
              Editor
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Personaliza a <span className="text-gradient-brand">{name}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toca cualquier opción para ver los cambios al instante.
            </p>
          </div>

          <nav
            aria-label="Secciones del editor"
            className="sticky top-16 z-20 -mx-4 flex gap-2 overflow-x-auto bg-background/80 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {SECTIONS.map((s) => {
              const Icon = s.icon
              const active = activeSection === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {s.title}
                </button>
              )
            })}
          </nav>

          {SECTIONS.map((s) => (
            <SectionCard
              key={s.id}
              section={s}
              configs={configs}
              onPick={editAvatar}
              onShuffle={randomizePart}
              onAddCustom={addCustomColorPref}
              onRemoveCustom={(target, color) =>
                removeCustomColorPref(target, color)
              }
              customColors={customColors}
              innerRef={(el) => (sectionRefs.current[s.id] = el)}
            />
          ))}

          <div className="mt-4 flex justify-end">
            <Button asChild variant="ghost" size="sm">
              <Link to="/preferencias">
                <Save data-icon="inline-start" />
                Configuración de exportación
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
