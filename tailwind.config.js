/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        culinary: {
          50: '#fffbe1',
          100: '#fff3b8',
          200: '#ffe685',
          300: '#ffd247',
          400: '#fcc019',
          500: '#f5a300', // Primary Amber Accent
          600: '#d97f00',
          700: '#ad5a00',
          800: '#8c4405',
          900: '#73370a',
          950: '#431b03',
        },
        terracotta: {
          500: '#e05a47',
          600: '#c84332',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};