import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getAvatar } from '../utils/getAvatar'
import { nombres as names } from '../mocks/names.json'
import { getRandomInt } from '../utils/generateRandomInt'
import { CONFIG_AVATAAARS, SHUFFLE_TOPS, ALL_TOPS } from '../configs/avatar'
import {
  CLOTHING_COLORS_DEFAULT,
  HAIR_COLORS,
  SKIN_COLORS
} from '../configs/colors'

export const getRandomName = () => {
  return names[getRandomInt(0, names.length - 1)]
}

const COLOR_PALETTES = {
  skinColor: SKIN_COLORS,
  hairColor: HAIR_COLORS,
  clothesColor: CLOTHING_COLORS_DEFAULT
}

const HISTORY_LIMIT = 20

// DiceBear color values must be HEX without the leading "#"
// because the SVG template already prefixes "#" itself.
const stripHash = (color) => {
  if (!color) return color
  return String(color).trim().replace(/^#+/, '').toLowerCase()
}

const normalizeColorList = (list) => {
  if (!Array.isArray(list)) return list
  return list.map(stripHash)
}

// Migrate legacy color keys (topColor → hairColor, clothingColor → clothesColor)
// because DiceBear v7 avataaars uses those names.
const migrateConfigs = (configs) => {
  if (!configs || typeof configs !== 'object') return configs
  const next = { ...configs }
  if (Array.isArray(next.topColor) && !Array.isArray(next.hairColor)) {
    next.hairColor = next.topColor
    delete next.topColor
  }
  if (
    Array.isArray(next.clothingColor) &&
    !Array.isArray(next.clothesColor)
  ) {
    next.clothesColor = next.clothingColor
    delete next.clothingColor
  }
  return next
}

const HAT_TOPS_SET = new Set([
  'hat',
  'hijab',
  'turban',
  'winterHat1',
  'winterHat02',
  'winterHat03',
  'winterHat04'
])

const COLOR_FIELDS = ['skinColor', 'hairColor', 'clothesColor']

const buildInitial = () => {
  const seed = crypto.randomUUID()
  return {
    seed,
    avatar: getAvatar({ seed, configs: CONFIG_AVATAAARS.avataaars.configs_initial }),
    name: getRandomName(),
    configs: { ...CONFIG_AVATAAARS.avataaars.configs_initial }
  }
}

const pickRandom = (arr) => arr[getRandomInt(0, arr.length)]

// Pick a value from `arr` that's not equal to `current` (when possible).
// `current` is a string; the array may be of strings. We compare directly
// and fall back to random pick if `current` is missing or arr has 1 item.
const pickDifferent = (arr, current) => {
  if (!arr || arr.length === 0) return undefined
  if (arr.length === 1 || current == null) return pickRandom(arr)
  const filtered = arr.filter((v) => v !== current)
  return filtered.length > 0 ? pickRandom(filtered) : pickRandom(arr)
}

export const useAvatarStore = create()(
  persist(
    (set, get) => ({
      ...buildInitial(),
      history: [],
      historyIndex: -1,

      pushHistory: () => {
        const { seed, name, configs, history, historyIndex } = get()
        const snapshot = { seed, name, configs: { ...configs } }
        const next = [...history.slice(0, historyIndex + 1), snapshot].slice(
          -HISTORY_LIMIT
        )
        set({ history: next, historyIndex: next.length - 1 })
      },

      updateAvatar: () => {
        const newSeed = crypto.randomUUID()
        const avatar = getAvatar({ seed: newSeed })
        const name = getRandomName()
        set({ seed: newSeed, avatar, name })
        get().pushHistory()
      },

      setName: (name) => {
        const trimmed = String(name ?? '').trim().slice(0, 32) || get().name
        set({ name: trimmed })
        get().pushHistory()
      },

      shuffleAll: () => {
        const newSeed = crypto.randomUUID()
        const initial = CONFIG_AVATAAARS.avataaars.configs_initial
        const prev = get().configs

        // Pick a new random value for each feature, avoiding the current one
        // when possible — this guarantees visible variety between clicks.
        const pickOne = (key, list = initial[key]) => {
          if (!Array.isArray(list) || list.length === 0) return undefined
          const current = Array.isArray(prev?.[key]) ? prev[key][0] : undefined
          return [pickDifferent(list, current)]
        }

        // For `top`, prefer a hair style (not a hat) so the hair-color
        // picker is always meaningful. The user can still pick a hat from
        // the editor.
        const prevTop = prev?.top
        const currentTop = Array.isArray(prevTop) ? prevTop[0] : undefined
        const isCurrentHat = HAT_TOPS_SET.has(currentTop)
        const topList = isCurrentHat ? ALL_TOPS : SHUFFLE_TOPS
        const newTop = pickDifferent(topList, isCurrentHat ? undefined : currentTop)

        const newColors = {
          skinColor: [
            stripHash(
              pickDifferent(
                SKIN_COLORS,
                Array.isArray(prev?.skinColor) ? prev.skinColor[0] : undefined
              )
            )
          ],
          hairColor: [
            stripHash(
              pickDifferent(
                HAIR_COLORS,
                Array.isArray(prev?.hairColor) ? prev.hairColor[0] : undefined
              )
            )
          ],
          clothesColor: [
            stripHash(
              pickDifferent(
                CLOTHING_COLORS_DEFAULT,
                Array.isArray(prev?.clothesColor)
                  ? prev.clothesColor[0]
                  : undefined
              )
            )
          ]
        }

        // Build new configs: explicit single-value arrays for each feature,
        // randomizeIds OFF so DiceBear uses exactly what we set.
        const newConfigs = {
          ...initial,
          size: prev?.size ?? initial.size,
          randomizeIds: false,
          accessories: pickOne('accessories'),
          accessoriesProbability: 100,
          top: [newTop],
          topProbability: 100,
          facialHair: pickOne('facialHair'),
          facialHairProbability: 100,
          mouth: pickOne('mouth'),
          eyes: pickOne('eyes'),
          eyebrows: pickOne('eyebrows'),
          clothing: pickOne('clothing'),
          clothingGraphic: pickOne('clothingGraphic'),
          ...newColors
        }

        set({
          seed: newSeed,
          name: getRandomName(),
          configs: newConfigs,
          avatar: getAvatar({ seed: newSeed, configs: newConfigs })
        })
        get().pushHistory()
      },

      randomizeColors: () => {
        const { seed, configs } = get()
        const prev = configs || {}
        const newColors = {
          skinColor: [
            stripHash(
              pickDifferent(
                SKIN_COLORS,
                Array.isArray(prev.skinColor) ? prev.skinColor[0] : undefined
              )
            )
          ],
          hairColor: [
            stripHash(
              pickDifferent(
                HAIR_COLORS,
                Array.isArray(prev.hairColor) ? prev.hairColor[0] : undefined
              )
            )
          ],
          clothesColor: [
            stripHash(
              pickDifferent(
                CLOTHING_COLORS_DEFAULT,
                Array.isArray(prev.clothesColor)
                  ? prev.clothesColor[0]
                  : undefined
              )
            )
          ]
        }
        const newConfigs = { ...prev, ...newColors }
        set({
          configs: newConfigs,
          avatar: getAvatar({ seed, configs: newConfigs })
        })
        get().pushHistory()
      },

      loadAvatar: ({ seed, configs, name }) => {
        const base = CONFIG_AVATAAARS.avataaars.configs_initial
        const finalConfigs = migrateConfigs(
          configs ? { ...base, ...configs } : { ...base }
        )
        // Normalize color values (strip leading "#")
        COLOR_FIELDS.forEach((k) => {
          if (finalConfigs[k]) finalConfigs[k] = normalizeColorList(finalConfigs[k])
        })
        set({
          seed,
          name: name || getRandomName(),
          configs: finalConfigs,
          avatar: getAvatar({ seed, configs: finalConfigs })
        })
        get().pushHistory()
      },

      editAvatar: (changes) => {
        const { seed, configs } = get()
        const normalized = migrateConfigs({ ...changes })
        COLOR_FIELDS.forEach((k) => {
          if (normalized[k]) normalized[k] = normalizeColorList(normalized[k])
        })
        const newConfigs = { ...configs, ...normalized }
        set({
          avatar: getAvatar({ seed, configs: newConfigs }),
          configs: newConfigs
        })
        get().pushHistory()
      },

      randomizePart: (partName) => {
        if (COLOR_PALETTES[partName]) {
          const prev = get().configs?.[partName]
          const current = Array.isArray(prev) ? prev[0] : undefined
          const color = stripHash(
            pickDifferent(COLOR_PALETTES[partName], current)
          )
          get().editAvatar({ [partName]: [color] })
          return
        }
        const options = CONFIG_AVATAAARS.avataaars.configs_initial[partName]
        if (!options || !Array.isArray(options) || options.length === 0) return
        const prev = get().configs?.[partName]
        const current = Array.isArray(prev) ? prev[0] : undefined
        const pick = pickDifferent(options, current)
        get().editAvatar({ [partName]: [pick] })
      },

      undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex <= 0) return
        const prev = history[historyIndex - 1]
        if (!prev) return
        set({
          seed: prev.seed,
          name: prev.name,
          configs: { ...prev.configs },
          avatar: getAvatar({ seed: prev.seed, configs: prev.configs }),
          historyIndex: historyIndex - 1
        })
      },

      redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex >= history.length - 1) return
        const next = history[historyIndex + 1]
        if (!next) return
        set({
          seed: next.seed,
          name: next.name,
          configs: { ...next.configs },
          avatar: getAvatar({ seed: next.seed, configs: next.configs }),
          historyIndex: historyIndex + 1
        })
      },

      resetAvatar: () => {
        const init = buildInitial()
        set({ ...init })
        get().pushHistory()
      }
    }),
    {
      name: 'avatars-dev-current',
      partialize: (state) => ({
        seed: state.seed,
        name: state.name,
        configs: state.configs
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const { seed, configs } = state
        if (seed && configs) {
          // Migrate legacy color keys and normalize any persisted color values
          const migrated = migrateConfigs(configs)
          COLOR_FIELDS.forEach((k) => {
            if (migrated[k]) migrated[k] = normalizeColorList(migrated[k])
          })
          state.configs = migrated
          state.avatar = getAvatar({ seed, configs: migrated })
        }
      }
    }
  )
)

export { stripHash }
