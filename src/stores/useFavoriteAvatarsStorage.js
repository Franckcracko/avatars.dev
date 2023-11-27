import { create } from 'zustand'

const initialStateFavorites = JSON.parse(localStorage.getItem('avatarsFavorites')) || []

export const useFavoriteAvatarsStorage = create((set) => ({
  favorites: initialStateFavorites,
  findFavoriteAvatar: (id) => {
    const favorites = JSON.parse(localStorage.getItem('avatarsFavorites')) || []
    return favorites.find(favorite => favorite.id === id)
  },
  addFavoriteAvatar: (avatar) => set((state) => {
    const newFavorites = [...state.favorites, avatar]
    localStorage.setItem('avatarsFavorites', JSON.stringify(newFavorites))
    return { favorites: newFavorites }
  }),
  removeFavoriteAvatar: (id) => set((state) => {
    const newFavorites = state.favorites.filter(favorite => favorite.id !== id)
    localStorage.setItem('avatarsFavorites', JSON.stringify(newFavorites))
    return { favorites: newFavorites }
  }),
  clearFavorites: () => set(() => {
    localStorage.removeItem('avatarsFavorites')
    return { favorites: [] }
  })
}))
