# Priority 3: Database Integration - Setup Instructions

## Status: Ready for Execution

All code is prepared. Follow these steps to complete database integration.

---

## Step 1: Execute SQL in Supabase (5 minutes)

1. Go to https://supabase.com/dashboard/project/utuagxjsqluwmexkinik
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content of `scripts/create-missing-tables.sql`
5. Paste into the query editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success message: "Success. No rows returned"

This will create:
- `artist_profile` table with RLS policies
- `contact_info` table with RLS policies
- `services` table with RLS policies
- Initial data for artist profile, contact info, and services
- Updated categories matching current structure

---

## Step 2: Migrate Data to Database (2 minutes)

Run the migration script from your local terminal:

```powershell
npm run setup-backend
```

This will:
- Verify categories exist
- Migrate all 51 artworks to database
- Setup artist profile data
- Setup contact info data
- Setup services data

Expected output:
```
🚀 Setting up complete backend...

📁 Step 1: Verifying categories...
✅ Found 5 categories

🎨 Step 2: Migrating artworks...
✅ Migrated 51/51 artworks

👤 Step 3: Setting up artist profile...
  ✅ Artist profile created

📞 Step 4: Setting up contact info...
  ✅ Contact info created

🛠️  Step 5: Setting up services...
  ✅ Services created

✅ Backend setup complete!
```

---

## Step 3: Update Components to Use Database (Automated)

The following components will be updated to use database hooks:

### Components to Update:
1. ✅ `ArtworkGallery.jsx` - Use `useArtworks()` hook
2. ✅ `Hero.jsx` - Use `useArtistProfile()` hook
3. ✅ `AboutSection.jsx` - Use `useArtistProfile()` hook
4. ✅ `ContactSection.jsx` - Use `useArtistProfile()` hook
5. ✅ `ServicesSection.jsx` - Use `useServices()` hook

### How Hooks Work:
- Hooks try to fetch from Supabase database first
- If database is empty or fails, they **automatically fallback** to static data
- No breaking changes - site continues to work during migration
- Once database has data, it becomes the source of truth

---

## Step 4: Verify Database Integration (3 minutes)

After running steps 1-3:

1. Check Supabase dashboard:
   - Go to **Table Editor**
   - Verify tables: `artworks`, `artist_profile`, `contact_info`, `services`
   - Check row counts match expected numbers

2. Test public site locally:
   ```powershell
   npm run dev
   ```
   - Visit http://localhost:5173
   - Check gallery loads artworks
   - Check About section shows profile
   - Check Services section shows services
   - Check Contact section shows contact info

3. Test draft/published workflow:
   - In Supabase, edit an artwork
   - Change `status` from `published` to `draft`
   - Refresh public site - artwork should disappear
   - Change back to `published` - artwork reappears

---

## What Happens After Database Setup?

### Public Site Behavior:
- **Before Step 2**: Site uses static data from `src/data/*.js` files
- **After Step 2**: Site uses database data from Supabase

### Admin Workflow:
- Admin can add/edit/delete artworks in Supabase
- Changes reflect immediately on public site
- Draft artworks hidden from public
- Published artworks visible to everyone

### Data Flow:
```
Admin changes in Supabase
  ↓
Database tables updated
  ↓
React hooks fetch from database
  ↓
Public site updates automatically
```

---

## Troubleshooting

### Issue: SQL script fails
- **Cause**: `update_updated_at_column()` function doesn't exist
- **Fix**: Run this first in SQL Editor:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Issue: Migration script fails with "categories not found"
- **Cause**: Step 1 (SQL) not completed
- **Fix**: Run Step 1 first, then retry Step 2

### Issue: Site shows blank after migration
- **Cause**: Artworks have `status: 'draft'` instead of `'published'`
- **Fix**: In Supabase Table Editor, update artworks:
```sql
UPDATE artworks SET status = 'published' WHERE status = 'draft';
```

---

## Files Ready for Execution

- ✅ `scripts/create-missing-tables.sql` - SQL to create tables
- ✅ `scripts/setup-complete-backend.js` - Migration script
- ✅ `src/hooks/useArtworks.js` - Hook with fallback logic
- ✅ `src/hooks/useArtistProfile.js` - Hook with fallback logic
- ✅ `src/hooks/useServices.js` - Hook with fallback logic
- ⏳ Components (to be updated in next step)

---

## Next Steps

I will now update the 5 components to use database hooks instead of static imports.
