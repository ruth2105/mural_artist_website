import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { process } from '../data/services';

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-warm-white text-4xl md:text-5xl mb-4 tracking-tight">
            CREATIVE PROCESS
          </h2>
          <p className="text-muted-gray text-lg">
            From initial concept to final artwork
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {process.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative text-center"
            >
              {/* Connector Line (Desktop) */}
              {index < process.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-white/10" />
              )}
              
              {/* Number Circle */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-warm-white bg-charcoal mb-6">
                <span className="text-warm-white font-display text-2xl font-bold">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-warm-white font-display font-bold text-xl mb-2">
                {step.title}
              </h3>
              <p className="text-muted-gray text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
