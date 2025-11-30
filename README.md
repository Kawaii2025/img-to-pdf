# Image to PDF Tool - Component-Based Architecture

## 📁 Project Structure

```
project/
├── index.html                      # Main HTML file
├── css/
│   └── styles.css                  # All styling
├── js/
│   ├── components/                 # Component modules
│   │   ├── UploadArea.js           # Upload area component
│   │   ├── PreviewItem.js          # Individual preview item
│   │   ├── PreviewContainer.js     # Preview grid container
│   │   ├── ProgressBar.js          # Progress tracking
│   │   ├── PreviewModal.js         # Full-screen preview modal
│   │   ├── ControlPanel.js         # Control buttons
│   │   └── LoadingIndicator.js     # Loading spinner
│   └── app.js                      # Main application orchestrator
└── README.md                       # This file
```

## 🚀 Quick Start

### 1. Create the Directory Structure
```bash
mkdir -p project/css project/js/components
cd project
```

### 2. Create Files
Copy each file from the provided components to the appropriate location:

- `index.html` → project root
- `styles.css` → `css/` folder
- All component JS files → `js/components/` folder
- `app.js` → `js/` folder

### 3. Run the Application
Simply open `index.html` in your web browser:
```bash
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

Or use a local server (recommended):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

Then visit: `http://localhost:8000`

## 📚 Component Overview

### UploadArea.js
Manages file upload and drag-drop functionality
- Handles click-to-upload
- Drag-and-drop file handling
- Visual feedback for interaction states

### PreviewItem.js
Represents a single image preview
- Displays thumbnail with order number
- Remove button
- Click-to-preview functionality
- Drag support for reordering

### PreviewContainer.js
Grid container for all previews
- Manages all preview items
- Handles drag-to-reorder logic
- Updates item indices
- Batch refresh operations

### ProgressBar.js
Progress tracking display
- Shows processing percentage
- Current/total count
- Show/hide functionality

### PreviewModal.js
Full-screen image preview
- Large image display
- File information
- Keyboard (ESC) and click-to-close
- Processing state management

### ControlPanel.js
Convert and Clear buttons
- PDF generation trigger
- Clear all images trigger
- Disable/enable button states

### LoadingIndicator.js
Processing spinner display
- Show during PDF generation
- Loading message

### app.js
Main application orchestrator
- Initializes all components
- Handles file compression
- Coordinates component interactions
- PDF generation logic
- File download handling

## 🔧 How Components Work Together

```
User Action
    ↓
UploadArea → Triggers app.handleFilesDrop()
    ↓
app.compressImage() → Adds to imageFiles array
    ↓
PreviewContainer.addItem() → Creates PreviewItem
    ↓
User drags image → PreviewContainer.reorderImages()
    ↓
app.reorderImages() → Updates imageFiles array
    ↓
User clicks "Generate PDF" → app.convertToPdf()
    ↓
PDF created & downloaded
```

## 💡 Key Features

✅ Modular component structure
✅ Easy to extend or modify individual components
✅ Clear separation of concerns
✅ Reusable components
✅ External CSS for easier styling
✅ Well-organized file structure

## 🎨 Customization

### Change Button Colors
Edit `css/styles.css`:
```css
#convert-btn {
    background-color: #YourColor;
}
```

### Modify Component Behavior
Each component is self-contained. Modify the component file directly:
```javascript
// Example: Change progress bar text in ProgressBar.js
this.text.textContent = `Your Custom Text: ${current}/${total}`;
```

### Add New Components
1. Create new file: `js/components/YourComponent.js`
2. Define your component class
3. Import in `index.html`
4. Initialize in `app.js`

## 📝 File Sizes and Load Time

- Total JS: ~25KB (before minification)
- Total CSS: ~8KB
- External libraries: ~100KB (pdf-lib + image-compression)
- Page load: < 2 seconds on average connection

## 🐛 Debugging

Enable console logging by modifying components:

```javascript
// In app.js
async handleFilesDrop(files) {
    console.log('Files received:', files);
    // ... rest of code
}
```

Check browser console for detailed error messages during PDF generation.

## 📦 Build/Minification

To optimize for production:

1. Minify CSS:
```bash
npx cssnano css/styles.css -o css/styles.min.css
```

2. Minify JS:
```bash
npx terser js/components/*.js -o js/components.min.js
```

3. Update `index.html` to use minified files

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Feel free to use and modify for your own projects.

## 🤝 Contributing

To extend functionality:
1. Create new components following the same pattern
2. Ensure each component has clear methods
3. Follow the naming conventions
4. Add proper event handling

---

**Happy coding!** 🎉
