import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { artistInfo } from '../data/artist';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 bg-near-black">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="font-display font-bold text-warm-white mb-6 tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: '1.1'
            }}
          >
            LET'S CREATE
            <br />
            SOMETHING DISTINCTIVE.
          </h2>
          
          <p className="text-warm-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Have a project in mind? Let's talk.
          </p>

          <div className="space-y-6 mb-12">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-muted-gray text-sm uppercase tracking-wider mb-2">Phone</p>
              <a
                href={artistInfo.contact.phoneLink}
                className="text-warm-white font-display text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity"
              >
                {artistInfo.contact.phone}
              </a>
            </motion.div>

            {/* Email - Note: incomplete in brief */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-muted-gray text-sm uppercase tracking-wider mb-2">Email</p>
              <p className="text-warm-white/50 text-sm italic">
                Email address to be confirmed
              </p>
            </motion.div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <a
              href={artistInfo.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-white text-base font-medium hover:opacity-70 transition-opacity"
            >
              Instagram
            </a>
            <span className="text-white/20">•</span>
            <a
              href={artistInfo.contact.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-white text-base font-medium hover:opacity-70 transition-opacity"
            >
              TikTok
            </a>
            <span className="text-white/20">•</span>
            <a
              href={artistInfo.contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-white text-base font-medium hover:opacity-70 transition-opacity"
            >
              Telegram
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12"
          >
            <button
              onClick={() => {
                const element = document.getElementById('work');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-warm-white text-near-black font-medium text-base uppercase tracking-wider hover:scale-105 transition-transform duration-300"
            >
              Start a Project
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="10" x2="15" y2="10" />
                <polyline points="12,7 15,10 12,13" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
