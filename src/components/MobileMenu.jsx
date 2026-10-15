import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { artistInfo } from '../data/artist';

export default function MobileMenu({ isOpen, onClose, navLinks, scrollToSection }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = (id) => {
    scrollToSection(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-near-black"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <span className="text-warm-white font-display text-xl font-bold">MR. JON</span>
              <button
                onClick={onClose}
                className="text-warm-white p-2"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  onClick={() => handleNavClick(link.id)}
                  className="text-warm-white font-display text-4xl font-bold text-left hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-8 border-t border-white/10"
            >
              <p className="text-muted-gray text-xs uppercase tracking-wider mb-4">Follow</p>
              <div className="flex flex-col gap-3">
                <a
                  href={artistInfo.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-white text-lg hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
                <a
                  href={artistInfo.contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-white text-lg hover:opacity-70 transition-opacity"
                >
                  TikTok
                </a>
                <a
                  href={artistInfo.contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-white text-lg hover:opacity-70 transition-opacity"
                >
                  Telegram
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
