import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', label: '', display_order: 1 });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // DEMO MODE: Use sample data
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        setCategories([
          { id: 'murals', name: 'murals', label: 'Murals', display_order: 1, is_active: true },
          { id: 'branding', name: 'branding', label: 'Branding', display_order: 2, is_active: true },
          { id: 'concept-design', name: 'concept-design', label: 'Concept Design', display_order: 3, is_active: true },
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
    
    if (isDemo) {
      alert('✅ DEMO MODE: In production, this would save to database.\n\n' +
            `Category: ${formData.label}\n` +
            `Name: ${formData.name}\n` +
            `Order: ${formData.display_order}`);
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', isEditing);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ ...formData, is_active: true }]);
        if (error) throw error;
      }

      setFormData({ name: '', label: '', display_order: 1 });
      setIsEditing(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
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
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-warm-white font-display text-3xl font-bold mb-2">
            Manage Categories
          </h1>
          <p className="text-muted-gray">
            Organize your artwork into categories
          </p>
        </div>

        {/* Category List */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">Current Categories</h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-near-black rounded">
                <div>
                  <p className="text-warm-white font-medium">{cat.label}</p>
                  <p className="text-muted-gray text-sm">Slug: {cat.name} • Order: {cat.display_order}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(cat.id);
                      setFormData({ name: cat.name, label: cat.label, display_order: cat.display_order });
                    }}
                    className="px-3 py-1 text-sm bg-warm-white text-near-black rounded hover:scale-105"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Category Label *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Street Art"
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                required
              />
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Slug (URL-friendly name) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., street-art"
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                required
              />
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105"
              >
                {isEditing ? 'Update' : 'Add'} Category
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ name: '', label: '', display_order: 1 });
                  }}
                  className="px-6 py-3 border border-white/20 text-warm-white rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
