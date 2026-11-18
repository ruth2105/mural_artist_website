import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  process.exit(1);
}

const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/artwork`;

// Read artworks.js
const artworksPath = path.join(__dirname, '..', 'src', 'data', 'artworks.js');
let content = fs.readFileSync(artworksPath, 'utf-8');

console.log('🔄 Updating artwork URLs to use Supabase Storage...\n');

// Replace all /portfolio-media/ URLs with Supabase storage URLs
const oldPrefix = '/portfolio-media/';
const newPrefix = `${STORAGE_URL}/portfolio-media/`;

// Count replacements
const matches = content.match(new RegExp(oldPrefix.replace(/\//g, '\\/'), 'g'));
const count = matches ? matches.length : 0;

console.log(`📊 Found ${count} URLs to update`);

// Perform replacement
content = content.replace(new RegExp(oldPrefix.replace(/\//g, '\\/'), 'g'), newPrefix);

// Write back
fs.writeFileSync(artworksPath, content, 'utf-8');

console.log(`✅ Updated ${count} URLs in artworks.js`);
console.log(`📝 Storage URL: ${STORAGE_URL}`);
console.log('\n✨ Done! Your artworks now use Supabase CDN URLs.\n');
