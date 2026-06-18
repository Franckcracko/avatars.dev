import { create } from 'zustand'

const STORAGE_KEY = 'avatars-dev-preferences'

// Accent color presets: each entry is a pair of CSS color values (any format
// that the browser accepts) that get applied to --primary and --accent on
// the document root, so the whole app re-themes instantly.
export const ACCENT_PRESETS = {
  teal: {
    id: 'teal',
    label: 'Verde agua',
    swatch: '#0d9488',
    primary: 'oklch(0.55 0.13 192)',
    accent: 'oklch(0.7 0.18 25)'
  },
  sky: {
    id: 'sky',
    label: 'Cielo',
    swatch: '#0ea5e9',
    primary: 'oklch(0.6 0.14 230)',
    accent: 'oklch(0.72 0.18 25)'
  },
  violet: {
    id: 'violet',
    label: 'Violeta',
    swatch: '#8b5cf6',
    primary: 'oklch(0.58 0.18 295)',
    accent: 'oklch(0.72 0.18 25)'
  },
  pink: {
    id: 'pink',
    label: 'Rosa',
    swatch: '#ec4899',
    primary: 'oklch(0.62 0.2 350)',
    accent: 'oklch(0.72 0.18 50)'
  },
  amber: {
    id: 'amber',
    label: 'Ámbar',
    swatch: '#f59e0b',
    primary: 'oklch(0.66 0.16 75)',
    accent: 'oklch(0.6 0.2 25)'
  },
  emerald: {
    id: 'emerald',
    label: 'Esmeralda',
    swatch: '#22c55e',
    primary: 'oklch(0.6 0.16 155)',
    accent: 'oklch(0.72 0.18 25)'
  },
  red: {
    id: 'red',
    label: 'Rojo',
    swatch: '#ef4444',
    primary: 'oklch(0.6 0.2 25)',
    accent: 'oklch(0.72 0.18 80)'
  },
  ink: {
    id: 'ink',
    label: 'Tinta',
    swatch: '#0a0a0a',
    primary: 'oklch(0.35 0.02 250)',
    accent: 'oklch(0.7 0.18 25)'
  }
}

const DEFAULTS = {
  theme: 'system',
  avatarSize: 256,
  downloadFormat: 'svg',
  avatarStyle: 'rounded',
  accentColor: 'teal',
  backgroundColor: 'transparent',
  useAvatarNameForDownload: true,
  reduceMotion: false,
  showConfetti: true,
  rouletteDuration: 1400,
  customColors: {
    skinColor: [],
    hairColor: [],
    clothesColor: []
  }
}

const initial = (() => {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      ...DEFAULTS,
      ...stored,
      customColors: { ...DEFAULTS.customColors, ...(stored.customColors || {}) }
    }
  } catch {
    return DEFAULTS
  }
})()

const persist = (state) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const setCustomColor = (state, key, color) => {
  const list = state.customColors[key] || []
  if (list.includes(color)) return state
  return {
    customColors: {
      ...state.customColors,
      [key]: [...list, color]
    }
  }
}

const removeCustomColor = (state, key, color) => {
  const list = state.customColors[key] || []
  return {
    customColors: {
      ...state.customColors,
      [key]: list.filter((c) => c !== color)
    }
  }
}

export const usePreferencesStore = create((set, get) => ({
  ...initial,
  setPreference: (key, value) =>
    set((state) => {
      const next = { ...state, [key]: value }
      persist(next)
      return { [key]: value }
    }),
  setPreferences: (changes) =>
    set((state) => {
      const next = { ...state, ...changes }
      persist(next)
      return changes
    }),
  addCustomColor: (key, color) =>
    set((state) => {
      const next = { ...state, ...setCustomColor(state, key, color) }
      persist(next)
      return next
    }),
  removeCustomColor: (key, color) =>
    set((state) => {
      const next = { ...state, ...removeCustomColor(state, key, color) }
      persist(next)
      return next
    }),
  clearCustomColors: (key) =>
    set((state) => {
      const next = {
        ...state,
        customColors: { ...state.customColors, [key]: [] }
      }
      persist(next)
      return next
    }),
  resetPreferences: () =>
    set(() => {
      persist(DEFAULTS)
      return DEFAULTS
    })
}))

export const PREFERENCE_KEYS = Object.keys(DEFAULTS)
