/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070b12',
        card: '#0d1322',
        accent: '#2563eb',
      }
    },
  },
  plugins: [],
}
