/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#ffffff',
        accent: '#f59e0b',
        'accent-dark': '#d97706',
      },
    },
  },
  plugins: [],
}
