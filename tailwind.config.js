/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#111827',
          raised: '#1f2937',
        },
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
}

