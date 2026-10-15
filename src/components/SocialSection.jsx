import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { artistInfo } from '../data/artist';

export default function SocialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const socialLinks = [
    {
      name: 'TikTok',
      handle: artistInfo.contact.tiktokHandle,
      url: artistInfo.contact.tiktok,
      description: 'Behind-the-scenes and creative process'
    },
    {
      name: 'Instagram',
      handle: artistInfo.contact.instagramHandle,
      url: artistInfo.contact.instagram,
      description: 'Latest work and project updates'
    },
    {
      name: 'Telegram',
      handle: '@MrJo240',
      url: artistInfo.contact.telegram,
      description: 'Direct communication'
    }
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-charcoal">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-warm-white text-4xl md:text-5xl mb-4 tracking-tight">
            FOLLOW THE ART.
          </h2>
          <p className="text-muted-gray text-lg">
            Connect and stay updated on new projects
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-warm-white font-display font-bold text-2xl mb-2">
                  {social.name}
                </h3>
                <p className="text-muted-gray text-sm mb-1">{social.handle}</p>
                <p className="text-warm-white/60 text-sm">{social.description}</p>
              </div>
              <div className="flex items-center gap-2 text-warm-white text-sm font-medium">
                <span>Visit Profile</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <line x1="4" y1="8" x2="12" y2="8" />
                  <polyline points="9,5 12,8 9,11" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
