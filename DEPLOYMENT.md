# 🚀 Deployment Guide for GitHub Pages

This guide will help you deploy your Fun Webcam Filters project to GitHub Pages in just a few minutes!

## 📋 Prerequisites

- A GitHub account
- Basic knowledge of Git (optional, can use GitHub web interface)

## 🎯 Quick Deployment (5 minutes)

### Method 1: Using GitHub Web Interface (Easiest)

1. **Create a new repository**:
   - Go to [GitHub](https://github.com) and click "New repository"
   - Name it something like `webcam-filters` or `fun-filters`
   - Make it public (required for free GitHub Pages)
   - Initialize with README (optional)

2. **Upload files**:
   - Click "uploading an existing file" or drag and drop
   - Upload all these files:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `manifest.json`
     - `README.md`
     - `.github/workflows/deploy.yml` (create the folders if needed)

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: "main" (or "master")
   - Folder: "/ (root)"
   - Click "Save"

4. **Access your app**:
   - Your app will be live at: `https://yourusername.github.io/repository-name`
   - It may take 5-10 minutes for the first deployment

### Method 2: Using Git Command Line

1. **Clone and setup**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   
   # Copy all the project files to this directory
   # Then commit and push
   git add .
   git commit -m "Add webcam filters app"
   git push origin main
   ```

2. **Enable Pages** (same as Method 1, step 3)

## 🔧 Advanced Configuration

### Custom Domain (Optional)

1. **Add CNAME file**:
   ```bash
   echo "your-domain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**:
   - Add CNAME record pointing to `yourusername.github.io`

### Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically deploy your app whenever you push changes to the main branch.

## 🐛 Troubleshooting

### Common Issues

1. **404 Error**:
   - Check that `index.html` is in the root directory
   - Ensure GitHub Pages is enabled
   - Wait a few minutes for deployment

2. **Camera not working**:
   - GitHub Pages serves over HTTPS automatically (required for camera)
   - Check browser permissions

3. **Filters not loading**:
   - Check browser console for errors
   - Ensure MediaPipe CDN links are working
   - Try hard refresh (Ctrl+F5)

### Performance Tips

1. **Optimize for mobile**:
   - Test on different devices
   - Consider reducing video resolution for slower devices

2. **CDN reliability**:
   - MediaPipe is loaded from CDN
   - Consider hosting locally for production use

## 📱 Making it Installable (PWA)

Your app is already configured as a Progressive Web App! Users can:

1. **On mobile**: Tap "Add to Home Screen" in browser menu
2. **On desktop**: Look for install icon in address bar
3. **Chrome**: Three dots menu → "Install Fun Webcam Filters"

## 🔄 Updating Your App

1. **Make changes** to your files
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update filters"
   git push
   ```
3. **Automatic deployment** will happen via GitHub Actions
4. **Changes live** in 2-5 minutes

## 📊 Analytics (Optional)

Add Google Analytics to track usage:

1. **Get tracking ID** from Google Analytics
2. **Add to `index.html`** before closing `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

## 🎉 You're Done!

Your webcam filters app should now be live and accessible to anyone with the URL. Share it with friends and have fun!

### Next Steps

- Customize the filters
- Add more filter types
- Improve the UI
- Add social sharing features
- Consider monetization options

---

**Need help?** Open an issue in the repository or check the main README.md for troubleshooting tips. 