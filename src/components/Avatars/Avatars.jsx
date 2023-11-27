import { useState } from 'react'
import { getAvatar } from '../../utils/getAvatar'
import { CONFIG_AVATAAARS } from '../../configs/avatar'
import { getRandomName } from '../../stores/useAvatarStore'
import { CardAvatar } from '../CardAvatar'
import { RandomIcon } from '../icons/RandomIcon'
import { MEDIA_SIZE_ICONS } from '../../configs/constants'

const generateAvatars = (quantity) => {
  const avatars = []
  for (let index = 0; index < quantity; index++) {
    const id = crypto.randomUUID()
    const avatar = getAvatar({ seed: id, configs: CONFIG_AVATAAARS.avataaars.configs_initial })
    const name = getRandomName()
    avatars.push({ id, avatar: avatar.toDataUriSync(), name })
  }
  return avatars
}
const LIMIT_AVATARS = 20
const avatarsGenerated = generateAvatars(LIMIT_AVATARS)
export const Avatars = () => {
  const [avatars, setAvatars] = useState(avatarsGenerated)

  return (
    <main className='grid place-content-center p-2'>
      <article className="max-w-[700px]">
        <h1 className='text-4xl font-medium mb-3 text-primary_color_dark'>Avatars</h1>
        <button onClick={() => setAvatars(generateAvatars(LIMIT_AVATARS))} className='mx-auto my-4 md:text-2xl focus:ring-4 focus:outline-none focus:ring-primary_color_dark/50 rounded flex justify-center gap-x-2 border-2 px-3 py-2 transition-colors shadow  border-primary_color_dark text-primary_color_dark font-medium uppercase hover:text-white_secondary  hover:bg-primary_color_dark'>
            Generar
            <RandomIcon className={MEDIA_SIZE_ICONS} />
          </button>
        <section className='max-sm:justify-center flex flex-wrap gap-x-6'>
          {avatars.map(avatar => (
            <CardAvatar key={avatar.id} avatar={avatar.avatar} name={avatar.name} id={avatar.id} />
          ))}
        </section>
      </article>
    </main>
  )
}
