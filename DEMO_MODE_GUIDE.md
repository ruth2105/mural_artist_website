# 🎯 Demo Mode Guide

The portfolio now runs in **Demo Mode** until you set up Supabase. This lets you explore the admin dashboard and see how Mr. Jon will manage his artwork after deployment.

---

## ✅ What Works in Demo Mode

### Public Site (http://localhost:3000)
- ✅ All sections visible
- ✅ Gallery shows 12 sample artworks
- ✅ Animations and interactions working
- ✅ Contact form (shows success but doesn't save)

### Admin Dashboard (http://localhost:3000/admin)
- ✅ **Auto-login** (no password needed in demo mode)
- ✅ Dashboard shows sample stats
- ✅ View sample artworks list
- ✅ Add artwork form (shows confirmation dialog)
- ✅ Edit/delete buttons work (local only)
- ✅ Toggle publish/draft status
- ✅ Filter by published/draft

---

## 🚀 How to Explore Demo Mode

### 1. View Public Site
```
Open: http://localhost:3000
```
Scroll through all sections, click gallery filters, test animations.

### 2. Access Admin Dashboard
```
Go to: http://localhost:3000/admin
```
**No login needed!** In demo mode, you're automatically logged in as "Demo User".

### 3. Try Adding Artwork
1. Click **"➕ Add New Artwork"**
2. Fill in the form:
   - Title: "My Test Project"
   - Category: Select one
   - Description: Write something
   - Status: Published or Draft
3. Click **"Create Artwork"**
4. See confirmation dialog explaining demo mode

### 4. Manage Existing Artworks
1. Go to **"Manage Artworks"**
2. See 3 sample artworks (2 published, 1 draft)
3. Try:
   - Click ✅/📝 to toggle published status
   - Click **Edit** to see the form
   - Click **Delete** to remove (demo confirmation)
   - Filter by "Published" / "Draft" / "All"

### 5. View Dashboard Stats
- See sample numbers (12 artworks, 10 published, 2 drafts)
- View recent artworks
- Quick action buttons

---

## 🔄 When Supabase Is Set Up

After following `CMS_SETUP_GUIDE.md`:

1. **Update `.env`** with real Supabase credentials
2. **Restart dev server**: `npm run dev`
3. **Demo mode automatically turns off**
4. **Real login required** at `/admin/login`
5. **Real database saves** instead of demo dialogs
6. **Real image uploads** to Supabase Storage

---

## 🎨 What Mr. Jon Will See (After Setup)

The exact same interface you're seeing now, but:
- Login page at `/admin/login` (email + password)
- Real drag-and-drop image uploads
- Artwork saves to database
- Images stored permanently
- Gallery updates automatically
- Commission inquiries saved

---

## 📝 Demo vs Production Comparison

| Feature | Demo Mode | Production (After Supabase) |
|---------|-----------|------------------------------|
| **Public Gallery** | ✅ Sample data | ✅ Real artwork from database |
| **Admin Access** | ✅ Auto-login | 🔐 Login required |
| **Add Artwork** | ⚠️ Shows dialog only | ✅ Saves to database |
| **Upload Images** | ⚠️ Preview only | ✅ Uploads to storage |
| **Edit/Delete** | ⚠️ Local state only | ✅ Updates database |
| **Commission Form** | ⚠️ No save | ✅ Saves to database |

---

## 🎯 Next Steps

1. **Explore demo mode** to understand the workflow
2. **Follow `CMS_SETUP_GUIDE.md`** to set up Supabase (~30 min)
3. **Share `FOR_MR_JON_HOW_TO_ADD_ARTWORK.md`** with the artist
4. **Deploy** to Netlify/Vercel with environment variables

---

## 🛠️ Technical Notes

Demo mode is activated when `.env` contains placeholder values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The system checks if URL contains "your-project" and switches to demo mode automatically.

All demo mode code is in:
- `src/contexts/AuthContext.jsx` - Auto-login
- `src/pages/admin/Dashboard.jsx` - Sample stats
- `src/pages/admin/ArtworksList.jsx` - Sample artworks
- `src/pages/admin/ArtworkForm.jsx` - Sample categories + demo save
- `src/components/ArtworkGallery.jsx` - Sample gallery data

---

**Demo mode is a preview tool, not for production use.**
