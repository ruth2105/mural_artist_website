import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { artistInfo } from '../data/artist';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" ref={ref} className="relative overflow-x-clip py-24 md:py-32 bg-gradient-to-br from-light-blue/30 via-white to-sky-blue/20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-light-blue/50 shadow-xl shadow-primary-blue/10">
              <img
                src={artistInfo.profileImage}
                alt="Mr Jon painting a mural"
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <p className="text-slate-light text-xs uppercase tracking-[0.3em] mb-4">
              The Artist
            </p>
            <h2 className="font-display font-bold text-slate-text text-4xl md:text-5xl mb-6 tracking-tight">
              ART WITHOUT BOUNDARIES.
            </h2>
            <div className="space-y-4 text-slate-text/80 text-base md:text-lg leading-relaxed">
              {artistInfo.biography.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Skills */}
            <div className="mt-8 pt-8 border-t border-primary-blue/20">
              <p className="text-slate-light text-sm uppercase tracking-wider mb-4">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {artistInfo.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-light-blue/50 text-primary-blue text-sm border border-primary-blue/30 rounded-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
