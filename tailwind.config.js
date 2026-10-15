/** @type {import('tailwindcss').Config} */
export default {
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': 'clamp(3.5rem, 10vw, 8rem)',
        'display-lg': 'clamp(2.5rem, 7vw, 5rem)',
        'display-md': 'clamp(2rem, 5vw, 3.5rem)',
      },
      letterSpacing: {
        'display': '-0.02em',
      },
    },
  },
  plugins: [],
}
