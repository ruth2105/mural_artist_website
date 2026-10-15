import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (error) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-near-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-warm-white font-display text-4xl font-bold mb-2">
            MR. JON
          </h1>
          <p className="text-muted-gray text-sm uppercase tracking-wider">
            Admin Dashboard
          </p>
        </div>

        <div className="bg-charcoal border border-white/10 rounded-lg p-8">
          <h2 className="text-warm-white text-2xl font-bold mb-6">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-warm-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-warm-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-muted-gray text-xs text-center">
              Authorized access only. Contact administrator if you need access.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-warm-white/70 hover:text-warm-white text-sm transition-colors"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
