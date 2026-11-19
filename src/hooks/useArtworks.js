import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { artworks as staticArtworks } from '../data/artworks';

export function useArtworks(category = 'all') {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, [category]);

  async function fetchArtworks() {
    try {
      // Try to fetch from Supabase first
      if (!supabase) {
        // Fallback to static data
        console.log('Using static artwork data (Supabase not configured)');
        const filtered = category === 'all' 
          ? staticArtworks 
          : staticArtworks.filter(a => a.category === category);
        setArtworks(filtered);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('artworks')
        .select(`
          *,
          categories (
            name,
            slug,
            label
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (category !== 'all') {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();

        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching artworks from DB, using static data:', fetchError);
        // Fallback to static data
        const filtered = category === 'all' 
          ? staticArtworks 
          : staticArtworks.filter(a => a.category === category);
        setArtworks(filtered);
        setLoading(false);
        return;
      }

      // Transform database format to match static format
      const transformed = data.map(artwork => ({
        id: artwork.slug,
        title: artwork.title,
        category: artwork.categories?.slug || category,
        categoryLabel: artwork.categories?.label || '',
        ownership: artwork.ownership_type,
        image: artwork.main_image_url,
        thumbnail: artwork.main_image_url,
        images: artwork.gallery_images?.images || [],
        videos: artwork.gallery_images?.videos || [],
        description: artwork.description,
        featured: artwork.is_featured,
        objectPosition: artwork.object_position || 'center',
        sourceFolder: artwork.main_image_path
      }));

      setArtworks(transformed);
      setLoading(false);

    } catch (err) {
      console.error('Exception fetching artworks:', err);
      setError(err.message);
      // Fallback to static data
      const filtered = category === 'all' 
        ? staticArtworks 
        : staticArtworks.filter(a => a.category === category);
      setArtworks(filtered);
      setLoading(false);
    }
  }

  return { artworks, loading, error };
}
