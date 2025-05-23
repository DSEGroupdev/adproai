/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-light': '#fffaf0',
        'gold-hover': '#caa733',
      },
    },
  },
  plugins: [],
} 