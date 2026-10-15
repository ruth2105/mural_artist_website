# MR. JON - Premium Artist Portfolio with CMS

A production-quality, custom-designed portfolio website for Ethiopian visual artist Mr. Jon, featuring a **complete content management system (CMS)** that allows the artist to upload and manage artwork without any coding knowledge.

## 🎉 NEW: FULLY EDITABLE PORTFOLIO

**Mr. Jon can now:**
- ✅ Log in to admin dashboard
- ✅ Upload artwork with drag & drop
- ✅ Add/edit/delete projects
- ✅ Publish content instantly
- ✅ Manage inquiries
- ✅ Update profile and services
- ✅ **No developer needed!**

**Public website updates automatically** when content is published through the admin dashboard.

---

## 🎨 Overview

This is a distinctive digital art experience featuring:

- **Cinematic hero section** with sophisticated entrance animations
- **Interactive artwork gallery** with smooth filtering and project viewer
- **Immersive project viewer** with full-screen navigation
- **Professional services presentation**
- **Commission inquiry form** (ready for backend integration)
- **Responsive design** optimized for all devices
- **Accessibility-focused** with keyboard navigation and reduced-motion support

## 🚀 Live Website

**Development Server:** http://localhost:3000 (when running locally)

## 📋 Features

### For the Artist (Admin Dashboard)
- 🔐 **Secure Authentication** - Protected admin area
- 📤 **Drag & Drop Upload** - Easy image uploads (max 10MB)
- ✏️ **Content Management** - Add, edit, delete artwork
- 📝 **Draft & Publish** - Preview before going live
- 📧 **Inquiry Management** - View commission form submissions
- 👤 **Profile Editor** - Update bio, skills, contact info
- 📱 **Mobile Friendly** - Manage from phone or computer

### For Website Visitors

### Design & User Experience
- ✨ Gallery-inspired dark theme with sophisticated backgrounds
- 🎭 Expressive typography using Space Grotesk and Inter
- 🖼️ Asymmetric masonry gallery with category filtering
- 🎬 Smooth scroll animations with Framer Motion
- 📱 Mobile-first responsive design
- ♿ WCAG accessibility standards
- 🎯 Custom hover interactions and microanimations

### Sections
1. **Navigation** - Minimal, elegant nav with mobile menu
2. **Hero** - Full-screen cinematic introduction
3. **Introduction** - "Art without Boundaries" statement
4. **Gallery** - Filterable artwork showcase with 6 categories
5. **About** - Artist biography and skills
6. **Process** - 5-step creative journey
7. **Services** - Three main service offerings
8. **Commission** - Project inquiry form
9. **Social** - TikTok, Instagram, Telegram links
10. **Contact** - Direct contact information
11. **Footer** - Navigation and social links

## 🛠️ Tech Stack

- **Frontend:** React 18.2, Vite 5.0
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11.0
- **Routing:** React Router DOM
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **File Upload:** React Dropzone
- **Image Storage:** Supabase Storage (CDN)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Supabase account (free tier available)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase Backend

**Follow the complete guide:** See `CMS_SETUP_GUIDE.md`

**Quick steps:**
1. Create Supabase project at https://supabase.com
2. Run `supabase-schema.sql` in SQL Editor
3. Create storage bucket named `artwork`
4. Create admin user in Authentication
5. Get API credentials from Project Settings

### 3. Configure Environment Variables

