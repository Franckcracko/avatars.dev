import { MEDIA_SIZE_ICONS } from '../configs/constants'
import { ButtonFavorite } from './ButtonFavorite'
import { DownloadIcon } from './icons/DownloadIcon'

export const CardAvatar = ({ avatar, name, id }) => {
  return (
    <div className='shadow p-4 max-sm:w-2/3 w-[150px] md:w-[200px] rounded-md'>
      <img className='mx-auto' src={avatar} alt={`imagen de avatar favorito ${name}`} />
      <p className='text-center font-medium mt-3'>{name}</p>
      <div className='flex justify-between '>
        <ButtonFavorite id={id} avatarUri={avatar} nameAvatar={name} />
        <a
          href={avatar}
          download
          className="transition-opacity text-primary_color_dark  text-opacity-80 hover:text-opacity-100 p-2 flex flex-col items-center"
        >
          <DownloadIcon className={MEDIA_SIZE_ICONS} />
          <span className="text-dark_secondary/80 text-[8px] font-medium md:text-base">Descargar</span>
        </a>
      </div>
    </div>
  )
}
