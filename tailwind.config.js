/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original dark theme (keeping for admin dashboard)
        charcoal: '#111111',
        'near-black': '#080808',
        'warm-white': '#F4F1EB',
        'muted-gray': '#A5A5A5',
        
        // New light blue/white theme
        'primary-blue': '#3B82F6',      // Bright blue
        'light-blue': '#DBEAFE',        // Very light blue
        'sky-blue': '#60A5FA',          // Medium sky blue
        'dark-blue': '#1E40AF',         // Dark blue
        'slate-text': '#1E293B',        // Dark slate for text
        'slate-light': '#64748B',       // Light slate for secondary text
        'bg-white': '#FFFFFF',          // Pure white
        'bg-light': '#F8FAFC',          // Very light gray-blue
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
        'display': '-0.02em',
      },
    },
  },
  plugins: [],
}
