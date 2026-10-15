# CMS & ADMIN DASHBOARD SETUP GUIDE

## 🎯 Overview

The Mr. Jon portfolio now includes a **complete content management system (CMS)** with:

- ✅ **Supabase Backend** - PostgreSQL database + file storage
- ✅ **Secure Admin Dashboard** - Protected by authentication
- ✅ **Image Upload** - Drag & drop artwork uploads
- ✅ **Dynamic Content** - Public site updates automatically
- ✅ **Commission Form** - Saves inquiries to database
- ✅ **No Code Required** - Artist can manage everything through the UI

---

## 📋 SETUP CHECKLIST

### Step 1: Create Supabase Project (5 minutes)

1. **Go to** https://supabase.com
2. **Sign up** for a free account
3. **Create new project**
   - Project name: `mr-jon-portfolio`
   - Database password: Save this securely
   - Region: Choose closest to Ethiopia (e.g., Frankfurt, Mumbai)
4. **Wait** for project to be provisioned (~2 minutes)

### Step 2: Setup Database Schema (2 minutes)

1. **Open SQL Editor** in Supabase dashboard
2. **Copy contents** of `supabase-schema.sql` (root of project)
3. **Paste** into SQL Editor
4. **Click "Run"** to execute
5. **Verify** tables were created:
   - Go to "Table Editor"
   - You should see: artworks, categories, artist_profile, contact_info, services, commission_inquiries

### Step 3: Create Storage Bucket (2 minutes)

1. **Go to Storage** in Supabase dashboard
2. **Click "Create bucket"**
3. **Bucket name:** `artwork`
4. **Set to Public:** ✅ Yes
5. **Click Create**

**Set Storage Policies:**

Go to the artwork bucket → Policies tab → Add these policies:

**Policy 1 - Public Read:**
```sql
-- Allow public to read files
CREATE POLICY "Public can view artwork"
ON storage.objects FOR SELECT
USING (bucket_id = 'artwork');
```

**Policy 2 - Authenticated Upload:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload artwork"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artwork' AND
  auth.role() = 'authenticated'
);
```

**Policy 3 - Authenticated Delete:**
```sql
-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete artwork"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'artwork' AND
  auth.role() = 'authenticated'
);
```

### Step 4: Create Admin User (1 minute)

1. **Go to Authentication** in Supabase dashboard
2. **Click "Add user" → "Create new user"**
3. **Enter:**
   - Email: Your admin email (e.g., `admin@mrjon.art`)
   - Password: Strong password (save securely)
   - Auto Confirm User: ✅ Yes
4. **Click "Create user"**

**IMPORTANT:** This is the account Mr. Jon will use to log in to the admin dashboard.

### Step 5: Get API Credentials (1 minute)

1. **Go to Project Settings** → API
2. **Copy these values:**
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

**DO NOT copy the service_role key** - it's secret and should never be in frontend code.

### Step 6: Configure Environment Variables (1 minute)

1. **In project root**, copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. **Edit `.env`** file:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Replace** with your actual Supabase URL and anon key

### Step 7: Test Locally (2 minutes)

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**Test the admin dashboard:**

1. Visit http://localhost:3000/admin/login
2. Log in with the admin credentials you created
3. You should see the dashboard
4. Try adding a test artwork with an image

**Test the public site:**

1. Visit http://localhost:3000
2. Any published artwork should appear in the gallery
3. Try submitting the commission form

---

## 🚀 DEPLOYMENT SETUP

### For Netlify:

1. **Push to Git** (GitHub/GitLab)

2. **Connect to Netlify:**
   - Go to Netlify dashboard
   - "Add new site" → "Import from Git"
   - Select your repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

5. **Deploy!**

### For Vercel:

1. **Push to Git**

2. **Connect to Vercel:**
   - Go to Vercel dashboard
   - "Add New Project"
   - Import your repository

3. **Add Environment Variables:**
   - During setup, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy!**

**IMPORTANT:** Environment variables must be set on your hosting platform for the deployed site to work.

---

## 👤 HOW TO USE THE ADMIN DASHBOARD

### Login

1. Go to `https://yoursite.com/admin/login`
2. Enter admin email and password
3. You'll be redirected to the dashboard

### Add New Artwork

1. **Click "Add New Artwork"** button
2. **Upload Image:**
   - Drag & drop or click to browse
   - Supports JPG, PNG, WebP (max 10MB)
3. **Fill Form:**
   - Title (required)
   - Category (required)
   - Description
   - Year, location (optional)
   - Video URL (optional YouTube/Vimeo link)
4. **Choose Status:**
   - **Draft** = Not visible to public (for testing)
   - **Published** = Visible on public website
5. **Click "Create Artwork"**

### Edit Existing Artwork

1. Go to **"Manage Artworks"**
2. Click **"Edit"** on any artwork
3. Update any fields
4. Upload new image if needed (replaces old one)
5. Click **"Update Artwork"**

### Delete Artwork

1. Go to **"Manage Artworks"**
2. Click **"Delete"** on artwork
3. Confirm deletion
4. Artwork removed from database and public site

### Publish/Unpublish

1. Go to **"Manage Artworks"**
2. Click the **status badge** (✅ Published or 📝 Draft)
3. Status toggles immediately
4. Published = visible on site
5. Draft = hidden from public

### View Commission Inquiries

1. Click **"Inquiries"** in sidebar
2. See all form submissions
3. Contact information and project details
4. Mark as reviewed/contacted

---

## 🔐 SECURITY FEATURES

