import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupBucket() {
  console.log('🔍 Checking storage bucket...\n');

  try {
    // List buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      console.log('\n📝 Manual setup required:');
      console.log('   1. Go to Supabase Dashboard > Storage');
      console.log('   2. Create bucket named: artwork');
      console.log('   3. Make it PUBLIC');
      process.exit(1);
    }

    const artworkBucket = buckets.find(b => b.name === 'artwork');

    if (artworkBucket) {
      console.log('✅ Bucket "artwork" exists');
      console.log(`   - Public: ${artworkBucket.public ? 'YES ✓' : 'NO ✗'}`);
      console.log(`   - ID: ${artworkBucket.id}`);
      
      if (!artworkBucket.public) {
        console.log('\n⚠️  WARNING: Bucket is not public!');
        console.log('   Images won\'t be accessible on the website.');
        console.log('\n📝 To fix:');
        console.log('   1. Go to Supabase Dashboard > Storage');
        console.log('   2. Click on "artwork" bucket');
        console.log('   3. Click Settings');
        console.log('   4. Toggle "Public bucket" to ON');
      } else {
        console.log('\n✨ Storage is configured correctly!');
        console.log('\n📝 Next step: Upload media files');
        console.log('   Run: npm run upload-media');
      }
    } else {
      console.log('❌ Bucket "artwork" does not exist\n');
      console.log('📝 To create it:');
      console.log('   1. Go to Supabase Dashboard > Storage');
      console.log('   2. Click "Create a new bucket"');
      console.log('   3. Name: artwork');
      console.log('   4. Toggle "Public bucket" to ON');
      console.log('   5. Click "Create bucket"');
      console.log('\nThen run this script again.');
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

setupBucket();
