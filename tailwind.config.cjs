/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#111111',
        'near-black': '#080808',
        'warm-white': '#F4F1EB',
        'muted-gray': '#A5A5A5',
        'primary-blue': '#1769FF',
        'light-blue': '#EAF1FF',
        'sky-blue': '#EAF1FF',
        'dark-blue': '#0B2F86',
        'slate-text': '#1E293B',
        'slate-light': '#64748B',
        'bg-white': '#FFFFFF',
        'bg-light': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        stencil: ['Black Ops One', 'Impact', 'sans-serif'],
      },
      fontSize: {
        'display-xl': 'clamp(3.5rem, 10vw, 8rem)',
        'display-lg': 'clamp(2.5rem, 7vw, 5rem)',
        'display-md': 'clamp(2rem, 5vw, 3.5rem)',
      },
      letterSpacing: {
        display: '-0.02em',
      },
    },
  },
  plugins: [],
};
