const colors = require('tailwindcss/colors')
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        rose: colors.rose,
        pink: colors.pink,
        blueGray: colors.blueGray,
        coolGray: colors.coolGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
