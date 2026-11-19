import { createClient } from '@supabase/supabase-js';
import { artworks, categories } from '../src/data/artworks.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateArtworks() {
  console.log('🚀 Starting artwork migration to Supabase...\n');

  // First, get category IDs from database
  const { data: dbCategories, error: catError } = await supabase
    .from('categories')
    .select('id, slug');

  if (catError) {
    console.error('❌ Error fetching categories:', catError);
    return;
  }

  const categoryMap = {};
  dbCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  let successCount = 0;
  let errorCount = 0;

  for (const artwork of artworks) {
    try {
      const categoryId = categoryMap[artwork.category];
      
      if (!categoryId) {
        console.warn(`⚠️  No category found for ${artwork.category}, skipping ${artwork.title}`);
        errorCount++;
        continue;
      }

      // Generate slug from title
      const slug = artwork.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      // Prepare artwork data for database
      const artworkData = {
        title: artwork.title,
        slug: slug,
        category_id: categoryId,
        description: artwork.description || '',
        main_image_url: artwork.image,
        main_image_path: artwork.sourceFolder || '',
        gallery_images: JSON.stringify({
          images: artwork.images || [],
          videos: artwork.videos || []
        }),
        ownership_type: artwork.ownership || 'individual',
        is_featured: artwork.featured || false,
        status: 'published', // All existing artworks are published
        object_position: artwork.objectPosition || 'center'
      };

      // Insert into database
      const { error } = await supabase
        .from('artworks')
        .upsert([artworkData], { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error inserting ${artwork.title}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated: ${artwork.title}`);
        successCount++;
      }

    } catch (err) {
      console.error(`❌ Exception for ${artwork.title}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successfully migrated: ${successCount} artworks`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📦 Total processed: ${artworks.length}`);
}

migrateArtworks();
