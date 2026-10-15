-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR MR. JON PORTFOLIO
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- This will create all necessary tables, policies, and storage

-- =====================================================
-- 1. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, label, display_order, is_active) VALUES
  ('murals', 'murals', 'MURALS', 1, true),
  ('small-projects', 'small-projects', 'SMALL PROJECTS', 2, true),
  ('major-projects', 'major-projects', 'MAJOR PROJECTS', 3, true),
  ('collaborations', 'collaborations', 'COLLABORATIONS', 4, true),
  ('branding', 'branding', 'LOGO & BRANDING', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. ARTWORKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  main_image_url TEXT NOT NULL,
  main_image_path TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  ownership_type TEXT DEFAULT 'individual' CHECK (ownership_type IN ('individual', 'collaborative')),
  collaborators TEXT[],
  project_year INTEGER,
  project_location TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  object_position TEXT DEFAULT 'center',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category_id);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(is_featured);

-- =====================================================
-- 3. ARTIST PROFILE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS artist_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  biography TEXT,
  portrait_url TEXT,
  portrait_path TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default profile
INSERT INTO artist_profile (name, tagline, biography, skills) VALUES (
  'MR. JON',
  'Art without Boundaries.',
  'For the past five years, my focus has been crafting striking graphic designs and large-scale murals that capture attention. But my passion lies in pushing creative boundaries: I am honored to be the first artist in Ethiopia to leverage Meta Quest VR to design and execute large-scale mural projects.

Art is best shared—I frequently collaborate with creators across industries to fuse traditional artistry with modern digital techniques, crafting visual narratives that resonate deeply and stand out.',
  ARRAY['Large-scale Murals', 'Graffiti Art', 'Brand Identity Design', 'Graphic Design', 'Digital Illustration', 'Vector Art', 'VR Art Creation']
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. CONTACT INFORMATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT,
  email TEXT,
  tiktok_url TEXT,
  tiktok_handle TEXT,
  instagram_url TEXT,
  instagram_handle TEXT,
  telegram_url TEXT,
  telegram_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact info
INSERT INTO contact_info (phone, tiktok_url, tiktok_handle, instagram_url, instagram_handle, telegram_url, telegram_handle) VALUES (
  '+251 98 999 0996',
  'https://www.tiktok.com/@masterstvo24',
  '@masterstvo24',
  'https://www.instagram.com/mr_jon24/',
  '@mr_jon24',
  'https://t.me/MrJo240',
  '@MrJo240'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (service_number, title, description, features, display_order) VALUES
  ('01', 'Commercial Murals & Spatial Art', 'Large-scale murals and visual artwork for physical spaces, including local cafés, offices, and public or community spaces.', 
   ARRAY['Interior & exterior murals', 'Community spaces', 'Commercial installations', 'Custom wall art'], 1),
  ('02', 'Brand Identity & Graphic Design', 'Logo design, custom labels and packaging, banners, and print design.',
   ARRAY['Logo design', 'Brand identity systems', 'Packaging & labels', 'Print & banner design'], 2),
  ('03', 'Custom Digital Illustration & Vector Art', 'Digital illustration and vector artwork, including social media assets, vector line art, and character art.',
   ARRAY['Digital illustration', 'Vector line art', 'Character design', 'Social media assets'], 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. COMMISSION INQUIRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS commission_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  project_location TEXT,
  surface_type TEXT,
  project_size TEXT,
  description TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON commission_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON commission_inquiries(created_at DESC);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_inquiries ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (anyone can view published content)
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view published artworks"
  ON artworks FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view artist profile"
  ON artist_profile FOR SELECT
  USING (true);

CREATE POLICY "Public can view contact info"
  ON contact_info FOR SELECT
  USING (true);

CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- PUBLIC INSERT POLICY (anyone can submit commission inquiries)
CREATE POLICY "Public can submit commission inquiries"
  ON commission_inquiries FOR INSERT
  WITH CHECK (true);

-- AUTHENTICATED USER POLICIES (admin can do everything)
-- Note: You'll need to create an authenticated user via Supabase Auth

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage artworks"
  ON artworks FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage profile"
  ON artist_profile FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage contact"
  ON contact_info FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all inquiries"
  ON commission_inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update inquiry status"
  ON commission_inquiries FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 8. STORAGE BUCKET SETUP
-- =====================================================
-- Create storage bucket for artwork (run in Supabase Storage UI or via SQL)
-- Bucket name: 'artwork'
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, video/mp4

-- Storage policies will be created via Supabase UI:
-- 1. Public read access for all files
-- 2. Authenticated users can upload files
-- 3. Authenticated users can delete their uploaded files

-- =====================================================
-- 9. UPDATE TRIGGERS
-- =====================================================
-- Automatically update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_profile_updated_at BEFORE UPDATE ON artist_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. SLUG GENERATION FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Create storage bucket named 'artwork' in Supabase Storage
-- 2. Set bucket to public
-- 3. Add storage policies for authenticated upload/delete
-- 4. Create an admin user via Supabase Auth
-- 5. Copy your Supabase URL and anon key to .env file
