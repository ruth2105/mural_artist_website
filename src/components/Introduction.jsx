import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-charcoal overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-white/[0.02] via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="font-display font-bold text-warm-white mb-8 tracking-tight"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.01em'
            }}
          >
            ART WITHOUT
            <br />
            <span className="text-muted-gray">BOUNDARIES.</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-warm-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            From walls and physical spaces to visual identities and digital artwork, 
            every project is an opportunity to explore a new creative direction.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
