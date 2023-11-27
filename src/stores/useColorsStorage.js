import { create } from 'zustand'

const colorsInitial = JSON.parse(localStorage.getItem('colors')) || []
export const useColorsStore = create((set) => ({
  colors: colorsInitial,
  addColor: (color) => set((state) => {
    if (state.colors.find(value => value === color)) return { colors: state.colors }
    const colors = [...state.colors, color]
    localStorage.setItem('colors', JSON.stringify(colors))
    return { colors }
  }),
  removeColor: (color) => set((state) => {
    const colors = state.colors.filter(c => c !== color)
    localStorage.setItem('colors', JSON.stringify(colors))
    return { colors }
  }),
  resetColors: () => set(() => {
    localStorage.removeItem('colors')
    return { colors: [] }
  })
}))
