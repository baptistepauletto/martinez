# 🎭 Fun Webcam Filters

A real-time webcam filter application that adds hilarious Snapchat-style filters to your face! Built with vanilla JavaScript, MediaPipe face detection, and designed to be hosted on GitHub Pages.

## ✨ Features

- **Real-time face detection** using Google's MediaPipe
- **8 fun filters** including:
  - 🕶️ Sunglasses
  - 👨 Mustache
  - 🐕 Dog Ears
  - 👑 Crown
  - 😍 Heart Eyes
  - 🌈 Rainbow
  - 🎉 Party Hat
  - 🚫 No Filter
- **Photo capture** with filters applied
- **Photo gallery** with download functionality
- **Camera flip** (front/back camera support)
- **Responsive design** that works on desktop and mobile
- **Modern UI** with smooth animations

## 🚀 Live Demo

Visit the live demo: [Your GitHub Pages URL will be here]

## 🛠️ Setup & Installation

### Option 1: GitHub Pages (Recommended)

1. **Fork this repository** or create a new repository
2. **Upload these files** to your repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your app**:
   - Your app will be available at: `https://yourusername.github.io/repository-name`
   - It may take a few minutes to deploy

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/webcam-filters.git
   cd webcam-filters
   ```

2. **Serve the files**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have live-server installed)
   npx live-server
   
   # Or simply open index.html in your browser (may have CORS issues)
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:8000`

## 📱 Usage

1. **Grant camera permissions** when prompted
2. **Click "Start Camera"** to begin
3. **Select a filter** from the grid
4. **Take photos** using the capture button
5. **Download photos** from the gallery
6. **Flip camera** to switch between front/back cameras

## 🔧 Technical Details

### Technologies Used

- **HTML5 Canvas** for real-time video processing
- **WebRTC** for camera access
- **MediaPipe Face Mesh** for accurate face detection
- **Vanilla JavaScript** (no frameworks required)
- **CSS3** with modern features and animations

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance

- Optimized for 30 FPS real-time processing
- Lightweight face detection model
- Efficient canvas rendering
- Memory management for photo storage

## 🎨 Customization

### Adding New Filters

To add a new filter, follow these steps:

1. **Add filter button** in `index.html`:
   ```html
   <button class="filter-btn" data-filter="your-filter">
       <span class="filter-icon">🎭</span>
       <span class="filter-name">Your Filter</span>
   </button>
   ```

2. **Add filter case** in `script.js`:
   ```javascript
   case 'your-filter':
       this.drawYourFilter(landmarks);
       break;
   ```

3. **Implement filter function**:
   ```javascript
   drawYourFilter(landmarks) {
       // Your filter drawing code here
       // Use this.getLandmarkPoint(landmarks, index) to get face points
   }
   ```

### Face Landmark Points

Key landmark indices for filter positioning:
- Eyes: 33 (left), 263 (right)
- Nose: 1 (tip), 2 (bridge)
- Mouth: 13 (center)
- Forehead: 10
- Temples: 127 (left), 356 (right)

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you're accessing via HTTPS (required for camera access)
- Check browser permissions for camera access
- Try refreshing the page
- Test with a different browser

### Face Detection Issues
- Ensure good lighting
- Face the camera directly
- Remove glasses or hats that might obstruct face detection
- Check if MediaPipe scripts are loading properly

### Performance Issues
- Close other tabs using camera
- Ensure stable internet connection for CDN resources
- Try reducing video quality in browser settings

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Keep the code vanilla JavaScript (no frameworks)
2. Maintain responsive design
3. Test on multiple browsers
4. Follow existing code style
5. Add comments for complex filter algorithms

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for face detection
- [Google Fonts](https://fonts.google.com/) for typography
- Inspired by Snapchat and Instagram filters

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Make sure you're using a supported browser

---

**Made with ❤️ for fun! Share your filtered selfies!** 🎉 