import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DEMO MODE: Bypass auth when Supabase is not configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
    
    if (isDemo) {
      // Auto-login as demo user
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@mrjon.com',
        user_metadata: { full_name: 'Demo User' }
      };
      setUser(demoUser);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    // DEMO MODE: Accept any credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
    
    if (isDemo) {
      const demoUser = {
        id: 'demo-user-123',
        email: email || 'demo@mrjon.com',
        user_metadata: { full_name: 'Demo User' }
      };
      setUser(demoUser);
      return { user: demoUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    // DEMO MODE: Just clear user
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
    
    if (isDemo) {
      setUser(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    signIn,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
