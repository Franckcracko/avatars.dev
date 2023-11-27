import { useEffect, useState } from 'react'
import { MEDIA_SIZE_ICONS } from '../configs/constants'
import { HeartIconFilled } from './icons/HeartFilledIcon'
import { HeartIcon } from './icons/HeartIcon'
import { useFavoriteAvatarsStorage } from '../stores/useFavoriteAvatarsStorage'
import { useAvatarStore } from '../stores/useAvatarStore'

export const ButtonFavorite = ({ id, avatarUri, nameAvatar }) => {
  const addFavoriteAvatar = useFavoriteAvatarsStorage((state) => state.addFavoriteAvatar)
  const removeFavoriteAvatar = useFavoriteAvatarsStorage((state) => state.removeFavoriteAvatar)
  const findFavoriteAvatar = useFavoriteAvatarsStorage((state) => state.findFavoriteAvatar)
  const idAvatar = id ?? useAvatarStore((state) => state.seed)
  const name = nameAvatar ?? useAvatarStore((state) => state.name)
  const avatar = avatarUri ?? useAvatarStore((state) => state.avatar)
  const [favorite, setFavorite] = useState(findFavoriteAvatar(idAvatar) !== undefined)
  useEffect(() => {
    setFavorite(findFavoriteAvatar(idAvatar) !== undefined)
  }, [avatar])

  return (
    <button
      type="button"
      className="text-primary_color_dark text-opacity-80 hover:text-opacity-100 transition-opacity p-2 flex flex-col items-center"
      onClick={() => {
        if (!favorite) {
          setFavorite(true)
          addFavoriteAvatar({ id: idAvatar, avatar: typeof avatar === 'string' ? avatar : avatar.toDataUriSync(), name })
          return
        }
        setFavorite(false)
        removeFavoriteAvatar(idAvatar)
      }}
    >
      {favorite
        ? <HeartIconFilled className={MEDIA_SIZE_ICONS} />
        : <HeartIcon className={MEDIA_SIZE_ICONS} />
      }
      <span className="text-dark_secondary/80 text-[8px] font-medium md:text-base">Guardar</span>
    </button>
  )
}