```bash
# Copy example file
copy .env.example .env

# Edit .env and add your Supabase credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Public site:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login

### 5. Test the CMS

1. Log in with your admin credentials
2. Upload a test artwork
3. Publish it
4. Check if it appears on the public site

**See `CMS_SETUP_GUIDE.md` for detailed instructions.**

---

## 📚 Documentation

### Setup & Configuration
- **`CMS_SETUP_GUIDE.md`** - Complete CMS setup (START HERE!)
- **`DEPLOYMENT_GUIDE.md`** - Deploy to Netlify/Vercel
- **`CONTENT_GUIDE.md`** - Managing content (for non-technical users)
- **`supabase-schema.sql`** - Database schema

### Reference
- **`PROJECT_HANDOFF.md`** - Project overview
- **`.env.example`** - Environment variable template

---

## 📂 Project Structure (Updated)

```
mr-jon-portfolio/
├── src/
│   ├── components/
│   │   ├── admin/              # NEW: Admin components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ImageUpload.jsx
│   │   └── ... (public components)
│   │
│   ├── contexts/               # NEW: React contexts
│   │   └── AuthContext.jsx
│   │
│   ├── lib/                    # NEW: Utilities
│   │   └── supabase.js        # Supabase client
│   │
│   ├── pages/
│   │   ├── admin/              # NEW: Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ArtworksList.jsx
│   │   │   └── ArtworkForm.jsx
│   │   └── PublicSite.jsx
│   │
│   ├── data/                   # LEGACY: Static data (now from DB)
│   ├── App.jsx                 # Updated with routing
│   └── main.jsx
│
├── supabase-schema.sql         # NEW: Database schema
├── CMS_SETUP_GUIDE.md          # NEW: Setup instructions
├── .env.example                # NEW: Environment template
└── .gitignore                  # Updated

```

---

## 🔐 Admin Dashboard

### Access

**URL:** `https://yoursite.com/admin/login`

**Features:**
- Dashboard with stats
- Add/Edit/Delete artwork
- Upload images (drag & drop)
- Manage categories
- View commission inquiries
- Edit artist profile
- Update services

### Security

- ✅ Authentication required
- ✅ Row Level Security (RLS)
- ✅ Protected routes
- ✅ Secure file storage
- ✅ Environment variables

**Only authenticated admin users can:**
- Create, edit, delete content
- Upload files
- View draft content
- Access admin dashboard

**Public visitors can only:**
- View published artworks
- Submit commission forms

---

## 🎨 How It Works

### Content Flow:

```
Admin Dashboard
    ↓
Upload & Edit Artwork
    ↓
Save to Supabase Database
    ↓
Store Images in Supabase Storage
    ↓
Publish Status = "published"
    ↓
Public Website Queries Database
    ↓
Artwork Appears in Gallery
```

### No Rebuilds Required!

Unlike static sites, this portfolio is **fully dynamic**:

- Artist uploads artwork → Appears instantly on site
- No code changes needed
- No redeployment required
- Draft content stays private
- Published content goes live immediately

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The site will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
mr-jon-portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.jsx
│   │   ├── MobileMenu.jsx
│   │   ├── Hero.jsx
│   │   ├── Introduction.jsx
│   │   ├── SectionHeading.jsx
│   │   ├── ArtworkGallery.jsx
│   │   ├── ArtworkCard.jsx
│   │   ├── ProjectViewer.jsx
│   │   ├── AboutSection.jsx
│   │   ├── ProcessSection.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── CommissionSection.jsx
│   │   ├── CommissionForm.jsx
│   │   ├── SocialSection.jsx
│   │   ├── ContactSection.jsx
│   │   └── Footer.jsx
│   │
│   ├── data/               # Content data
│   │   ├── artworks.js     # Project gallery data
│   │   ├── services.js     # Services and process
│   │   └── artist.js       # Artist information
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useReducedMotion.js
│   │
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets (to be added)
├── dist/                   # Production build output
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies

