import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { format } from 'date-fns';

export default function ArtworksList() {
  const [searchParams] = useSearchParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    fetchArtworks();
  }, [filter]);

  const fetchArtworks = async () => {
    try {
      // DEMO MODE: Use sample data from gallery
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        const sampleData = [
          {
            id: '1',
            title: 'Unity Through Colors',
            slug: 'unity-through-colors',
            main_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            description: 'A vibrant mural celebrating cultural diversity',
            status: 'published',
            is_featured: true,
            created_at: '2024-01-15T00:00:00Z',
            categories: { label: 'Murals', name: 'murals' }
          },
          {
            id: '2',
            title: 'Ethiopian Coffee Brand',
            slug: 'ethiopian-coffee-brand',
            main_image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
            description: 'Complete branding package for local coffee company',
            status: 'published',
            is_featured: false,
            created_at: '2024-02-10T00:00:00Z',
            categories: { label: 'Branding', name: 'branding' }
          },
          {
            id: '3',
            title: 'Future City Concept',
            slug: 'future-city-concept',
            main_image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
            description: 'Conceptual design for sustainable urban development',
            status: 'draft',
            is_featured: false,
            created_at: '2024-03-05T00:00:00Z',
            categories: { label: 'Concept Design', name: 'concept-design' }
          },
        ];

        const filtered = filter === 'all' 
          ? sampleData 
          : sampleData.filter(a => a.status === filter);
        
        setArtworks(filtered);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('artworks')
        .select('*, categories(name, label)')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, imagePath) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      // DEMO MODE: Just remove from local state
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        alert('✅ DEMO MODE: In production, this would delete from database.');
        setArtworks(artworks.filter(a => a.id !== id));
        return;
      }

      // Delete from database
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Note: Image deletion from storage handled separately if needed
      setArtworks(artworks.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Failed to delete artwork');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      // DEMO MODE: Just update local state
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        setArtworks(artworks.map(a => 
          a.id === id ? { ...a, status: newStatus } : a
        ));
        return;
      }

      const { error } = await supabase
        .from('artworks')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setArtworks(artworks.map(a => 
        a.id === id ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-white">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-warm-white font-display text-3xl font-bold mb-2">
              Manage Artworks
            </h1>
            <p className="text-muted-gray">
              {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} total
            </p>
          </div>
          <Link
            to="/admin/artworks/new"
            className="px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105 transition-transform"
          >
            ➕ Add New Artwork
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-warm-white text-near-black'
                  : 'bg-charcoal text-warm-white/70 hover:text-warm-white border border-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Artworks Grid */}
        {artworks.length === 0 ? (
          <div className="text-center py-16 bg-charcoal border border-white/10 rounded-lg">
            <p className="text-muted-gray text-lg mb-4">
              No artworks {filter !== 'all' ? `in ${filter}` : 'yet'}
            </p>
            <Link
              to="/admin/artworks/new"
              className="inline-block px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105 transition-transform"
            >
              Add Your First Artwork
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-charcoal border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-near-black overflow-hidden">
                  {artwork.main_image_url ? (
                    <img
                      src={artwork.main_image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-gray">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-warm-white font-medium line-clamp-1">
                      {artwork.title}
                    </h3>
                    <button
                      onClick={() => toggleStatus(artwork.id, artwork.status)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        artwork.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {artwork.status === 'published' ? '✅' : '📝'}
                    </button>
                  </div>

                  <p className="text-muted-gray text-sm mb-3">
                    {artwork.categories?.label || 'No category'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-gray mb-4">
                    <span>{format(new Date(artwork.created_at), 'MMM d, yyyy')}</span>
                    {artwork.is_featured && <span className="text-warm-white">⭐ Featured</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/artworks/${artwork.id}/edit`}
                      className="flex-1 px-3 py-2 bg-white/5 text-warm-white text-center text-sm rounded hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(artwork.id, artwork.main_image_path)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
