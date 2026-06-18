import { create } from 'zustand'

const STORAGE_KEY = 'avatarsFavorites'

const readFavorites = () => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const writeFavorites = (favorites) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

const initialFavorites = readFavorites()

export const useFavoriteAvatarsStorage = create((set, get) => ({
  favorites: initialFavorites,

  findFavoriteAvatar: (id) => {
    return get().favorites.find((favorite) => favorite.id === id)
  },

  isFavorite: (id) => !!get().favorites.find((f) => f.id === id),

  addFavoriteAvatar: (avatar) =>
    set((state) => {
      if (state.favorites.some((f) => f.id === avatar.id)) return state
      const newFavorites = [avatar, ...state.favorites]
      writeFavorites(newFavorites)
      return { favorites: newFavorites }
    }),

  removeFavoriteAvatar: (id) =>
    set((state) => {
      const newFavorites = state.favorites.filter((favorite) => favorite.id !== id)
      writeFavorites(newFavorites)
      return { favorites: newFavorites }
    }),

  toggleFavorite: (avatar) => {
    if (get().isFavorite(avatar.id)) {
      get().removeFavoriteAvatar(avatar.id)
    } else {
      get().addFavoriteAvatar(avatar)
    }
  },

  clearFavorites: () =>
    set(() => {
      writeFavorites([])
      return { favorites: [] }
    })
}))
