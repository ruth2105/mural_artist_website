# Content Management Guide - Mr. Jon Portfolio

This guide explains how to update and manage content on the Mr. Jon portfolio website without technical knowledge of React or JavaScript.

## 📸 Adding & Updating Artwork

### Step 1: Prepare Your Images

**Image Requirements:**
- **Format:** JPG, PNG, or WebP
- **Size:** Maximum 2MB per image (compress if larger)
- **Dimensions:** Minimum 1200px on longest side
- **Quality:** High quality but web-optimized

**Recommended Tools for Image Optimization:**
- **TinyPNG** (https://tinypng.com) - Free compression
- **Squoosh** (https://squoosh.app) - Browser-based optimizer
- **ImageOptim** (Mac) or **RIOT** (Windows) - Desktop apps

### Step 2: Add Images to Project

1. Place images in the `public/images/` folder
2. Organize by category if desired:
   ```
   public/images/
   ├── murals/
   ├── branding/
   ├── collaborations/
   └── portraits/
   ```

### Step 3: Update Artwork Data

Open `src/data/artworks.js` and find the project you want to update.

**Example - Update existing project:**

```javascript
{
  id: "kiyta-bag",
  title: "Kiyta Bag",
  category: "small-projects",
  ownership: "individual",
  image: "/images/branding/kiyta-bag.jpg",  // ← Update this path
  description: "Custom bag design for Kiyta brand",  // ← Add description
  featured: false,
  objectPosition: "center"  // or "top", "bottom", "left", "right"
}
```

**Example - Add new project:**

```javascript
{
  id: "new-project-2025",  // Unique ID (use lowercase with dashes)
  title: "New Mural 2025",  // Display name
  category: "murals",  // Choose: murals, small-projects, major-projects, collaborations, branding
  ownership: "individual",  // "individual" or "collaborative"
  image: "/images/murals/new-mural-2025.jpg",  // Image path
  images: [],  // Additional images (optional)
  video: null,  // Video URL (optional)
  description: "A vibrant mural celebrating Ethiopian culture",  // Description
  year: 2025,  // Year completed (optional)
  location: "Addis Ababa",  // Location (optional)
  collaborators: [],  // Array of names (optional)
  featured: true,  // true = larger in gallery
  objectPosition: "center"  // How to crop: center, top, bottom, left, right
}
```

### Step 4: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and verify the images appear correctly.

### Step 5: Deploy Changes

After making changes, rebuild and redeploy:

```bash
npm run build
# Then deploy to your hosting platform
```

---

## ✏️ Updating Text Content

### Artist Information

**File:** `src/data/artist.js`

```javascript
export const artistInfo = {
  name: "MR. JON",
  tagline: "Art without Boundaries.",
  
  // Update biography here
  biography: `Your updated biography text goes here.
  
  You can use multiple paragraphs by separating them with blank lines.`,
  
  contact: {
    phone: "0989990996",  // Update phone number
    email: "your-full-email@example.com",  // Add complete email
    tiktok: "https://www.tiktok.com/@masterstvo24",
    instagram: "https://www.instagram.com/mr_jon24/",
    telegram: "https://t.me/MrJo240",
    instagramHandle: "@mr_jon24",
    tiktokHandle: "@masterstvo24",
  },

  skills: [
    "Large-scale Murals",
    "Graffiti Art",
    // Add or remove skills as needed
  ]
};
```

### Services

**File:** `src/data/services.js`

Update service descriptions:

```javascript
{
  id: "01",
  title: "Commercial Murals & Spatial Art",  // Service name
  description: "Your updated service description",  // Main description
  features: [
    "Feature 1",
    "Feature 2",
    // Add or remove features
  ]
}
```

### Process Steps

**File:** `src/data/services.js`

Update the creative process:

```javascript
export const process = [
  { 
    number: "01", 
    title: "IDEA", 
    description: "Your description" 
  },
  // Update each step as needed
];
```

---

## 🎨 Customizing Colors

**File:** `tailwind.config.js`

```javascript
colors: {
  charcoal: '#111111',        // Main dark background
  'near-black': '#080808',    // Darker sections
  'warm-white': '#F4F1EB',    // Text and light backgrounds
  'muted-gray': '#A5A5A5',    // Secondary text
}
```

To change colors:
1. Find a color code you like (use https://coolors.co)
2. Replace the hex code
3. Rebuild and test

---

## 📝 Project Categories

The gallery has 6 categories:

1. **murals** - Mural projects
2. **small-projects** - Small Projects
3. **major-projects** - Featured/Major Projects
4. **collaborations** - Collaborative Projects
5. **branding** - Logo & Branding
6. **all** - Shows everything (automatic)

**To add a project to a category:**

Set the `category` field in `artworks.js`:

```javascript
{
  category: "murals",  // This project appears in MURALS filter
  // ...
}
```

**To hide a category from the filter:**

Edit `src/data/artworks.js` and remove the category from the `categories` array:

```javascript
export const categories = [
  { id: "all", label: "ALL" },
  { id: "murals", label: "MURALS" },
  // Remove any category you don't want to show
];
```

---

## 🖼️ Featured Projects

**What are featured projects?**

Featured projects appear larger in the gallery for more visual impact.

**How to make a project featured:**

```javascript
{
  id: "my-project",
  title: "Important Project",
  featured: true,  // ← Set to true
  // ...
}
```

**Recommendations:**
- Feature 2-4 projects maximum
- Feature your best or most recent work
- Mix categories (don't feature only murals)

---

## 📱 Updating Social Media Links

**File:** `src/data/artist.js`

```javascript
contact: {
  tiktok: "https://www.tiktok.com/@your_handle",
  instagram: "https://www.instagram.com/your_handle/",
  telegram: "https://t.me/your_handle",
  instagramHandle: "@your_handle",
  tiktokHandle: "@your_handle",
}
```

These links appear in:
- Mobile menu
- Social section
- Contact section  
- Footer

---

## 🎬 Adding Videos

### For Individual Projects

```javascript
{
  id: "mural-timelapse",
  title: "Mural Time-lapse",
  category: "murals",
  image: "/images/mural-thumbnail.jpg",  // Video thumbnail
  video: "https://youtube.com/embed/VIDEO_ID",  // YouTube embed URL
  // ...
}
```

**Supported video platforms:**
- YouTube (recommended): Use embed URL format
- Vimeo: Use embed URL format
- Direct video files: Place in `public/videos/`

**Note:** Video functionality needs to be enhanced in ProjectViewer component for full playback support.

---

## 📧 Commission Form Fields

**File:** `src/components/CommissionForm.jsx`

To add or remove form fields, update the form structure. This requires basic HTML knowledge.

**To change dropdown options:**

Find the project type select:

```javascript
<select name="projectType">
  <option value="">Select a type</option>
  <option value="mural">Mural / Spatial Art</option>
  <option value="branding">Brand Identity</option>
  // Add more options here
</select>
```

---

## 🎯 SEO & Meta Information

**File:** `index.html`

Update page title and description:

```html
<title>Mr. Jon | Murals, Visual Art & Graphic Design</title>

<meta name="description" content="Your updated description here" />

<meta property="og:title" content="Mr. Jon | Artist Portfolio" />
<meta property="og:description" content="Your description" />
<meta property="og:image" content="https://yoursite.com/og-image.jpg" />
```

**Creating an OG Image:**
- Size: 1200px × 630px
- Feature your best artwork or logo
- Add text: "MR. JON - Art without Boundaries"
- Save as `public/og-image.jpg`

---

## 🔄 Regular Maintenance

### Monthly Tasks

- [ ] Add new projects to gallery
- [ ] Update featured projects
- [ ] Check all links work
- [ ] Respond to commission form inquiries
- [ ] Update biography if needed

### Quarterly Tasks

- [ ] Review and update services
- [ ] Refresh social media links
- [ ] Update artist portrait if desired
- [ ] Check website performance
- [ ] Update meta descriptions

### Yearly Tasks

- [ ] Archive old projects (optional)
- [ ] Major biography update
- [ ] Review and update color scheme
- [ ] Performance audit
- [ ] Accessibility check

---

## 🆘 Common Issues & Solutions

### Issue: Image doesn't appear

**Solution:**
1. Check file path is correct
2. Verify image is in `public/images/`
3. Check for typos in filename
4. Ensure image isn't too large (>5MB)

### Issue: Text not updating

**Solution:**
1. Check you edited the correct file
2. Save the file after editing
3. Rebuild: `npm run build`
4. Clear browser cache
5. Redeploy to hosting

### Issue: Gallery filter not working

**Solution:**
1. Verify `category` field matches exactly
2. Category names are case-sensitive
3. Use dashes, not spaces: `small-projects` not `small projects`

### Issue: Project appears in wrong category

**Solution:**
1. Check the `category` field in `artworks.js`
2. Valid categories: `murals`, `small-projects`, `major-projects`, `collaborations`, `branding`

---

## 📋 Content Checklist

Before adding new content:

- [ ] Images optimized (under 2MB each)
- [ ] Image filenames are descriptive (no spaces)
- [ ] All text proofread for spelling/grammar
- [ ] Links tested (social media, external)
- [ ] Project descriptions written
- [ ] Category assigned correctly
- [ ] Featured status set appropriately
- [ ] Tested locally before deploying
- [ ] Backup made before major changes

---

## 💡 Best Practices

### Images
- Use consistent image quality
- Maintain aspect ratios appropriate for each section
- Compress before uploading
- Use descriptive filenames: `murals-addis-cafe-2024.jpg`

### Text
- Keep descriptions concise (2-3 sentences)
- Use active voice
- Highlight unique aspects of each project
- Proofread for grammar and spelling

### Organization
- Update regularly (at least monthly)
- Keep project list organized by date
- Remove outdated information promptly
- Backup content before major updates

### Performance
- Limit images to reasonable sizes
- Don't add 100+ projects at once
- Test on mobile after updates
- Monitor page load speed

---

## 📞 Need Help?

If you encounter issues:

1. **Check this guide first**
2. **Review README.md** for technical details
3. **Check browser console** for error messages (F12 key)
4. **Test in incognito mode** to rule out cache issues
5. **Document the exact problem** and steps taken

For technical support, contact your developer with:
- Description of the issue
- What you tried
- Screenshots if applicable
- Browser and device information

---

## ✨ Quick Reference

**Add artwork:** Edit `src/data/artworks.js`  
**Update bio:** Edit `src/data/artist.js`  
**Change services:** Edit `src/data/services.js`  
**Update colors:** Edit `tailwind.config.js`  
**Change page title:** Edit `index.html`

**After any change:**
```bash
npm run build    # Build for production
# Then redeploy to your hosting platform
```

---

**Keep creating amazing art!** 🎨