```

## 🖼️ Content Integration

### Replace Placeholder Images

All artwork currently uses placeholder images from Unsplash. To add real artwork:

1. **Add images** to `public/images/` folder
2. **Update image paths** in `src/data/artworks.js`

Example:
```javascript
{
  id: "project-id",
  title: "Project Name",
  category: "murals",
  image: "/images/project-name.jpg",  // Update this path
  description: "Project description",
  // ...
}
```

### Update Project Information

Edit the following files:

- **`src/data/artworks.js`** - All gallery projects
- **`src/data/artist.js`** - Contact info and biography
- **`src/data/services.js`** - Service descriptions

### Categories Available

- `murals` - Mural projects
- `small-projects` - Small Projects (8 items)
- `major-projects` - Featured Projects (Ephrata, Amibara)
- `collaborations` - Collaborative Projects (12 items)
- `branding` - Logo & Branding

## 📧 Commission Form Integration

The commission form frontend is complete. To enable submissions:

### Option 1: Formspree (Recommended)

1. Sign up at https://formspree.io
2. Get your form endpoint
3. Update `src/components/CommissionForm.jsx`:

```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Option 2: Netlify Forms

If hosting on Netlify, add `data-netlify="true"` to the form element.

### Option 3: Custom Backend

Implement your own API endpoint and update the fetch URL.

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  charcoal: '#111111',
  'near-black': '#080808',
  'warm-white': '#F4F1EB',
  'muted-gray': '#A5A5A5',
}
```

### Typography

Update font imports in `index.html` and `tailwind.config.js`.

### Animations

Adjust timing and effects in individual components using Framer Motion props.

## 📱 Social Media Links

Current links (from client brief):

- **TikTok:** https://www.tiktok.com/@masterstvo24
- **Instagram:** https://www.instagram.com/mr_jon24/
- **Telegram:** https://t.me/MrJo240
- **Phone:** 0989990996

Update in `src/data/artist.js`

## ⚠️ Important Notes

### Email Address
The email address in the brief (`Yohannessheferaw024`) is incomplete. Please provide the full email address to update in:
- `src/data/artist.js`
- `src/components/ContactSection.jsx`

### Artist Portrait
Replace the placeholder portrait image in `AboutSection.jsx` with an actual photo of Mr. Jon.

### Project Assets
All current images are placeholders. Replace with actual project photos and videos for an authentic portfolio.

## 🚀 Deployment

### Deploy to Netlify

```bash
npm run build
# Deploy the dist/ folder to Netlify
```

Or connect your Git repository for automatic deployments.

### Deploy to Vercel

```bash
npm run build
# Deploy using Vercel CLI or connect repository
```

### Deploy to Any Static Host

Build the project and upload the `dist/` folder contents.

## 📊 Performance

- **Optimized images** with lazy loading
- **Code splitting** via Vite
- **Reduced motion** support for accessibility
- **GPU-accelerated** CSS transforms
- **Lightweight bundle** (~94KB gzipped JS)

## ♿ Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Visible focus states
- Alt text for images (to be added with real content)
- ARIA labels on interactive elements
- Reduced motion preference respected
- Color contrast compliance

## 🐛 Known Issues & TODOs

### High Priority
- [ ] Replace all placeholder images with actual artwork
- [ ] Add complete email address
- [ ] Replace artist portrait placeholder
- [ ] Integrate commission form backend
- [ ] Add real project descriptions

### Medium Priority
- [ ] Add actual process photos to ProcessSection
- [ ] Verify all project names and spellings with client
- [ ] Add project dates and locations if available
- [ ] Create custom favicon

### Low Priority
- [ ] Add video support for mural projects
- [ ] Implement custom cursor (optional)
- [ ] Add page transition animations
- [ ] Create a project detail page route (optional)

## 📄 License

This is a custom-designed website for Mr. Jon. All rights reserved.

## 👨‍🎨 Artist Information

**Mr. Jon** - Ethiopian Visual Artist

Specializing in:
- Large-scale murals
- Graffiti art
- Brand identity design
- Graphic design
- Digital illustration
- VR art creation (Meta Quest)

First artist in Ethiopia to leverage Meta Quest VR for large-scale mural projects.

## 🤝 Support

For technical support or questions about the website, refer to this README or the inline code comments.

For project inquiries, contact Mr. Jon directly:
- Phone: 0989990996
- Instagram: @mr_jon24
- TikTok: @masterstvo24
- Telegram: @MrJo240

---

**Built with passion for art and code.** ✨

Last Updated: January 2025
