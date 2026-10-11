/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f4',
          100: '#e0efe9',
          200: '#bfdec5',
          300: '#92c5a7',
          400: '#5da783',
          500: '#388865',
          600: '#286c4f',
          700: '#205640',
          800: '#1a4534',
          900: '#15392b',
          950: '#0b2018',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        sand: {
          50: '#fbfbf9',
          100: '#f6f5f0',
          200: '#eeece2',
          300: '#e0ddd0',
          400: '#cbc5b4',
          500: '#b2a994',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 25px -5px rgba(21, 57, 43, 0.08), 0 8px 10px -6px rgba(21, 57, 43, 0.04)',
        'glow': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
