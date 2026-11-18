# Media Upload Guide - Supabase Storage

## Problem
Images and videos aren't showing on the deployed site because large media files were excluded from git to avoid push timeouts.

## Solution
Upload all media files to **Supabase Storage** for fast, CDN-backed delivery.

---

## Step 1: Check Supabase Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `utuagxjsqluwmexkinik`
3. Navigate to **Storage** in the left sidebar
4. You should see an `artwork` bucket
5. **If the bucket doesn't exist:**
   - Click "Create a new bucket"
   - Name: `artwork`
   - **Make it PUBLIC** (very important!)
   - Save

---

## Step 2: Upload Media Files to Supabase

Run this command in your terminal (in the project folder):

```bash
npm run upload-media
```

This script will:
- ✅ Scan `public/portfolio-media/` folder
- ✅ Upload all images (.webp, .jpg, .png) and videos (.mp4, .mov)
- ✅ Preserve folder structure
- ✅ Show upload progress
- ⏱️ **Takes 5-10 minutes** (500+ files)

**Example output:**
```
🚀 Starting media upload to Supabase Storage...
📁 Scanning directory: public/portfolio-media
📊 Found 534 media files to upload
⏳ Progress: 534/534 files...

📊 Upload Summary:
✅ Successfully uploaded: 534 files
❌ Failed: 0 files

✨ Upload complete!
```

---

## Step 3: Update Artwork URLs

After upload completes, run:

```bash
npm run update-urls
```

This will:
- ✅ Update `src/data/artworks.js`
- ✅ Replace local `/portfolio-media/` paths with Supabase CDN URLs
- ✅ Example: `https://utuagxjsqluwmexkinik.supabase.co/storage/v1/object/public/artwork/portfolio-media/...`

---

## Step 4: Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- ✅ Images load correctly
- ✅ Videos play
- ✅ Gallery works smoothly

---

## Step 5: Deploy to Netlify

Once everything works locally:

```bash
git add -A
git commit -m "Update artwork URLs to use Supabase Storage CDN"
git push origin main
```

Netlify will auto-deploy (2-3 minutes). Check https://mrjonart.netlify.app

---

## Benefits of Supabase Storage

✅ **Fast Global CDN** - Images load quickly worldwide  
✅ **No Git Bloat** - Media files stay in cloud storage  
✅ **Easy Management** - Upload/delete via admin or Supabase dashboard  
✅ **Automatic Caching** - 1-year browser cache for fast repeat visits  
✅ **Scalable** - No size limits on your git repository  

---

## Troubleshooting

### "Missing Supabase credentials"
Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://utuagxjsqluwmexkinik.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### "Bucket not found"
1. Go to Supabase Dashboard > Storage
2. Create `artwork` bucket
3. Make it **PUBLIC**
4. Try upload again

### "Upload failed" errors
- Check your internet connection
- Verify Supabase credentials
- Check if bucket is PUBLIC
- Try running upload script again (it uses `upsert: true` so safe to re-run)

### Images still not showing on deployed site
1. Clear Netlify cache and redeploy
2. Check browser console for 404 errors
3. Verify URLs in `src/data/artworks.js` start with your Supabase URL
4. Check Supabase Storage > artwork bucket is PUBLIC

---

## Alternative: Quick Fix (If Upload Fails)

If you can't upload all files now, you can temporarily use placeholder images:

1. Upload just 1 sample image to Supabase Storage
2. Update artworks.js to use that same image for all artworks
3. Later, upload real images via admin dashboard

---

## For Future Artwork Uploads

After this initial setup, you can:
1. Use the **Admin Dashboard** to upload new artwork
2. It automatically uses Supabase Storage
3. No need to run these scripts again
4. New uploads instantly available on live site

---

Need help? Check the Supabase logs or contact support.
