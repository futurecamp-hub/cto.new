/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cto-primary': '#3B82F6',
        'cto-secondary': '#1F2937',
        'cto-gray': '#F8FAFC',
        'cto-dark-gray': '#64748B'
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
