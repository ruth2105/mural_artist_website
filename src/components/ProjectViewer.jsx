import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { artworks } from '../data/artworks';

export default function ProjectViewer({ project, onClose, onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (project) {
      const index = artworks.findIndex(a => a.id === project.id);
      setCurrentIndex(index);
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!project) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, currentIndex]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : artworks.length - 1;
    setCurrentIndex(newIndex);
    onNavigate(artworks[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < artworks.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onNavigate(artworks[newIndex]);
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-near-black/98 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 text-warm-white p-2 hover:opacity-70 transition-opacity z-10"
                aria-label="Close viewer"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="24" y1="8" x2="8" y2="24" />
                  <line x1="8" y1="8" x2="24" y2="24" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative bg-charcoal mb-8 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  style={{ objectPosition: project.objectPosition || 'center' }}
                />
              </div>

              {/* Project Info */}
              <div className="text-center md:text-left">
                <p className="text-muted-gray text-xs uppercase tracking-wider mb-3">
                  {project.category?.replace('-', ' ')}
                </p>
                <h2 className="text-warm-white font-display font-bold text-3xl md:text-5xl mb-4">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="text-warm-white/70 text-lg leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12">
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 text-warm-white hover:opacity-70 transition-opacity"
                  aria-label="Previous project"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12,19 5,12 12,5" />
                  </svg>
                  <span className="text-sm uppercase tracking-wider hidden md:inline">Previous</span>
                </button>

                <span className="text-muted-gray text-sm">
                  {currentIndex + 1} / {artworks.length}
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 text-warm-white hover:opacity-70 transition-opacity"
                  aria-label="Next project"
                >
                  <span className="text-sm uppercase tracking-wider hidden md:inline">Next</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
