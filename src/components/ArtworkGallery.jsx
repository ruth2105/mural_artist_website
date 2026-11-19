import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { artworks, categories } from '../data/artworks';
import ArtworkCard from './ArtworkCard';
import SectionHeading from './SectionHeading';

const gallerySections = [
  {
    id: 'big-projects',
    className: 'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8',
  },
  {
    id: 'collaborations',
    className: 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7 lg:grid-cols-3',
  },
  {
    id: 'small-projects',
    className: 'grid grid-cols-2 items-start gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4',
  },
  {
    id: 'advertising-printing',
    className: 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7 lg:grid-cols-3',
  },
];

export default function ArtworkGallery({ onProjectClick }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const visibleSections = gallerySections.filter((section) => (
    activeCategory === 'all' || section.id === activeCategory
  ));

  return (
    <section id="work" ref={ref} className="relative bg-gradient-to-br from-white via-light-blue/20 to-white py-20 md:py-28">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8 md:px-12">
        <SectionHeading
          title="SELECTED WORK"
          subtitle="Artwork and projects, organized by collection."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-14 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:gap-3 sm:overflow-visible md:mb-20"
          aria-label="Filter projects by category"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className={`shrink-0 border px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] transition-all sm:px-5 sm:text-xs rounded-lg ${
                activeCategory === category.id
                  ? 'border-primary-blue bg-primary-blue text-white shadow-lg shadow-primary-blue/30'
                  : 'border-primary-blue/30 text-slate-text bg-white hover:border-primary-blue hover:bg-light-blue/30'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-16 md:space-y-24"
          >
            {visibleSections.map((section, sectionIndex) => {
              const sectionCategory = categories.find(({ id }) => id === section.id);
              const sectionArtworks = artworks.filter(({ category }) => category === section.id);

              return (
                <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                  <div className="mb-6 flex items-end justify-between border-b border-primary-blue/20 pb-4 md:mb-8">
                    <h3
                      id={`${section.id}-heading`}
                      className="font-display text-xl font-semibold tracking-tight text-primary-blue sm:text-2xl md:text-3xl"
                    >
                      {sectionCategory.label}
                    </h3>
                    <span className="pb-1 text-[10px] uppercase tracking-[0.16em] text-slate-light sm:text-xs">
                      {String(sectionArtworks.length).padStart(2, '0')} projects
                    </span>
                  </div>

                  {sectionArtworks.length ? (
                    <div className={section.className}>
                      {sectionArtworks.map((artwork, index) => (
                        <ArtworkCard
                          key={artwork.id}
                          artwork={artwork}
                          onClick={onProjectClick}
                          index={index + sectionIndex}
                          variant={section.id === 'small-projects' ? 'masonry' : 'editorial'}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="border border-primary-blue/20 bg-light-blue/30 px-5 py-8 text-center text-slate-light rounded-lg">
                      No artwork has been added to this category yet.
                    </p>
                  )}
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
