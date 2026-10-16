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
      whileHover={{ y: -8 }}
      className={`group relative cursor-pointer overflow-hidden bg-charcoal rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-500 ${getCardClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(artwork)}
      style={{ aspectRatio: artwork.featured ? '16/10' : '4/5' }}
    >
      {/* Image */}
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover"
          style={{ 
            objectPosition: artwork.objectPosition || 'center',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
          }}
          loading="lazy"
        />
      </motion.div>

      {/* Animated Border Glow */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.95
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 border-2 border-warm-white/30 rounded-lg pointer-events-none"
      />

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-t from-near-black/95 via-near-black/70 to-transparent"
      />

      {/* Glow Effect */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-radial from-warm-white/20 via-transparent to-transparent blur-2xl pointer-events-none"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : 20 
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute inset-0 p-6 flex flex-col justify-end z-10"
      >
        <motion.p 
          className="text-warm-white/80 text-xs uppercase tracking-widest mb-2 font-medium"
          animate={{ x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {artwork.category?.replace('-', ' ')}
        </motion.p>
        
        <motion.h3 
          className="text-warm-white font-display font-bold text-xl md:text-2xl mb-3 drop-shadow-lg"
          animate={{ x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {artwork.title}
        </motion.h3>
        
        <motion.div 
          className="flex items-center gap-2 text-warm-white text-sm font-medium"
          animate={{ x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <span>View Project</span>
          <motion.svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <line x1="4" y1="8" x2="12" y2="8" />
            <polyline points="9,5 12,8 9,11" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Featured Badge */}
      {artwork.featured && (
        <motion.div 
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.3 
          }}
          className="absolute top-4 right-4 bg-warm-white text-near-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 flex items-center gap-1"
        >
          <span className="text-sm">⭐</span>
          <span>Featured</span>
        </motion.div>
      )}

      {/* Mobile-friendly title (always visible on touch devices) */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-near-black/90 to-transparent">
        <p className="text-warm-white font-medium text-sm drop-shadow-md">{artwork.title}</p>
        <p className="text-warm-white/60 text-xs mt-1">{artwork.category?.replace('-', ' ')}</p>
      </div>
    </motion.div>
  );
}
