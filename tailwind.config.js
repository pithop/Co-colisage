/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A1128',
          navy: '#0F172A',
          blue: '#2563EB',
          'blue-dark': '#1D4ED8',
          'blue-light': '#3B82F6',
          emerald: '#10B981',
          'emerald-dark': '#059669',
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
          slate: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'elevated': '0 12px 36px -4px rgba(15, 23, 42, 0.10), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        'modal': '0 25px 60px -15px rgba(10, 17, 40, 0.35)',
      }
    },
  },
  plugins: [],
}
