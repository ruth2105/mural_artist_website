import { motion } from 'framer-motion';

const smallProjectRatios = ['4/5', '3/4', '5/4', '4/5', '3/4', '5/4'];

export default function ArtworkCard({ artwork, onClick, index, variant = 'default' }) {
  const aspectRatio = artwork.category === 'big-projects'
    ? '16/10'
    : variant === 'masonry'
      ? smallProjectRatios[index % smallProjectRatios.length]
      : '4/5';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(artwork)}
      aria-label={`View project: ${artwork.title}`}
      className="group relative block w-full overflow-hidden bg-white shadow-lg shadow-primary-blue/10 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue rounded-lg hover:shadow-xl hover:shadow-primary-blue/20 transition-all duration-300"
      style={{ aspectRatio }}
    >
      <img
        src={artwork.thumbnail || artwork.featuredImage || artwork.image}
        alt={artwork.title}
        className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]"
        style={{ objectPosition: artwork.objectPosition || 'center' }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-near-black/90 via-near-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

      {artwork.featured && (
        <span className="absolute left-4 top-4 z-10 text-[10px] uppercase tracking-[0.2em] text-white bg-primary-blue px-3 py-1 rounded-full">
          Featured
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-slate-text/90 via-slate-text/70 to-transparent">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/90 sm:text-xs">
          {artwork.categoryLabel || artwork.category?.replace('-', ' ')}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight text-white sm:text-2xl">
          {artwork.title}
        </h3>
        {artwork.contributionType === 'Collaborative project' && (
          <p className="mt-2 text-xs text-white/80">
            Collaborative project
          </p>
        )}
      </div>
      <span className="sr-only">Open project details</span>
    </motion.button>
  );
}
