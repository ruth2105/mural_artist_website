import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'artwork';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Directory containing media files
const MEDIA_DIR = path.join(__dirname, '..', 'public', 'portfolio-media');

async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
    } else {
      // Only upload images and videos
      const ext = path.extname(file).toLowerCase();
      if (['.webp', '.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.heic'].includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  }

  return arrayOfFiles;
}

async function uploadFile(filePath) {
  try {
    // Generate storage path (preserve folder structure)
    const relativePath = path.relative(path.join(__dirname, '..', 'public'), filePath);
    const storagePath = relativePath.replace(/\\/g, '/'); // Windows path fix

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.heic') contentType = 'image/heic';

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType,
        cacheControl: '31536000', // 1 year cache
        upsert: true // Overwrite if exists
      });

    if (error) {
      console.error(`❌ Failed to upload ${storagePath}:`, error.message);
      return { success: false, path: storagePath, error: error.message };
    }

    console.log(`✅ Uploaded: ${storagePath}`);
    return { success: true, path: storagePath };
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return { success: false, path: filePath, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting media upload to Supabase Storage...\n');
  console.log(`📁 Scanning directory: ${MEDIA_DIR}\n`);

  // Check if directory exists
  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`❌ Directory not found: ${MEDIA_DIR}`);
    process.exit(1);
  }

  // Get all files
  const files = await getAllFiles(MEDIA_DIR);
  console.log(`📊 Found ${files.length} media files to upload\n`);

  // Upload files with progress
  const results = [];
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`\r⏳ Progress: ${i + 1}/${files.length} files...`);
    
    const result = await uploadFile(file);
    results.push(result);
    
    if (result.success) uploaded++;
    else failed++;

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n\n📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${uploaded} files`);
  console.log(`❌ Failed: ${failed} files`);
  
  if (failed > 0) {
    console.log('\n❌ Failed uploads:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.path}: ${r.error}`);
    });
  }

  console.log('\n✨ Upload complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Verify uploads in Supabase Dashboard > Storage > artwork bucket');
  console.log('   2. Run: npm run update-artwork-urls');
  console.log('   3. Commit and push changes to deploy\n');
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
