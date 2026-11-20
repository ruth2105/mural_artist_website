import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { artworks, projectFilms } from '../data/artworks';
import SectionHeading from './SectionHeading';

function FilmViewer({ film, project, onClose, onProjectClick }) {
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], video[controls]'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    setHasPlaybackError(false);
  }, [film.src]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-viewer-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] flex items-center justify-center overflow-y-auto bg-near-black/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close project film"
          className="absolute -top-12 right-0 p-2 text-warm-white hover:text-primary-blue transition-colors"
        >
          <span aria-hidden="true" className="text-3xl leading-none">×</span>
        </button>

        <video
          key={film.src}
          controls
          playsInline
          preload="metadata"
          poster={film.poster}
          onError={() => setHasPlaybackError(true)}
          className="max-h-[72vh] w-full bg-charcoal object-contain"
        >
          <source src={film.src} type="video/mp4" />
          Your browser does not support MP4 video playback.
        </video>

        {hasPlaybackError && (
          <p role="status" className="mt-4 text-sm text-red-300">
            This project film could not be loaded. Please try again later.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-warm-white/60">
              {film.categoryLabel}
            </p>
            <h3 id="film-viewer-title" className="font-display text-2xl font-semibold text-warm-white sm:text-3xl">
              {film.title}
            </h3>
          </div>
          {project && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onProjectClick(project);
              }}
                className="self-start border-b border-primary-blue pb-1 text-xs uppercase tracking-[0.14em] text-primary-blue hover:border-[#0F55D9] hover:text-[#0F55D9] sm:self-auto"
            >
              View project
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoGallery({ onProjectClick }) {
  const [activeFilm, setActiveFilm] = useState(null);
  const activeProject = activeFilm
    ? artworks.find(({ id }) => id === activeFilm.projectId)
    : null;

  return (
    <section id="behind-the-art" className="bg-charcoal py-20 md:py-28">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8 md:px-12">
        <SectionHeading
          title="BEHIND THE ART — PROJECT FILMS"
          subtitle="Project footage grouped with the artwork folders it came from."
        />

        {projectFilms.length ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3">
            {projectFilms.map((film, index) => (
              <article key={film.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveFilm(film)}
                  aria-label={`Open project film: ${film.title}`}
                  className="group relative block w-full overflow-hidden bg-near-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-white"
                >
                  <img
                    src={film.poster}
                    alt={`${film.title} project film poster`}
                    className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-near-black/10 transition-colors group-hover:bg-near-black/30">
                    <span className="flex h-14 w-14 items-center justify-center border border-warm-white/80 bg-near-black/35 text-warm-white transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </button>
                <p className="mb-2 mt-4 text-[10px] uppercase tracking-[0.18em] text-warm-white/60">
                  {film.categoryLabel}
                </p>
                <h3 className="font-display text-lg font-medium leading-snug text-warm-white sm:text-xl">
                  {film.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveFilm(film)}
                  className="mt-3 text-xs uppercase tracking-[0.14em] text-warm-white/70 hover:text-warm-white"
                >
                  Watch film
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-white/10 px-5 py-8 text-center text-muted-gray">
            No project films are available yet.
          </p>
        )}
      </div>

      <AnimatePresence>
        {activeFilm && (
          <FilmViewer
            key={activeFilm.id}
            film={activeFilm}
            project={activeProject}
            onClose={() => setActiveFilm(null)}
            onProjectClick={onProjectClick}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
