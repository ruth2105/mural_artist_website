import { createClient } from '@supabase/supabase-js';

const PLACEHOLDER_PATTERNS = [
  'your_project',
  'your-project',
  'your_supabase',
  'your-supabase',
  'replace-me',
  'example',
  'placeholder'
];

export function getSupabaseConfig() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  const missing = [];

  if (!supabaseUrl || supabaseUrl.length === 0) missing.push('VITE_SUPABASE_URL');
  else if (PLACEHOLDER_PATTERNS.some(pattern => supabaseUrl.toLowerCase().includes(pattern))) {
    missing.push('VITE_SUPABASE_URL');
  }

  if (!supabaseAnonKey || supabaseAnonKey.length === 0) missing.push('VITE_SUPABASE_ANON_KEY');
  else if (PLACEHOLDER_PATTERNS.some(pattern => supabaseAnonKey.toLowerCase().includes(pattern))) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  return {
    url: supabaseUrl || '',
    anonKey: supabaseAnonKey || '',
    configured: missing.length === 0,
    missing
  };
}

export function getSupabaseConfigError() {
  const { missing } = getSupabaseConfig();

  if (missing.length === 0) {
    return null;
  }

  return `Supabase is not configured. Set ${missing.join(' and ')} in your environment before using the admin dashboard or upload features.`;
}

export const isSupabaseConfigured = () => getSupabaseConfig().configured;

export const supabase = isSupabaseConfigured()
  ? createClient(getSupabaseConfig().url, getSupabaseConfig().anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

export const ARTWORK_BUCKET = 'artwork';

export async function uploadImage(file, folder = 'projects') {
  if (!supabase) {
    throw new Error(getSupabaseConfigError() || 'Supabase is not configured.');
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(ARTWORK_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(ARTWORK_BUCKET)
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteImage(filePath) {
  if (!supabase) {
    throw new Error(getSupabaseConfigError() || 'Supabase is not configured.');
  }

  try {
    const { error } = await supabase.storage
      .from(ARTWORK_BUCKET)
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function uploadMultipleImages(files, folder = 'projects') {
  if (!supabase) {
    throw new Error(getSupabaseConfigError() || 'Supabase is not configured.');
  }

  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}
