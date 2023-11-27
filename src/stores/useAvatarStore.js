import { create } from 'zustand'
import { getAvatar } from '../utils/getAvatar'
import { nombres as names } from '../mocks/names.json'
import { getRandomInt } from '../utils/generateRandomInt'
import { CONFIG_AVATAAARS } from '../configs/avatar'

export const getRandomName = () => {
  return names[getRandomInt(0, names.length - 1)]
}

const seed = crypto.randomUUID()

export const useAvatarStore = create((set) => ({
  avatar: getAvatar({ seed, configs: CONFIG_AVATAAARS.avataaars.configs_initial, typeAvatar: CONFIG_AVATAAARS.avataaars.type }),
  name: getRandomName(),
  seed,
  configs: CONFIG_AVATAAARS.avataaars.configs_initial,
  updateAvatar: () => set(() => {
    const newSeed = crypto.randomUUID()
    return { seed: newSeed, avatar: getAvatar({ seed: newSeed }), name: getRandomName() }
  }),
  editAvatar: (changes) => set((state) => {
    const newConfigs = { ...state.configs, ...changes }
    return { avatar: getAvatar({ seed: state.seed, configs: newConfigs }), configs: newConfigs }
  })
}))
