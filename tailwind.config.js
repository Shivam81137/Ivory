/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#050b14',
        'navy-mid': '#0d1b3e',
        'navy-light': '#1a2f55',
        'cyan-accent': '#32e0ff',
        'purple-accent': '#a55eea',
        'neon-accent': '#32e0ff',
      }
    },
  },
  plugins: [],
}
