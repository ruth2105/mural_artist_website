import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ArtworkCard from './ArtworkCard';
import SectionHeading from './SectionHeading';

export default function ArtworkGallery({ onProjectClick }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'ALL' }]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch published artworks
      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('*, categories(name, slug, label)')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      // Fetch active categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      // If Supabase is not configured, load sample data
      if (artworksError || categoriesError) {
        console.info('Supabase not configured yet. Showing sample projects. Follow CMS_SETUP_GUIDE.md to enable the CMS.');
        loadSampleData();
        setLoading(false);
        return;
      }

      // Transform artworks to match component structure
      const transformedArtworks = (artworksData || []).map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        category: artwork.categories?.slug || '',
        ownership: artwork.ownership_type,
        image: artwork.main_image_url,
        images: artwork.gallery_images || [],
        video: artwork.video_url,
        description: artwork.description,
        year: artwork.project_year,
        location: artwork.project_location,
        collaborators: artwork.collaborators || [],
        featured: artwork.is_featured,
        objectPosition: artwork.object_position || 'center'
      }));

      // If database is empty, show sample data
      if (transformedArtworks.length === 0) {
        console.info('No artworks in database yet. Showing sample projects.');
        loadSampleData();
      } else {
        setArtworks(transformedArtworks);
        setCategories([
          { id: 'all', label: 'ALL' },
          ...(categoriesData || []).map(cat => ({ id: cat.slug, label: cat.label }))
        ]);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
      console.info('To enable the CMS, follow CMS_SETUP_GUIDE.md. Showing sample data.');
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    // Sample artworks for demonstration (replace with real artwork through admin dashboard)
    const sampleArtworks = [
      {
        id: 'sample-1',
        title: 'Urban Expression Mural',
        category: 'murals',
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80',
        description: 'Large-scale street art installation celebrating community and culture.',
        featured: true,
        objectPosition: 'center'
      },
      {
        id: 'sample-2',
        title: 'Coffee Shop Interior Mural',
        category: 'murals',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80',
        description: 'Vibrant wall art for local café space.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-3',
        title: 'Brand Identity Suite',
        category: 'branding',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
        description: 'Complete visual identity system for startup company.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-4',
        title: 'Community Center Project',
        category: 'collaborations',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80',
        description: 'Collaborative mural project with local artists.',
        featured: true,
        objectPosition: 'center'
      },
      {
        id: 'sample-5',
        title: 'Restaurant Branding Package',
        category: 'small-projects',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
        description: 'Logo and menu design for Ethiopian restaurant.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-6',
        title: 'Specialty Coffee Identity',
        category: 'major-projects',
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80',
        description: 'Complete brand identity for coffee roastery.',
        featured: true,
        objectPosition: 'center'
      },
      {
        id: 'sample-7',
        title: 'Abstract Wall Design',
        category: 'murals',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
        description: 'Geometric patterns and bold colors for modern space.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-8',
        title: 'Product Packaging Design',
        category: 'branding',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        description: 'Custom packaging and label design.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-9',
        title: 'Public Space Mural',
        category: 'collaborations',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
        description: 'Large-scale public art installation.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-10',
        title: 'Fitness Brand Logo',
        category: 'small-projects',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        description: 'Modern logo design for gym and fitness center.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-11',
        title: 'Real Estate Branding',
        category: 'major-projects',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        description: 'Professional identity for real estate company.',
        featured: false,
        objectPosition: 'center'
      },
      {
        id: 'sample-12',
        title: 'Cultural Heritage Mural',
        category: 'murals',
        image: 'https://images.unsplash.com/photo-1551893478-d726eef9ad5e?w=1200&q=80',
        description: 'Celebrating Ethiopian heritage through art.',
        featured: false,
        objectPosition: 'center'
      }
    ];

    setArtworks(sampleArtworks);
    setCategories([
      { id: 'all', label: 'ALL' },
      { id: 'murals', label: 'MURALS' },
      { id: 'small-projects', label: 'SMALL PROJECTS' },
      { id: 'major-projects', label: 'MAJOR PROJECTS' },
      { id: 'collaborations', label: 'COLLABORATIONS' },
      { id: 'branding', label: 'LOGO & BRANDING' }
    ]);
  };

  const filteredArtworks = activeCategory === 'all'
    ? artworks
    : artworks.filter(artwork => artwork.category === activeCategory);

  return (
    <section id="work" ref={ref} className="relative py-24 md:py-32 bg-near-black">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <SectionHeading
          title="SELECTED WORK"
          subtitle="A collection of murals, visual identities, and creative collaborations."
        />

        {loading ? (
          <div className="text-center py-16">
            <div className="text-warm-white">Loading artworks...</div>
          </div>
        ) : (
          <>
            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-3 md:gap-4 mb-12 md:mb-16"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'text-near-black bg-warm-white'
                      : 'text-warm-white border border-white/20 hover:border-white/40'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>

            {/* Gallery Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {filteredArtworks.map((artwork, index) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={onProjectClick}
                    index={index}
                    variant="masonry"
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredArtworks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <p className="text-muted-gray text-lg">No projects in this category yet.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
