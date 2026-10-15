import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SectionHeading({ title, subtitle, centered = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="font-display font-bold text-warm-white text-4xl md:text-6xl tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-gray text-base md:text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
