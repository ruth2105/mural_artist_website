import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * UnifiedSmallGallery - Displays all images from small-projects category
 * as a unified masonry grid (not individual project cards)
 */
export default function UnifiedSmallGallery({ onImageClick, artworks = [] }) {
  const [imageErrors, setImageErrors] = useState({});

  // Extract ALL images from all small-projects into a flat array
  const smallProjectImages = artworks
    .filter(artwork => artwork.category === 'small-projects')
    .flatMap(project => 
      (project.images || []).map((img, index) => ({
        id: `${project.id}-img-${index}`,
        src: img.src,
        thumbnail: img.thumbnail,
        alt: img.alt || `${project.title} - Image ${index + 1}`,
        projectTitle: project.title,
        projectId: project.id,
      }))
    );

  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageClick = (image, imageIndex) => {
    if (onImageClick) {
      // Create a virtual project object for the lightbox
      onImageClick({
        ...image,
        title: 'Small Mural Art Gallery',
        category: 'small-projects',
        images: smallProjectImages,
        currentIndex: imageIndex,
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
      {smallProjectImages.map((image, index) => {
        const hasError = imageErrors[image.id];
        
        return (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.4 }}
            className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl hover:shadow-primary-blue/20"
          >
            <button
              type="button"
              onClick={() => handleImageClick(image, index)}
              className="block w-full"
              aria-label={`View ${image.alt}`}
            >
              {!hasError ? (
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt}
                  onError={() => handleImageError(image.id)}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-light-blue/30">
                  <svg
                    className="h-12 w-12 text-slate-light"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-primary-blue/0 transition-colors duration-300 group-hover:bg-primary-blue/20">
                <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <svg
                    className="h-8 w-8 text-white drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </button>
            
            {/* Optional: Show source project title on hover */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-slate-text/90 to-transparent p-2 transition-transform duration-300 group-hover:translate-y-0">
              <p className="text-[10px] text-white/90 line-clamp-1">
                {image.projectTitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
