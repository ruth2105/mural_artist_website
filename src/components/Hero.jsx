import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Hero({ onExploreClick, onContactClick }) {
  const prefersReducedMotion = useReducedMotion();

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-near-black">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-near-black/60 via-near-black/40 to-near-black/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=85"
          alt="Featured mural artwork"
          className="w-full h-full object-cover"
        />
        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-muted-gray text-xs md:text-sm uppercase tracking-[0.3em] mb-6">
            Visual Artist / Muralist / Designer
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold text-warm-white mb-6"
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            lineHeight: '0.9',
            letterSpacing: '-0.02em'
          }}
        >
          MR. JON
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-warm-white text-xl md:text-3xl font-display font-medium mb-8 tracking-tight"
        >
          Art without Boundaries.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-warm-white/80 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          From large-scale mural installations and custom graffiti to complete brand identity and graphic design, 
          I bring creative visions to life in physical and digital spaces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToWork}
            className="group relative px-8 py-4 bg-warm-white text-near-black font-medium text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Explore The Work</span>
            <div className="absolute inset-0 bg-near-black transform translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
            <span className="absolute inset-0 z-10 flex items-center justify-center text-warm-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore The Work
            </span>
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border-2 border-warm-white text-warm-white font-medium text-sm uppercase tracking-wider hover:bg-warm-white hover:text-near-black transition-all duration-300"
          >
            Start A Project
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToWork}
        >
          <p className="text-warm-white/60 text-xs uppercase tracking-wider">Scroll</p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-warm-white/60"
          >
            <line x1="10" y1="5" x2="10" y2="15" />
            <polyline points="6,11 10,15 14,11" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
