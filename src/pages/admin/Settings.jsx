import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/admin/settings`
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Check your inbox.' 
      });
    } catch (error) {
      console.error('Error sending reset email:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to send reset email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-warm-white font-display text-3xl font-bold mb-2">
            Account Settings
          </h1>
          <p className="text-muted-gray">
            Manage your account security and preferences
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-muted-gray text-sm mb-1">Email Address</label>
              <p className="text-warm-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-muted-gray text-sm mb-1">User ID</label>
              <p className="text-warm-white/60 text-sm font-mono">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                New Password *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-warm-white text-sm font-medium mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-near-black border border-white/20 text-warm-white rounded focus:border-warm-white focus:outline-none"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-warm-white text-near-black font-medium rounded hover:scale-105 transition-transform disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Password Reset via Email */}
        <div className="bg-charcoal border border-white/10 rounded-lg p-6">
          <h2 className="text-warm-white text-xl font-bold mb-4">Reset via Email</h2>
          <p className="text-muted-gray text-sm mb-4">
            Prefer to reset your password via email? We'll send you a secure link to {user?.email}
          </p>
          
          <button
            onClick={handleSendResetEmail}
            disabled={loading}
            className="px-6 py-3 border border-white/20 text-warm-white rounded hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </div>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-near-black border border-white/10 rounded-lg">
          <h3 className="text-warm-white font-medium mb-2">💡 Password Security Tips</h3>
          <ul className="text-muted-gray text-sm space-y-1">
            <li>• Use at least 8 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Don't reuse passwords from other sites</li>
            <li>• Change your password regularly</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