### ✅ Implemented Security:

- **Authentication required** for admin access
- **Row Level Security (RLS)** on all database tables
- **Public can only:**
  - Read published artworks
  - Submit commission inquiries
- **Authenticated users can:**
  - Create/edit/delete artworks
  - View all inquiries
  - Manage categories and profile
- **Storage policies** protect file uploads
- **Environment variables** keep credentials secure
- **Anon key** is safe for frontend (public key)

### ⚠️ Important Security Notes:

- Never share your admin password
- Never commit `.env` file to Git
- Never expose `service_role` key in frontend
- Keep Supabase dashboard password secure
- Only create admin accounts for trusted users

---

## 📊 DATABASE STRUCTURE

### Tables:

**artworks:**
- Stores all portfolio projects
- Links to categories
- Includes image URLs and metadata
- Status field controls visibility

**categories:**
- Manages gallery categories
- Customizable labels and order
- Can be activated/deactivated

**artist_profile:**
- Artist name, bio, skills
- Portrait image
- Editable through admin

**contact_info:**
- Social media links
- Phone, email
- Editable through admin

**services:**
- Service offerings
- Descriptions and features
- Display order

**commission_inquiries:**
- Form submissions
- Client contact info
- Project details
- Status tracking

---

## 🎨 HOW THE CMS WORKS

### For the Artist (Mr. Jon):

1. **Log in** to admin dashboard
2. **Upload artwork** with drag & drop
3. **Add details** - title, category, description
4. **Save as draft** to preview privately
5. **Publish** when ready
6. **Public website updates automatically** - no developer needed!

### For Website Visitors:

1. Visit public site
2. See only **published** artworks
3. Browse by category
4. Submit commission inquiries
5. Inquiries saved to database instantly

### Behind the Scenes:

- Supabase stores all data
- Images hosted in Supabase Storage
- Public site queries database in real-time
- No rebuilds or redeployments needed
- Draft content stays private

---

## 🧪 TESTING CHECKLIST

Before going live, verify:

### Admin Dashboard:
- [ ] Can log in with admin credentials
- [ ] Dashboard loads and shows stats
- [ ] Can upload image (drag & drop works)
- [ ] Can create new artwork
- [ ] Draft artwork is NOT visible on public site
- [ ] Can publish artwork
- [ ] Published artwork APPEARS on public site
- [ ] Can edit existing artwork
- [ ] Can delete artwork
- [ ] Can toggle publish/draft status
- [ ] Can log out

### Public Website:
- [ ] Gallery loads published artworks
- [ ] Category filters work
- [ ] Project viewer opens
- [ ] Commission form submits successfully
- [ ] Form data appears in admin inquiries
- [ ] Draft artworks are NOT visible
- [ ] Deleted artworks are NOT visible
- [ ] Images load correctly

### Security:
- [ ] Cannot access /admin without logging in
- [ ] Redirects to login if not authenticated
- [ ] Public cannot see draft content
- [ ] Public cannot delete/edit artworks

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to Supabase"

**Problem:** Environment variables not set

**Solution:**
1. Check `.env` file exists
2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
3. Restart dev server: `npm run dev`

---

### "Login failed" or "Invalid credentials"

**Problem:** User not created or wrong password

**Solution:**
1. Go to Supabase → Authentication
2. Verify user exists
3. Try resetting password
4. Ensure "Auto Confirm User" was checked

---

### "Error uploading image"

**Problem:** Storage bucket not configured

**Solution:**
1. Go to Supabase → Storage
2. Verify `artwork` bucket exists
3. Check bucket is set to Public
4. Verify storage policies are created

---

### "Artworks not appearing on public site"

**Problem:** Status is "draft" or database not querying correctly

**Solution:**
1. Check artwork status is "published"
2. Check browser console for errors
3. Verify Supabase URL in .env is correct
4. Check RLS policies are created

---

### "Images not loading"

**Problem:** Storage bucket not public or wrong URL

**Solution:**
1. Verify storage bucket is public
2. Check image URL in database
3. Test URL directly in browser
4. Verify storage policies allow public read

---

## 📞 SUPPORT & RESOURCES

### Documentation:
- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com
- **React Dropzone:** https://react-dropzone.js.org

### Supabase Dashboard:
- **Your Project:** https://app.supabase.com/project/YOUR_PROJECT_ID
- **SQL Editor:** For running queries
- **Table Editor:** Visual database browser
- **Storage:** File management
- **Authentication:** User management

### Getting Help:
- Check Supabase logs for errors
- Review browser console (F12)
- Check network tab for failed requests
- Verify environment variables are set

---

## ✅ FINAL VERIFICATION

Before launching:

1. **Admin user created** ✓
2. **Database schema run** ✓
3. **Storage bucket configured** ✓
4. **Environment variables set** ✓
5. **Test upload works** ✓
6. **Published content appears** ✓
7. **Draft content hidden** ✓
8. **Commission form saves** ✓
9. **Deployed with env vars** ✓
10. **Admin can log in on live site** ✓

---

## 🎉 YOU'RE READY!

Mr. Jon can now:

- ✅ Log in to admin dashboard
- ✅ Upload artwork directly from computer/phone
- ✅ Manage all portfolio content
- ✅ Publish/unpublish projects
- ✅ View commission inquiries
- ✅ Update artist profile
- ✅ All without touching code!

**The public website updates automatically when content is published!**

---

**Questions? Check the troubleshooting section or Supabase documentation.**

**Last Updated:** January 2025  
**System Status:** ✅ CMS Fully Operational
