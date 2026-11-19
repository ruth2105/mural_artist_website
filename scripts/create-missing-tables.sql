-- =====================================================
-- CREATE MISSING TABLES FOR MR. JON PORTFOLIO
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ARTIST PROFILE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS artist_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  biography TEXT,
  profile_image_url TEXT,
  profile_image_path TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE artist_profile ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public can view artist profile"
  ON artist_profile FOR SELECT
  USING (true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage profile"
  ON artist_profile FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update trigger
CREATE TRIGGER update_artist_profile_updated_at BEFORE UPDATE ON artist_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. CONTACT INFO TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  tiktok_url TEXT,
  tiktok_handle TEXT,
  instagram_url TEXT,
  instagram_handle TEXT,
  telegram_url TEXT,
  telegram_handle TEXT,
  youtube_url TEXT,
  youtube_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public can view contact info"
  ON contact_info FOR SELECT
  USING (true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage contact"
  ON contact_info FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update trigger
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. SERVICES TABLE
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

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Update trigger
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. INSERT INITIAL DATA
-- =====================================================

-- Insert artist profile
INSERT INTO artist_profile (name, tagline, biography, profile_image_url, skills) 
VALUES (
  'Mr Jon Creates',
  'Art without Boundaries.',
  'For the past five years, my focus has been crafting striking graphic designs and large-scale murals that capture attention. But my passion lies in pushing creative boundaries: I am honored to be the first artist in Ethiopia to leverage Meta Quest VR to design and execute large-scale mural projects.

Art is best shared—I frequently collaborate with creators across industries to fuse traditional artistry with modern digital techniques, crafting visual narratives that resonate deeply and stand out.',
  'https://utuagxjsqluwmexkinik.supabase.co/storage/v1/object/public/artwork/portfolio-media/Mr%20Jon/Mrr%20Jon/profiel/photo_6046325445029990635_w.jpg',
  ARRAY['Large-scale Murals', 'Graffiti Art', 'Brand Identity Design', 'Graphic Design', 'Digital Illustration', 'Vector Art', 'VR Art Creation']
)
ON CONFLICT DO NOTHING;

-- Insert contact info
INSERT INTO contact_info (email, phone, telegram_url, telegram_handle, tiktok_url, tiktok_handle, instagram_url, instagram_handle, youtube_url, youtube_handle)
VALUES (
  'Yohannessheferaw24@gmail.com',
  '+251 98 999 0996',
  'https://t.me/MrJo240',
  '@MrJo240',
  'https://www.tiktok.com/@masterstvo24',
  '@masterstvo24',
  'https://www.instagram.com/mr_jon24/',
  '@mr_jon24',
  'https://www.youtube.com/@MrJon24',
  '@MrJon24'
)
ON CONFLICT DO NOTHING;

-- Insert services
INSERT INTO services (service_number, title, description, features, display_order)
VALUES
  ('01', 'Commercial Murals & Wall Art', 'Large-scale murals and visual artwork for physical spaces, including local cafés, offices, and public spaces.',
   ARRAY['Interior & exterior murals', 'Large Scale Paint', 'Art on the windows', 'Custom wall art'], 1),
  ('02', 'Brand Identity & Graphic Design', 'Logo design, custom labels and packaging, and print design.',
   ARRAY['Logo design', 'Brand identity systems', 'Packaging & labels', 'Print design'], 2),
  ('03', 'Custom Digital Illustration & Vector Art', 'Digital illustration and vector artwork, including social media assets, vector line art, and character art.',
   ARRAY['Digital illustration', 'Vector line art', 'Character design', 'Social media assets'], 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. UPDATE CATEGORIES TO MATCH CURRENT STRUCTURE
-- =====================================================

-- Clear existing categories
TRUNCATE TABLE categories CASCADE;

-- Insert current categories
INSERT INTO categories (name, slug, label, display_order, is_active)
VALUES
  ('all', 'all', 'All Projects', 0, true),
  ('big-projects', 'big-projects', 'Big Projects Own by Me', 1, true),
  ('collaborations', 'collaborations', 'Projects Done by Collaboration', 2, true),
  ('small-projects', 'small-projects', 'Small Mural Art Gallery', 3, true),
  ('advertising-printing', 'advertising-printing', 'Advertising and Printing', 4, true)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  display_order = EXCLUDED.display_order;

-- =====================================================
-- TABLES CREATED SUCCESSFULLY
-- =====================================================
