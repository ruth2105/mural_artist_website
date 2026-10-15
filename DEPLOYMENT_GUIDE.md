# 🚀 How to Host Mr. Jon's Portfolio

Complete guide to deploy your portfolio to the internet (with free options!)

---

## 🎯 Prerequisites

Before deploying, you need:
- ✅ Supabase project set up (follow `CMS_SETUP_GUIDE.md`)
- ✅ Real environment variables in `.env`
- ✅ Local site tested and working
- ✅ GitHub account (free)

---

## 📋 Deployment Options

### Option 1: Netlify (Recommended - Easiest)
- ✅ **FREE** tier available
- ✅ Automatic builds from GitHub
- ✅ Custom domain support
- ✅ Easy environment variables setup
- ✅ Instant deployment

### Option 2: Vercel (Great for React)
- ✅ **FREE** tier available
- ✅ Optimized for React/Vite
- ✅ Excellent performance
- ✅ Custom domain support

### Option 3: GitHub Pages (Free but Limited)
- ✅ Completely **FREE**
- ⚠️ Requires extra configuration for routing
- ⚠️ No server-side features

---

## 🚀 Method 1: Deploy to Netlify (RECOMMENDED)

### Step 1: Push Code to GitHub

#### 1.1 Create GitHub Repository
1. Go to https://github.com
2. Click **"New repository"** (green button)
3. Name it: `mr-jon-portfolio`
4. Set to **Public** or **Private**
5. Click **"Create repository"**

#### 1.2 Push Your Code
Open PowerShell in your project folder:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Mr. Jon Portfolio"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mr-jon-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Don't worry about `.env` - it's already in `.gitignore` (won't be uploaded)

---

### Step 2: Deploy to Netlify

#### 2.1 Sign Up for Netlify
1. Go to https://www.netlify.com
2. Click **"Sign up"**
3. Sign up with GitHub (easiest option)
4. Authorize Netlify to access your repositories

#### 2.2 Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"GitHub"**
3. Find and select `mr-jon-portfolio` repository
4. Configure build settings:

```
Build command:     npm run build
Publish directory: dist
```

5. Click **"Deploy site"**

#### 2.3 Add Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add these variables:

```
Key: VITE_SUPABASE_URL
Value: https://your-project.supabase.co

Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
```

4. Click **"Save"**

#### 2.4 Redeploy
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 2-3 minutes
4. Your site is live! 🎉

#### 2.5 Custom Domain (Optional)
1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `mrjon.art`)
4. Follow instructions to configure DNS

**Default URL:** Your site gets a free URL like: `your-site-name.netlify.app`

---

## 🚀 Method 2: Deploy to Vercel

### Step 1: Push to GitHub
(Same as Netlify Step 1 above)

### Step 2: Deploy to Vercel

#### 2.1 Sign Up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub
4. Authorize Vercel

#### 2.2 Import Project
1. Click **"Add New"** → **"Project"**
2. Select `mr-jon-portfolio` repository
3. Configure:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

4. Click **"Deploy"**

#### 2.3 Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1... (your key)
```

3. Click **"Save"**
4. Go to **Deployments** → Click **"Redeploy"**

**Default URL:** `mr-jon-portfolio.vercel.app`

---

## 🚀 Method 3: GitHub Pages

### Step 1: Update vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mr-jon-portfolio/', // Add this line (your repo name)
});
```

### Step 2: Install gh-pages

```powershell
npm install --save-dev gh-pages
```

### Step 3: Update package.json

Add these scripts:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Deploy

```powershell
npm run deploy
```

### Step 5: Enable GitHub Pages
1. Go to your GitHub repo
2. **Settings** → **Pages**
3. Source: **gh-pages** branch
4. Click **"Save"**

**URL:** `https://YOUR_USERNAME.github.io/mr-jon-portfolio/`

**⚠️ Note:** GitHub Pages requires extra router configuration for proper navigation.

---

## 🔐 Security Checklist

Before deploying:

### ✅ Environment Variables
- [ ] `.env` is in `.gitignore` (already done)
- [ ] Never commit real Supabase keys to GitHub
- [ ] Add environment variables in hosting platform (not in code)

### ✅ Supabase Setup
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Storage bucket has proper permissions
- [ ] Admin user created in Authentication

### ✅ Testing
- [ ] Test public site works
- [ ] Test admin login works
- [ ] Test image upload works
- [ ] Test artwork creation works

---

## 📊 After Deployment

### 1. Test Live Site

**Public Site:**
```
https://your-site.netlify.app
```
- ✅ All sections load
- ✅ Gallery shows artworks
- ✅ Contact form works
- ✅ Mobile responsive

