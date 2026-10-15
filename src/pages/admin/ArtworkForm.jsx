import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, uploadImage, deleteImage } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUpload from '../../components/admin/ImageUpload';

export default function ArtworkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: '',
    ownership_type: 'individual',
    collaborators: [],
    project_year: new Date().getFullYear(),
    project_location: '',
    is_featured: false,
    status: 'draft',
    object_position: 'center',
    video_url: '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchArtwork();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      // DEMO MODE: Use sample categories
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        setCategories([
          { id: 'murals', label: 'Murals', display_order: 1 },
          { id: 'branding', label: 'Branding', display_order: 2 },
          { id: 'concept-design', label: 'Concept Design', display_order: 3 },
        ]);
        return;
      }

      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        category_id: data.category_id || '',
        description: data.description || '',
        ownership_type: data.ownership_type || 'individual',
        collaborators: data.collaborators || [],
        project_year: data.project_year || new Date().getFullYear(),
        project_location: data.project_location || '',
        is_featured: data.is_featured || false,
        status: data.status || 'draft',
        object_position: data.object_position || 'center',
        video_url: data.video_url || '',
      });

      setMainImage(data.main_image_url);
    } catch (error) {
      console.error('Error fetching artwork:', error);
      alert('Failed to load artwork');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // DEMO MODE: Just show success message
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        alert('✅ DEMO MODE: In production, this would save to database.\n\nYour artwork would be:\n' +
              `- Title: ${formData.title}\n` +
              `- Category: ${categories.find(c => c.id === formData.category_id)?.label}\n` +
              `- Status: ${formData.status}\n\n` +
              'After Supabase setup, this will work for real!');
        setSaving(false);
        return;
      }

      let imageUrl = mainImage;
      let imagePath = null;

      // Upload new image if selected
      if (mainImageFile) {
        const { url, path } = await uploadImage(mainImageFile, 'artworks');
        imageUrl = url;
        imagePath = path;

        // Delete old image if editing
        if (isEdit && mainImage) {
          // Extract path from URL if needed
          // await deleteImage(oldPath);
        }
      }

      if (!imageUrl) {
        alert('Please upload an image');
        setSaving(false);
        return;
      }

      const slug = generateSlug(formData.title);
      
      const artworkData = {
        ...formData,
        slug,
        main_image_url: imageUrl,
        main_image_path: imagePath,
        project_year: formData.project_year ? parseInt(formData.project_year) : null,
      };

      let result;
      if (isEdit) {
        result = await supabase
          .from('artworks')
          .update(artworkData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('artworks')
          .insert([artworkData]);
      }

      if (result.error) throw result.error;

      alert(`Artwork ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/artworks');
    } catch (error) {
      console.error('Error saving artwork:', error);
      alert('Failed to save artwork: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-warm-white font-display text-3xl font-bold mb-2">
            {isEdit ? 'Edit Artwork' : 'Add New Artwork'}
          </h1>
          <p className="text-muted-gray">
            {isEdit ? 'Update your artwork details' : 'Upload and publish your new artwork'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Image Upload */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6">
            <ImageUpload
              onImageSelect={setMainImageFile}
              currentImage={mainImage}
              label="Main Image *"
            />
          </div>

          {/* Basic Information */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 space-y-6">
            <h2 className="text-warm-white text-xl font-bold">Basic Information</h2>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                placeholder="Artwork title"
              />
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none resize-none"
                placeholder="Describe your artwork..."
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 space-y-6">
            <h2 className="text-warm-white text-xl font-bold">Project Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Ownership Type
                </label>
                <select
                  name="ownership_type"
                  value={formData.ownership_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                >
                  <option value="individual">Individual</option>
                  <option value="collaborative">Collaborative</option>
                </select>
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Project Year
                </label>
                <input
                  type="number"
                  name="project_year"
                  value={formData.project_year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="project_location"
                value={formData.project_location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                placeholder="Addis Ababa, Ethiopia"
              />
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Video URL (optional)
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          {/* Publication Settings */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6 space-y-6">
            <h2 className="text-warm-white text-xl font-bold">Publication Settings</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-warm-white">
                  ⭐ Feature this artwork (display larger in gallery)
                </span>
              </label>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Publication Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                >
                  <option value="draft">📝 Draft (not visible to public)</option>
                  <option value="published">✅ Published (visible to public)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105 transition-transform disabled:opacity-50 disabled:transform-none"
            >
              {saving ? 'Saving...' : (isEdit ? 'Update Artwork' : 'Create Artwork')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/artworks')}
              className="px-6 py-3 border border-white/20 text-warm-white rounded hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
