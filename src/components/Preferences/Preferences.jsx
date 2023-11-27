import { useFavoriteAvatarsStorage } from '../../stores/useFavoriteAvatarsStorage'
import { useState } from 'react'
import { AddIcon } from '../icons/AddIcon'
import { useColorsStore } from '../../stores/useColorsStorage'
import { CardAvatar } from '../CardAvatar'

export const Preferences = () => {
  const favorites = useFavoriteAvatarsStorage(state => state.favorites)
  const colors = useColorsStore(state => state.colors)
  const addColor = useColorsStore(state => state.addColor)
  const [color, setColor] = useState('#ffffff')
  return (
    <main className='grid place-content-center p-2'>
      <article className=' max-w-[500px]'>
        <h1 className='text-4xl font-medium mb-3 text-primary_color_dark'>Preferencias</h1>
        <section className='mb-6'>
          <h2 className=' text-2xl font-medium text-primary_color'>Colores Guardados</h2>
          <div className='mb-4 grid '>
            <h3 className='text-base text-center text-black/80'>Selecciona tu Color Favorito!</h3>
            <div className='mx-auto'>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className='mt-2 w-[70px]  h-[80px] rounded-md'
              />
              <div className='flex items-center'>
                <input
                  type='text'
                  value={color}
                  className='block w-[75px] p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 '
                  onChange={e => setColor(e.target.value)}
                />
                <div >
                  <button onClick={() => addColor(color)} className='ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 '>
                    <AddIcon className='w-[12px] h-[12px]' />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-2 flex gap-y-6 flex-wrap gap-x-4 '>
            {colors.map(color => (
              <div key={color}>
                <div style={{ backgroundColor: color }} className=' w-[50px] h-[60px] shadow' />
                <p className='text-center'>{color}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className='text-2xl font-medium text-primary_color'>Avatars Favoritos</h2>
          <div className='mt-2 flex max-sm:justify-center gap-x-3 md:gap-x-10 flex-wrap'>
            {favorites.map(avatar => (
              <CardAvatar key={avatar.id} avatar={avatar.avatar} name={avatar.name} id={avatar.id} />
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}
