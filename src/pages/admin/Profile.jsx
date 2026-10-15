import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: 'Mr. Jon',
    bio: '',
    tagline: 'Visual Artist & Creative Director',
    years_experience: 10,
    specialties: ['Murals', 'Branding', 'Concept Design'],
    phone: '+251 98 999 0996',
    email: 'mrjon@example.com',
    social_media: {
      instagram: 'mrjon_artist',
      facebook: 'mrjonart',
      tiktok: '@masterstvo24',
      linkedin: 'mrjon'
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        // Demo data already in formData
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('artist_profile')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setFormData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
    
    if (isDemo) {
      alert('✅ DEMO MODE: In production, this would save to database.\n\n' +
            `Name: ${formData.full_name}\n` +
            `Tagline: ${formData.tagline}\n` +
            `Phone: ${formData.phone}\n` +
            `Email: ${formData.email}`);
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('artist_profile')
        .upsert([formData]);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
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
            Artist Profile
          </h1>
          <p className="text-muted-gray">
            Manage your personal information and bio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6">
            <h2 className="text-warm-white text-xl font-bold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Visual Artist & Creative Director"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded resize-none"
                  placeholder="Tell your story..."
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6">
            <h2 className="text-warm-white text-xl font-bold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251 98 999 0996"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6">
            <h2 className="text-warm-white text-xl font-bold mb-4">Social Media</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.social_media?.instagram || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, instagram: e.target.value }
                  })}
                  placeholder="username"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  TikTok
                </label>
                <input
                  type="text"
                  value={formData.social_media?.tiktok || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, tiktok: e.target.value }
                  })}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.social_media?.facebook || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, facebook: e.target.value }
                  })}
                  placeholder="username"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>

              <div>
                <label className="block text-warm-white text-sm font-medium mb-2">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={formData.social_media?.linkedin || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, linkedin: e.target.value }
                  })}
                  placeholder="username"
                  className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105 transition-transform disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
