import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { services } from '../data/services';
import SectionHeading from './SectionHeading';

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" ref={ref} className="relative py-24 md:py-32 bg-near-black">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading
          title="SERVICES"
          subtitle="Transforming spaces and brands through art"
          centered
        />

        <div className="space-y-16 md:space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Service Number */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="flex-shrink-0">
                  <span className="text-warm-white/20 font-display font-bold text-6xl md:text-8xl">
                    {service.id}
                  </span>
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="text-warm-white font-display font-bold text-2xl md:text-4xl mb-4 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-warm-white/70 text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="flex-shrink-0 mt-1"
                        >
                          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" className="text-warm-white/30" />
                          <circle cx="10" cy="10" r="4" fill="currentColor" className="text-warm-white" />
                        </svg>
                        <span className="text-warm-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Divider */}
              {index < services.length - 1 && (
                <div className="mt-16 md:mt-24 h-[1px] bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-warm-white text-near-black font-medium text-sm uppercase tracking-wider hover:scale-105 transition-transform duration-300"
          >
            Discuss a Project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="8" x2="12" y2="8" />
              <polyline points="9,5 12,8 9,11" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