**Admin Dashboard:**
```
https://your-site.netlify.app/admin/login
```
- ✅ Login works
- ✅ Dashboard loads
- ✅ Image upload works
- ✅ Artworks save to database

### 2. Upload Real Content
1. Login to admin
2. Delete sample artworks
3. Upload Mr. Jon's real artwork
4. Update artist profile
5. Add real services

### 3. Train Mr. Jon
1. Share admin login credentials
2. Give him `FOR_MR_JON_HOW_TO_ADD_ARTWORK.md`
3. Walk through first upload together
4. Show how to manage inquiries

---

## 🔄 Continuous Deployment

After initial setup, future updates are automatic:

### On Netlify/Vercel:
1. Make changes locally
2. Commit: `git add . && git commit -m "Update"`
3. Push: `git push`
4. **Automatic deployment!** (2-3 minutes)

Your site rebuilds automatically every time you push to GitHub!

---

## 🌐 Custom Domain Setup

### Buy a Domain (Optional)
Popular registrars:
- Namecheap: ~$10-15/year
- Google Domains: ~$12-15/year
- Cloudflare: ~$8-10/year

### Connect to Netlify
1. **Netlify Dashboard** → **Domain settings**
2. Click **"Add custom domain"**
3. Enter domain: `mrjon.art`
4. Go to your domain registrar
5. Add Netlify DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

6. Wait 24-48 hours for DNS propagation
7. Netlify automatically provisions SSL certificate

---

## 🛠️ Troubleshooting

### Build Fails
**Error:** `npm install` fails
**Solution:**
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json

# Reinstall
npm install

# Try build locally first
npm run build

# If works, commit and push
git add .
git commit -m "Fix build"
git push
```

### Environment Variables Not Working
**Error:** Demo mode still active
**Solution:**
1. Check variables in hosting dashboard
2. Variable names must match exactly: `VITE_SUPABASE_URL`
3. Redeploy after adding variables

### Routing Issues (404 on refresh)
**For Netlify:** Create `public/_redirects` file:
```
/*    /index.html   200
```

**For Vercel:** Create `vercel.json` in project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Images Not Loading
**Solution:**
1. Check Supabase storage bucket is **public**
2. Verify RLS policies allow public read
3. Test image URL directly in browser

---

## 💰 Costs

### Free Forever:
- ✅ Netlify (100GB bandwidth/month)
- ✅ Vercel (100GB bandwidth/month)
- ✅ GitHub Pages (1GB storage)
- ✅ Supabase (500MB database, 1GB storage, 2GB bandwidth)

### Paid (If Needed):
- Netlify Pro: $19/month (more bandwidth)
- Vercel Pro: $20/month (more features)
- Supabase Pro: $25/month (more storage)
- Custom domain: $10-15/year

**For Mr. Jon's portfolio: Free tier is more than enough!**

---

## ✅ Quick Deployment Checklist

### Before Deployment:
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage bucket created (`artwork`, public)
- [ ] Admin user created
- [ ] `.env` updated with real credentials
- [ ] Local site tested
- [ ] GitHub repo created
- [ ] Code pushed to GitHub

### Deployment:
- [ ] Signed up for Netlify/Vercel
- [ ] Imported GitHub repository
- [ ] Added environment variables
- [ ] Triggered deployment
- [ ] Site is live!

### Post-Deployment:
- [ ] Tested public site
- [ ] Tested admin login
- [ ] Tested image upload
- [ ] Tested artwork creation
- [ ] Deleted sample data
- [ ] Uploaded real content
- [ ] Shared credentials with Mr. Jon

---

## 🎯 Recommended Flow

**Today:**
1. ✅ Set up Supabase (30 min) - `CMS_SETUP_GUIDE.md`
2. ✅ Test locally with real database
3. ✅ Push to GitHub

**Tomorrow:**
1. ✅ Deploy to Netlify (15 min)
2. ✅ Test live site
3. ✅ Upload real artwork

**Next Week:**
1. ✅ Train Mr. Jon
2. ✅ Go live!
3. 🎉 Share portfolio link

---

## 📞 Support Resources

### Netlify:
- Docs: https://docs.netlify.com
- Support: https://answers.netlify.com

### Vercel:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### Supabase:
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

---

## 🎉 Summary

**Easiest Path:**
1. Push to GitHub (5 min)
2. Deploy to Netlify (10 min)
3. Add environment variables (2 min)
4. Done! ✅

**Total time:** ~20 minutes

**Your site will be live at:** `https://mr-jon-portfolio.netlify.app`

---

**Ready to deploy? Start with pushing to GitHub, then choose Netlify for the simplest deployment!** 🚀
