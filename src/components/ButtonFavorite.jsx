import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavoriteAvatarsStorage } from '@/stores/useFavoriteAvatarsStorage'
import { useAvatarStore } from '@/stores/useAvatarStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const ButtonFavorite = ({ id, avatarUri, nameAvatar, variant = 'default' }) => {
  const toggleFavorite = useFavoriteAvatarsStorage((s) => s.toggleFavorite)
  const isFavorite = useFavoriteAvatarsStorage((s) => s.isFavorite)

  const idAvatar = id ?? useAvatarStore((state) => state.seed)
  const name = nameAvatar ?? useAvatarStore((state) => state.name)
  const avatar =
    avatarUri ??
    useAvatarStore((state) =>
      typeof state.avatar === 'string' ? state.avatar : state.avatar.toDataUriSync()
    )
  const configs = useAvatarStore((state) => state.configs)

  const [favorite, setFavorite] = useState(isFavorite(idAvatar))

  useEffect(() => {
    setFavorite(isFavorite(idAvatar))
  }, [idAvatar, isFavorite, avatar])

  const handleClick = (e) => {
    e?.stopPropagation?.()
    const data = { id: idAvatar, avatar, name, configs }
    toggleFavorite(data)
    const next = !favorite
    setFavorite(next)
    toast.success(
      next ? `${name} guardado en favoritos` : `${name} eliminado de favoritos`,
      { description: next ? 'Lo encontrarás en Preferencias' : undefined }
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleClick}
      aria-pressed={favorite}
      aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={cn(
        'group/fav gap-1.5',
        favorite && 'text-destructive hover:text-destructive'
      )}
    >
      <Heart
        aria-hidden
        className={cn(
          'transition-transform',
          favorite ? 'fill-current scale-110' : 'group-hover/fav:scale-110'
        )}
      />
      <span className="text-xs font-medium sm:text-sm">
        {favorite ? 'Guardado' : 'Guardar'}
      </span>
    </Button>
  )
}
