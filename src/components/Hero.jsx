import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { artistInfo } from '../data/artist';

export default function Hero({ onExploreClick, onContactClick }) {
  const prefersReducedMotion = useReducedMotion();

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-light-blue via-white to-sky-blue/20">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-light-blue/90 to-white/95 z-10" />
        <img
          src="https://utuagxjsqluwmexkinik.supabase.co/storage/v1/object/public/artwork/portfolio-media/Mr%20Jon/Mrr%20Jon/main%20page/For%20Front%20Page.webp"
          alt="Artist working on a wall mural"
          className="w-full h-full object-cover object-[center_45%]"
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
          <p className="text-slate-light text-xs md:text-sm uppercase tracking-[0.3em] mb-6">
            Visual Artist / Muralist / Designer
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-stencil text-slate-text mb-6"
          style={{
            fontSize: 'clamp(3rem, 10.5vw, 8rem)',
            lineHeight: '0.95',
            letterSpacing: '0.015em'
          }}
        >
          {artistInfo.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-primary-blue text-xl md:text-3xl font-display font-medium mb-8 tracking-tight"
        >
          Art without Boundaries.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-slate-text/90 text-base md:text-lg max-w-3xl mx-auto mb-12 leading-relaxed"
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
            className="group relative px-8 py-4 bg-primary-blue text-white font-medium text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-dark-blue shadow-lg shadow-primary-blue/30"
          >
            <span className="relative z-10">Explore The Work</span>
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border-2 border-primary-blue text-primary-blue font-medium text-sm uppercase tracking-wider hover:bg-primary-blue hover:text-white transition-all duration-300"
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
          <p className="text-slate-light text-xs uppercase tracking-wider">Scroll</p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-light"
          >
            <line x1="10" y1="5" x2="10" y2="15" />
            <polyline points="6,11 10,15 14,11" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
