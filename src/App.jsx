import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Public pages
import PublicSite from './pages/PublicSite';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ArtworksList from './pages/admin/ArtworksList';
import ArtworkForm from './pages/admin/ArtworkForm';
import Inquiries from './pages/admin/Inquiries';
import Categories from './pages/admin/Categories';
import Profile from './pages/admin/Profile';
import Services from './pages/admin/Services';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicSite />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/artworks"
            element={
              <ProtectedRoute>
                <ArtworksList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/artworks/new"
            element={
              <ProtectedRoute>
                <ArtworkForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/artworks/:id/edit"
            element={
              <ProtectedRoute>
                <ArtworkForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute>
                <Inquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
