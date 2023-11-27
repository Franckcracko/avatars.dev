import { MEDIA_SIZE_ICONS } from '../../configs/constants.js'
import { Link } from 'react-router-dom'
import { RandomIcon } from '../icons/RandomIcon'
import { EditIcon } from '../icons/EditIcon'
import { DownloadIcon } from '../icons/DownloadIcon'
import { useAvatarStore } from '../../stores/useAvatarStore'
import { ButtonFavorite } from '../ButtonFavorite'

export const Home = () => {
  const updateAvatar = useAvatarStore((state) => state.updateAvatar)
  const avatar = useAvatarStore((state) => state.avatar)
  const nameAvatar = useAvatarStore((state) => state.name)
  return (
    <main className='grid place-content-center'>
      <article className='mt-6 max-w-[500px]'>
        <div className='grid'>
          <div className='flex justify-center' >
            <img className='md:w-[300px]' src={avatar.toDataUriSync()} alt="imagen de avatar" />
          </div>

          <h1 className='mb-3 text-center text-3xl md:text-5xl text-primary_color_dark font-bold'>{nameAvatar}</h1>
          <button onClick={() => updateAvatar()} className='md:text-2xl focus:ring-4 focus:outline-none focus:ring-primary_color_dark/50 rounded flex justify-center gap-x-2 border-2 px-3 py-2 transition-colors shadow  border-primary_color_dark text-primary_color_dark font-medium uppercase hover:text-white_secondary  hover:bg-primary_color_dark'>
            avatar.dev
            <RandomIcon className={MEDIA_SIZE_ICONS} />
          </button>

          <div className='flex justify-between mt-3'>
            <ButtonFavorite />
            <Link
              to={'/editar'}
              className="transition-opacity text-primary_color_dark text-opacity-80 hover:text-opacity-100 p-2 flex flex-col items-center"
            >
              <EditIcon className={MEDIA_SIZE_ICONS} />
              <span className=" text-dark_secondary/80 text-[8px] md:text-base font-medium">Editar</span>
            </Link>
            <a
              href={avatar.toDataUriSync()}
              download
              className="transition-opacity text-primary_color_dark  text-opacity-80 hover:text-opacity-100 p-2 flex flex-col items-center"
            >
              <DownloadIcon className={MEDIA_SIZE_ICONS} />
              <span className="text-dark_secondary/80 text-[8px] font-medium md:text-base">Descargar</span>
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
