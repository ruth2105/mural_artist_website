import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/artworks', label: 'Manage Artworks', icon: '🎨' },
    { path: '/admin/artworks/new', label: 'Add Artwork', icon: '➕' },
    { path: '/admin/categories', label: 'Categories', icon: '📁' },
    { path: '/admin/profile', label: 'Artist Profile', icon: '👤' },
    { path: '/admin/services', label: 'Services', icon: '💼' },
    { path: '/admin/inquiries', label: 'Inquiries', icon: '📧' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-near-black">
      {/* Top Navigation */}
      <nav className="bg-charcoal border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-warm-white p-2"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <Link to="/admin" className="text-warm-white font-display text-xl font-bold">
                MR. JON Admin
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-2 text-warm-white/70 hover:text-warm-white text-sm"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>
              <div className="text-warm-white/70 text-sm hidden sm:block">
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-charcoal border-r border-white/10 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  isActive(item.path)
                    ? 'bg-warm-white text-near-black'
                    : 'text-warm-white/70 hover:bg-white/5 hover:text-warm-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-near-black/95 backdrop-blur-sm">
            <div className="bg-charcoal h-full w-64 p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-warm-white font-display text-lg font-bold">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-warm-white p-2"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                      isActive(item.path)
                        ? 'bg-warm-white text-near-black'
                        : 'text-warm-white/70 hover:bg-white/5 hover:text-warm-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
