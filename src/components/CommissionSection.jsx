import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import CommissionForm from './CommissionForm';

export default function CommissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [showForm, setShowForm] = useState(false);

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-near-black">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {!showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h2 className="font-display font-bold text-warm-white text-5xl md:text-7xl mb-6 tracking-tight">
              HAVE AN IDEA?
            </h2>
            <p className="text-warm-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Let's discuss your next mural, visual identity, or creative project.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 px-10 py-5 bg-warm-white text-near-black font-medium text-base uppercase tracking-wider hover:scale-105 transition-transform duration-300"
            >
              Start a Project
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="10" x2="15" y2="10" />
                <polyline points="12,7 15,10 12,13" />
              </svg>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center gap-2 text-warm-white/70 hover:text-warm-white transition-colors text-sm mb-6"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="8" x2="4" y2="8" />
                  <polyline points="7,5 4,8 7,11" />
                </svg>
                Back
              </button>
              <h2 className="font-display font-bold text-warm-white text-4xl md:text-5xl mb-3 tracking-tight">
                Project Inquiry
              </h2>
              <p className="text-warm-white/70 text-lg">
                Fill out the details below and I'll get back to you soon.
              </p>
            </div>
            <CommissionForm />
          </motion.div>
        )}
      </div>
    </section>
  );
}
