import { Link } from 'react-router-dom'
import { useAvatarStore } from '../../stores/useAvatarStore'
import { CONFIG_AVATAAARS } from '../../configs/avatar'
import { useState } from 'react'
import { ArrowDownIcon } from '../icons/ArrowDownIcon'
import { DownloadIcon } from '../icons/DownloadIcon'
import { MEDIA_SIZE_ICONS } from '../../configs/constants'
import { ButtonFavorite } from '../ButtonFavorite'

const SectionChangeAvatar = ({ editAvatar, title, characters, nameCharacter }) => {
  const [show, setShow] = useState(false)

  return (
    <div className='grid '>
      <h3 className='flex text-xl font-medium mb-2 items-center'><span>{title}</span>
        <button onClick={() => setShow(prevState => !prevState)}>
          <ArrowDownIcon className={`w-[32px] h-[32px] ${show ? 'rotate-180' : 'rotate-0'} transition-transform duration-150 `} />
        </button>
      </h3>
      <ul className={`grid grid-cols-2 gap-y-3 gap-x-4 ${show ? 'block' : 'hidden'}`}>
        {
          characters.map((character) => (
            <li key={character}>
              <button
                className='overflow-clip max-sm:text-[10px] text-xs uppercase focus:ring-4 focus:outline-none focus:ring-primary_color_dark/80 rounded  text-white_secondary border-2 py-2 shadow w-full bg-primary_color_dark hover:bg-[#2b6769] transition-colors'
                onClick={() => editAvatar({ [nameCharacter]: [character] })}
              >{character}</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
const SectionContainerAvatar = ({ children, title }) => {
  const [show, setShow] = useState(true)
  return (
    <section >
      <h2 className='flex items-end gap-x-1 text-4xl font-semibold text-primary_color_dark mb-4'><span>{title}</span>
        <button onClick={() => setShow(prevState => !prevState)}>
          <ArrowDownIcon className={`w-[32px] h-[32px] ${show ? 'rotate-180' : 'rotate-0'} transition-transform duration-150 `} />
        </button>
      </h2>
      <div className={`md:ml-3 grid gap-y-6 items-start ${show ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </section>
  )
}
export const Edit = () => {
  const avatar = useAvatarStore((state) => state.avatar)
  const nameAvatar = useAvatarStore((state) => state.name)
  const editAvatar = useAvatarStore((state) => state.editAvatar)
  return (
    <main>
      <Link className='text-primary_color_dark text-opacity-100 hover:text-opacity-80 font-medium text-2xl underline ml-2 mt-2' to='/'>Regresar</Link>
      <div className='flex justify-center' >
        <img className='md:w-[300px]' src={avatar.toDataUriSync()} alt="imagen de avatar" />
      </div>
      <h1 className='mb-3 text-center text-3xl md:text-5xl text-primary_color_dark font-bold'>{nameAvatar}</h1>
      <div className='flex justify-center'>
        <ButtonFavorite />
        <a
          href={avatar.toDataUriSync()}
          download
          className="transition-opacity text-primary_color_dark  text-opacity-80 hover:text-opacity-100 p-2 flex flex-col items-center"
        >
          <DownloadIcon className={MEDIA_SIZE_ICONS} />
          <span className="text-dark_secondary/80 text-[8px] font-medium md:text-base">Descargar</span>
        </a>
      </div>
      <article className='p-4 grid md:grid-cols-2 lg:grid-cols-4  gap-x-4'>
        <SectionContainerAvatar title={'Cara'} >
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.eyes}
            nameCharacter={'eyes'}
            editAvatar={editAvatar}
            title={'Ojos'}
          />
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.eyebrows}
            nameCharacter={'eyebrows'}
            editAvatar={editAvatar}
            title={'Cejas'}
          />
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.mouth}
            nameCharacter={'mouth'}
            editAvatar={editAvatar}
            title={'Boca'}
          />
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.facialHair}
            nameCharacter={'facialHair'}
            editAvatar={editAvatar}
            title={'Vello facial'}
          />

        </SectionContainerAvatar>

        <SectionContainerAvatar title={'Ropa'} >
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.clothing}
            nameCharacter={'clothing'}
            editAvatar={editAvatar}
            title={'Ropa'}
          />
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.clothingGraphic}
            nameCharacter={'clothingGraphic'}
            editAvatar={editAvatar}
            title={'Grafico de Camisa'}
          />
        </SectionContainerAvatar>

        <SectionContainerAvatar title={'Cabeza'} >
          <SectionChangeAvatar
            characters={CONFIG_AVATAAARS.avataaars.configs_initial.top}
            nameCharacter={'top'}
            editAvatar={editAvatar}
            title={'Pelo'}
          />
        </SectionContainerAvatar>
        <SectionContainerAvatar title={'Accesorios'} >

        </SectionContainerAvatar>
      </article>
    </main>
  )
}
