/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D5BD9',
        },
        navy: {
          DEFAULT: '#1C2B4A',
        },
        surface: {
          DEFAULT: '#F3F6FC',
        },
        background: '#EEF2F8',
      },
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
