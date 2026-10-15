import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎨',
    display_order: 1
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        setServices([
          {
            id: '1',
            name: 'Mural Art',
            description: 'Large-scale wall murals for public spaces, businesses, and cultural institutions',
            icon: '🎨',
            display_order: 1,
            is_active: true
          },
          {
            id: '2',
            name: 'Brand Identity',
            description: 'Complete branding packages including logo design, color schemes, and visual guidelines',
            icon: '🏷️',
            display_order: 2,
            is_active: true
          },
          {
            id: '3',
            name: 'Concept Design',
            description: 'Creative concept development for projects, events, and product designs',
            icon: '💡',
            display_order: 3,
            is_active: true
          },
          {
            id: '4',
            name: 'Art Direction',
            description: 'Visual direction and creative consulting for campaigns and projects',
            icon: '🎬',
            display_order: 4,
            is_active: true
          }
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
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
            `Service: ${formData.name}\n` +
            `Description: ${formData.description}\n` +
            `Icon: ${formData.icon}`);
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', isEditing);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{ ...formData, is_active: true }]);
        if (error) throw error;
      }

      setFormData({ name: '', description: '', icon: '🎨', display_order: 1 });
      setIsEditing(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
    
    if (isDemo) {
      alert('✅ DEMO MODE: In production, this would delete from database.');
      setServices(services.filter(s => s.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
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
            Manage Services
          </h1>
          <p className="text-muted-gray">
            Showcase the services you offer to clients
          </p>
        </div>

        {/* Services List */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">Current Services</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-start gap-4 p-4 bg-near-black rounded">
                <span className="text-3xl">{service.icon}</span>
                <div className="flex-1">
                  <h3 className="text-warm-white font-medium mb-1">{service.name}</h3>
                  <p className="text-muted-gray text-sm">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(service.id);
                      setFormData({
                        name: service.name,
                        description: service.description,
                        icon: service.icon,
                        display_order: service.display_order
                      });
                    }}
                    className="px-3 py-1 text-sm bg-warm-white text-near-black rounded hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mural Art"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🎨"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded resize-none"
                placeholder="Describe what this service includes..."
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
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105"
              >
                {isEditing ? 'Update' : 'Add'} Service
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ name: '', description: '', icon: '🎨', display_order: 1 });
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
