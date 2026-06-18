import { Download, Heart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useFavoriteAvatarsStorage } from '@/stores/useFavoriteAvatarsStorage'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { HeartBurst } from '@/components/HeartBurst'
import { toast } from 'sonner'

const SHAPE_CLASSES = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-2xl'
}

const ActionButton = ({ icon: Icon, label, onClick, active, children, ...rest }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          'rounded-full',
          active && 'text-destructive hover:text-destructive'
        )}
        {...rest}
      >
        {children ?? <Icon className={cn(active && 'fill-current')} />}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

export const CardAvatar = ({
  avatar,
  name,
  id,
  seed,
  configs,
  className = '',
  onUse,
  onDownload,
  showUseButton = false
}) => {
  const addFavorite = useFavoriteAvatarsStorage((s) => s.addFavoriteAvatar)
  const removeFavorite = useFavoriteAvatarsStorage((s) => s.removeFavoriteAvatar)
  const findFavorite = useFavoriteAvatarsStorage((s) => s.findFavoriteAvatar)

  const [favorite, setFavorite] = useState(!!findFavorite(id))
  const [bursting, setBursting] = useState(false)
  const burstTimeout = useRef(null)

  useEffect(() => {
    setFavorite(!!findFavorite(id))
  }, [id, findFavorite])

  useEffect(() => {
    return () => {
      if (burstTimeout.current) clearTimeout(burstTimeout.current)
    }
  }, [])

  const toggleFavorite = (e) => {
    e?.stopPropagation?.()
    if (favorite) {
      removeFavorite(id)
      setFavorite(false)
      toast.success(`${name} eliminado de favoritos`)
    } else {
      addFavorite({ id, avatar, name, seed, configs })
      setFavorite(true)
      setBursting(true)
      if (burstTimeout.current) clearTimeout(burstTimeout.current)
      burstTimeout.current = setTimeout(() => setBursting(false), 800)
      toast.success(`${name} guardado en favoritos`, {
        description: 'Lo encontrarás en Preferencias'
      })
    }
  }

  const avatarStyle = usePreferencesStore((s) => s.avatarStyle)
  const shapeClass = SHAPE_CLASSES[avatarStyle] || SHAPE_CLASSES.rounded

  return (
    <Card
      size="sm"
      className={cn(
        'group/avatar-card relative w-full gap-2 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div
        role="img"
        aria-label={`Avatar ${name}`}
        className={cn(
          'relative grid aspect-square place-items-center overflow-hidden bg-muted/40',
          shapeClass
        )}
      >
        <img
          src={avatar}
          alt=""
          aria-hidden
          className="size-full object-contain p-3 transition-transform duration-300 group-hover/avatar-card:scale-105"
          draggable={false}
        />
        <div className="absolute right-1.5 top-1.5">
          <ActionButton
            icon={Heart}
            label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            onClick={toggleFavorite}
            active={favorite}
          >
            <Heart
              className={cn(
                'transition-transform duration-200',
                favorite && 'fill-current scale-110'
              )}
            />
          </ActionButton>
        </div>
        <HeartBurst active={bursting} />
      </div>
      <div className="px-3">
        <div className="flex items-center justify-between gap-2">
          <p
            className="flex min-w-0 items-center gap-1 truncate text-sm font-medium"
            title={name}
          >
            <User aria-hidden className="size-3.5 text-muted-foreground" />
            <span className="truncate">{name}</span>
          </p>
          <div className="flex items-center gap-0.5">
            <ActionButton
              icon={Download}
              label="Descargar avatar"
              onClick={(e) => {
                e?.stopPropagation?.()
                if (onDownload) {
                  onDownload()
                } else {
                  const a = document.createElement('a')
                  a.href = avatar
                  a.download = `${name}.svg`
                  a.click()
                }
              }}
            />
          </div>
        </div>
        {showUseButton && onUse && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2 w-full"
            onClick={onUse}
          >
            Usar este avatar
          </Button>
        )}
      </div>
    </Card>
  )
}
