import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    publishedArtworks: 0,
    draftArtworks: 0,
    totalInquiries: 0,
    newInquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentArtworks, setRecentArtworks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // DEMO MODE: Use sample stats
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        setStats({
          totalArtworks: 12,
          publishedArtworks: 10,
          draftArtworks: 2,
          totalInquiries: 5,
          newInquiries: 2,
        });
        
        setRecentArtworks([
          {
            id: '1',
            title: 'Unity Through Colors',
            status: 'published',
            main_image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            created_at: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            title: 'Ethiopian Coffee Brand',
            status: 'published',
            main_image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
            created_at: '2024-02-10T00:00:00Z'
          },
          {
            id: '3',
            title: 'Future City Concept',
            status: 'draft',
            main_image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
            created_at: '2024-03-05T00:00:00Z'
          },
        ]);
        
        setLoading(false);
        return;
      }

      // Fetch artwork stats
      const { data: artworks } = await supabase
        .from('artworks')
        .select('id, status');

      const { data: inquiries } = await supabase
        .from('commission_inquiries')
        .select('id, status');

      const { data: recent } = await supabase
        .from('artworks')
        .select('id, title, status, main_image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalArtworks: artworks?.length || 0,
        publishedArtworks: artworks?.filter(a => a.status === 'published').length || 0,
        draftArtworks: artworks?.filter(a => a.status === 'draft').length || 0,
        totalInquiries: inquiries?.length || 0,
        newInquiries: inquiries?.filter(i => i.status === 'new').length || 0,
      });

      setRecentArtworks(recent || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Artworks',
      value: stats.totalArtworks,
      icon: '🎨',
      link: '/admin/artworks',
    },
    {
      label: 'Published',
      value: stats.publishedArtworks,
      icon: '✅',
      link: '/admin/artworks?status=published',
    },
    {
      label: 'Drafts',
      value: stats.draftArtworks,
      icon: '📝',
      link: '/admin/artworks?status=draft',
    },
    {
      label: 'New Inquiries',
      value: stats.newInquiries,
      icon: '📧',
      link: '/admin/inquiries',
      highlight: stats.newInquiries > 0,
    },
  ];

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
        <div className="mb-8">
          <h1 className="text-warm-white font-display text-3xl font-bold mb-2">
            Dashboard
          </h1>
          <p className="text-muted-gray">
            Welcome back! Here's an overview of your portfolio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className={`p-6 rounded-lg border transition-all hover:scale-105 ${
                stat.highlight
                  ? 'bg-warm-white border-warm-white'
                  : 'bg-charcoal border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`text-3xl font-bold ${
                  stat.highlight ? 'text-near-black' : 'text-warm-white'
                }`}>
                  {stat.value}
                </span>
              </div>
              <p className={`text-sm font-medium ${
                stat.highlight ? 'text-near-black' : 'text-muted-gray'
              }`}>
                {stat.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-charcoal border border-white/10 rounded-lg p-6">
            <h2 className="text-warm-white text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/artworks/new"
                className="flex items-center gap-3 px-4 py-3 bg-warm-white text-near-black rounded hover:scale-105 transition-transform"
              >
                <span className="text-xl">➕</span>
                <span className="font-medium">Add New Artwork</span>
              </Link>
              <Link
                to="/admin/artworks"
                className="flex items-center gap-3 px-4 py-3 border border-white/20 text-warm-white rounded hover:bg-white/5 transition-colors"
              >
                <span className="text-xl">🎨</span>
                <span className="font-medium">Manage Artworks</span>
              </Link>
              <Link
                to="/admin/profile"
                className="flex items-center gap-3 px-4 py-3 border border-white/20 text-warm-white rounded hover:bg-white/5 transition-colors"
              >
                <span className="text-xl">👤</span>
                <span className="font-medium">Edit Profile</span>
              </Link>
            </div>
          </div>

          {/* Recent Artworks */}
          <div className="bg-charcoal border border-white/10 rounded-lg p-6">
            <h2 className="text-warm-white text-xl font-bold mb-4">Recent Artworks</h2>
            {recentArtworks.length === 0 ? (
              <p className="text-muted-gray text-sm">No artworks yet. Add your first project!</p>
            ) : (
              <div className="space-y-3">
                {recentArtworks.map((artwork) => (
                  <Link
                    key={artwork.id}
                    to={`/admin/artworks/${artwork.id}/edit`}
                    className="flex items-center gap-3 p-3 border border-white/10 rounded hover:bg-white/5 transition-colors"
                  >
                    {artwork.main_image_url && (
                      <img
                        src={artwork.main_image_url}
                        alt={artwork.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-warm-white text-sm font-medium truncate">
                        {artwork.title}
                      </p>
                      <p className="text-muted-gray text-xs">
                        {artwork.status === 'published' ? '✅ Published' : '📝 Draft'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-warm-white font-medium mb-2">1. Add Artwork</h3>
              <p className="text-muted-gray text-sm">
                Upload your murals, designs, and projects with descriptions.
              </p>
            </div>
            <div>
              <h3 className="text-warm-white font-medium mb-2">2. Publish Projects</h3>
              <p className="text-muted-gray text-sm">
                Set projects to "Published" to make them visible on your portfolio.
              </p>
            </div>
            <div>
              <h3 className="text-warm-white font-medium mb-2">3. Manage Inquiries</h3>
              <p className="text-muted-gray text-sm">
                Review and respond to commission requests from potential clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
