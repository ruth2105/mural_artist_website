import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { artworks } from '../data/artworks';

export default function ProjectViewer({ project, onClose, onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoErrors, setVideoErrors] = useState({});
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (project) {
      const index = artworks.findIndex(a => a.id === project.id);
      setCurrentIndex(index);
      setCurrentImageIndex(Math.max(
        0,
        project.images?.findIndex(image => image.src === project.featuredImage) ?? 0
      ));
      setVideoErrors({});
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus?.();
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
      } else if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], video[controls]'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
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
  const images = project.images?.length
    ? project.images
    : project.image
      ? [{ src: project.image, alt: project.title }]
      : [];
  const currentImage = images[currentImageIndex];
  const relatedProjects = artworks
    .filter(artwork => artwork.category === project.category && artwork.id !== project.id)
    .slice(0, 3);
  const contributionType = project.contributionType
    || (project.ownership === 'individual' ? 'Individual project' : null);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-viewer-title"
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
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute -top-12 right-0 text-warm-white p-2 hover:text-primary-blue transition-colors z-10"
                aria-label="Close viewer"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="24" y1="8" x2="8" y2="24" />
                  <line x1="8" y1="8" x2="24" y2="24" />
                </svg>
              </button>

              {currentImage && (
                <div className="relative bg-charcoal mb-8 overflow-hidden">
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt || project.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    style={{ objectPosition: project.objectPosition || 'center' }}
                  />
                </div>
              )}

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 mb-8" aria-label="Project images">
                  {images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1} of ${images.length}`}
                      aria-pressed={currentImageIndex === index}
                      className={`shrink-0 w-20 h-20 overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-warm-white' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.thumbnail || image.src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {project.videos?.length > 0 && (
                <div className="grid gap-4 mb-8">
                  {project.videos.map((video) => (
                    <div key={video.src}>
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster={video.poster}
                        onError={() => setVideoErrors(errors => ({ ...errors, [video.src]: true }))}
                        className="w-full max-h-[70vh] bg-charcoal"
                      >
                        <source src={video.src} type="video/mp4" />
                        Your browser does not support this video format.
                      </video>
                      {videoErrors[video.src] && (
                        <p role="status" className="mt-2 text-sm text-red-300">
                          This project video could not be loaded.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Project Info */}
              <div className="text-center md:text-left">
                <p className="text-muted-gray text-xs uppercase tracking-wider mb-3">
                  {project.categoryLabel || project.category?.replace('-', ' ')}
                </p>
                <h2 id="project-viewer-title" className="text-warm-white font-display font-bold text-3xl md:text-5xl mb-4">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="text-warm-white/70 text-lg leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                )}
                {(contributionType || project.dimensions || project.materials) && (
                  <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-left sm:grid-cols-2">
                    {contributionType && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-gray">Contribution</dt>
                        <dd className="mt-1 text-sm text-warm-white/80">
                          {contributionType === 'Collaborative project'
                            ? 'Collaborative project; individual contributions are not specified.'
                            : contributionType}
                        </dd>
                      </div>
                    )}
                    {project.dimensions && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-gray">Dimensions</dt>
                        <dd className="mt-1 text-sm text-warm-white/80">{project.dimensions}</dd>
                      </div>
                    )}
                    {project.materials && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-gray">Materials</dt>
                        <dd className="mt-1 text-sm text-warm-white/80">{project.materials}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>

              {relatedProjects.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-muted-gray">Related projects</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {relatedProjects.map(relatedProject => (
                      <button
                        key={relatedProject.id}
                        type="button"
                        onClick={() => onNavigate(relatedProject)}
                        className="border-b border-white/20 pb-1 text-sm text-warm-white/80 hover:border-warm-white hover:text-warm-white"
                      >
                        {relatedProject.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
