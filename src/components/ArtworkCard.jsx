import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ArtworkCard({ artwork, onClick, index, variant = 'default' }) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine card size based on variant and featured status
  const getCardClass = () => {
    if (artwork.featured && variant === 'masonry') {
      return 'md:col-span-2 md:row-span-2';
    }
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative cursor-pointer overflow-hidden bg-charcoal ${getCardClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(artwork)}
      style={{ aspectRatio: artwork.featured ? '16/10' : '4/5' }}
    >
      {/* Image */}
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover"
          style={{ objectPosition: artwork.objectPosition || 'center' }}
          loading="lazy"
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/60 to-transparent"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 p-6 flex flex-col justify-end"
      >
        <p className="text-muted-gray text-xs uppercase tracking-wider mb-2">
          {artwork.category?.replace('-', ' ')}
        </p>
        <h3 className="text-warm-white font-display font-bold text-xl md:text-2xl mb-3">
          {artwork.title}
        </h3>
        <div className="flex items-center gap-2 text-warm-white text-sm">
          <span>View Project</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="8" x2="12" y2="8" />
            <polyline points="9,5 12,8 9,11" />
          </svg>
        </div>
      </motion.div>

      {/* Mobile-friendly title (always visible on touch devices) */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-near-black to-transparent">
        <p className="text-warm-white font-medium text-sm">{artwork.title}</p>
      </div>
    </motion.div>
  );
}
