/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary_color: '#348E91',
        primary_color_dark: '#1C5052',
        white_secondary: '#F2F2F2',
        dark_secondary: '#0A0C0D'
      }
    }
  },
  plugins: []
}
