import { createClient } from '@supabase/supabase-js';
import { artworks } from '../src/data/artworks.js';
import { artistInfo } from '../src/data/artist.js';
import { services } from '../src/data/services.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupCompleteBackend() {
  console.log('🚀 Setting up complete backend...\n');

  // Step 1: Verify categories exist
  console.log('📁 Step 1: Verifying categories...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.error('❌ Error fetching categories:', catError.message);
    console.log('\n⚠️  Please run create-missing-tables.sql in Supabase SQL Editor first!');
    return;
  }

  console.log(`✅ Found ${categories.length} categories\n`);

  // Step 2: Migrate artworks
  console.log('🎨 Step 2: Migrating artworks...');
  
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  let artworkSuccess = 0;
  let artworkErrors = 0;

  for (const artwork of artworks) {
    try {
      const categoryId = categoryMap[artwork.category];
      
      if (!categoryId) {
        artworkErrors++;
        continue;
      }

      const slug = `${artwork.category}-${artwork.title}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const artworkData = {
        title: artwork.title,
        slug: slug,
        category_id: categoryId,
        description: artwork.description || '',
        main_image_url: artwork.image,
        main_image_path: artwork.sourceFolder || '',
        gallery_images: {
          images: artwork.images || [],
          videos: artwork.videos || []
        },
        ownership_type: artwork.ownership || 'individual',
        is_featured: artwork.featured || false,
        status: 'published',
        object_position: artwork.objectPosition || 'center'
      };

      const { error } = await supabase
        .from('artworks')
        .upsert([artworkData], { onConflict: 'slug' });

      if (error) {
        console.log(`  ❌ ${artwork.title}: ${error.message}`);
        artworkErrors++;
      } else {
        artworkSuccess++;
      }

    } catch (err) {
      artworkErrors++;
    }
  }

  console.log(`✅ Migrated ${artworkSuccess}/${artworks.length} artworks`);
  if (artworkErrors > 0) {
    console.log(`⚠️  ${artworkErrors} errors\n`);
  } else {
    console.log('');
  }

  // Step 3: Setup artist profile
  console.log('👤 Step 3: Setting up artist profile...');
  
  const { error: profileError } = await supabase
    .from('artist_profile')
    .upsert([{
      name: artistInfo.name,
      tagline: artistInfo.tagline,
      biography: artistInfo.biography,
      profile_image_url: artistInfo.profileImage,
      skills: artistInfo.skills
    }]);

  if (profileError) {
    console.log(`  ❌ Error: ${profileError.message}`);
  } else {
    console.log('  ✅ Artist profile created\n');
  }

  // Step 4: Setup contact info
  console.log('📞 Step 4: Setting up contact info...');
  
  const { error: contactError } = await supabase
    .from('contact_info')
    .upsert([{
      email: artistInfo.contact.email,
      phone: artistInfo.contact.phone,
      telegram_url: artistInfo.contact.telegram,
      telegram_handle: artistInfo.contact.tiktokHandle,
      tiktok_url: artistInfo.contact.tiktok,
      tiktok_handle: artistInfo.contact.tiktokHandle,
      instagram_url: artistInfo.contact.instagram,
      instagram_handle: artistInfo.contact.instagramHandle,
      youtube_url: artistInfo.contact.youtube,
      youtube_handle: artistInfo.contact.youtubeHandle
    }]);

  if (contactError) {
    console.log(`  ❌ Error: ${contactError.message}`);
  } else {
    console.log('  ✅ Contact info created\n');
  }

  // Step 5: Setup services
  console.log('🛠️  Step 5: Setting up services...');
  
  for (const service of services) {
    const { error: serviceError } = await supabase
      .from('services')
      .upsert([{
        service_number: service.id,
        title: service.title,
        description: service.description,
        features: service.features,
        display_order: parseInt(service.id),
        is_active: true
      }]);

    if (serviceError) {
      console.log(`  ❌ ${service.title}: ${serviceError.message}`);
    }
  }

  console.log(`  ✅ ${services.length} services created\n`);

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('🎉 Backend Setup Complete!');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Categories: ${categories.length}`);
  console.log(`✅ Artworks: ${artworkSuccess}`);
  console.log(`✅ Artist Profile: Created`);
  console.log(`✅ Contact Info: Created`);
  console.log(`✅ Services: ${services.length}`);
  console.log('═══════════════════════════════════════\n');
}

setupCompleteBackend();
