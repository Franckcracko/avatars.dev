import { avataaars } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { CONFIG_AVATAAARS } from '@/configs/avatar'

const PREVIEW_SIZE = 96
const PREVIEW_SEED = 'preview-avatar'

const baseConfigs = CONFIG_AVATAAARS.avataaars.configs_initial

const PREVIEW_KEYS = [
  'eyes',
  'eyebrows',
  'mouth',
  'facialHair',
  'top',
  'accessories',
  'clothing',
  'clothingGraphic'
]

const COLOR_KEY_MAP = {
  skin: 'skinColor',
  hair: 'hairColor',
  clothing: 'clothesColor'
}

const cache = new Map()

const buildUri = (key, value) => {
  const cacheKey = `${key}:${value}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const uri = createAvatar(avataaars, {
    ...baseConfigs,
    [key]: [value],
    seed: PREVIEW_SEED,
    size: PREVIEW_SIZE
  }).toDataUriSync()

  cache.set(cacheKey, uri)
  return uri
}

export const getOptionPreview = (key, value) => {
  if (!PREVIEW_KEYS.includes(key)) return ''
  return buildUri(key, value)
}

export const getColorPreview = (colorKind, color) => {
  const configKey = COLOR_KEY_MAP[colorKind]
  if (!configKey) return ''
  return buildUri(configKey, color)
}

// Friendly labels for the option codes
export const optionLabel = (value) => {
  if (!value) return ''
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
