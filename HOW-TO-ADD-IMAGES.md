# How to Replace Animated Elements with Your Own PNG Images

This guide explains how to replace the generative particles and patterns with your own custom PNG images.

## 📁 Step 1: Prepare Your Images

### Create an Images Folder
```
the-sunday-creatives/
├── images/
│   ├── particle1.png
│   ├── particle2.png
│   ├── particle3.png
│   ├── pattern1.png
│   ├── pattern2.png
│   └── pattern3.png
├── index.html
├── styles.css
└── script.js
```

### Image Recommendations

**For Particles (small floating elements):**
- **Size**: 100x100px to 200x200px
- **Format**: PNG with transparency
- **Style**: Icons, logos, symbols, small graphics
- **Examples**: Stars, sparkles, brand elements, abstract shapes

**For Background Patterns (large floating shapes):**
- **Size**: 200x200px to 500x500px
- **Format**: PNG with transparency
- **Style**: Larger graphics, abstract shapes, decorative elements
- **Examples**: Geometric patterns, textures, brand imagery

## 🔧 Step 2: Update script.js

Open `script.js` and find these lines (around line 169):

```javascript
// TO USE YOUR OWN IMAGES: Add image paths to these arrays
const particleImagePaths = [
    // 'images/particle1.png',
    // 'images/particle2.png',
    // 'images/particle3.png',
];

const patternImagePaths = [
    // 'images/pattern1.png',
    // 'images/pattern2.png',
    // 'images/pattern3.png',
];
```

**Uncomment and add your image paths:**

```javascript
const particleImagePaths = [
    'images/particle1.png',
    'images/particle2.png',
    'images/particle3.png',
    'images/my-logo.png',
    'images/star.png',
];

const patternImagePaths = [
    'images/pattern1.png',
    'images/pattern2.png',
    'images/abstract-shape.png',
];
```

## 🎨 Step 3: Customize Behavior

### Adjust Particle Size
In the `Particle` class constructor (line ~8):
```javascript
this.size = Math.random() * 40 + 20; // Change these numbers
// First number (40) = size range
// Second number (20) = minimum size
```

### Adjust Pattern Size
In the `GenerativePattern` class `initShapes` method (line ~115):
```javascript
size: Math.random() * 150 + 75,
// First number (150) = size range
// Second number (75) = minimum size
```

### Adjust Number of Elements

**Particles:**
```javascript
const maxParticles = 150; // Change this number
```

**Background Patterns:**
In `GenerativePattern` class:
```javascript
const numShapes = 15; // Change this number
```

### Adjust Movement Speed

**Particles:**
```javascript
this.vx = (Math.random() - 0.5) * 2; // Horizontal speed
this.vy = (Math.random() - 0.5) * 2; // Vertical speed
// Higher numbers = faster movement
```

**Patterns:**
```javascript
speedX: (Math.random() - 0.5) * 0.5, // Horizontal speed
speedY: (Math.random() - 0.5) * 0.5, // Vertical speed
// Higher numbers = faster movement
```

### Adjust Opacity

**Particles:**
```javascript
this.life = 1; // Starting opacity (0-1)
this.decay = Math.random() * 0.01 + 0.005; // How fast they fade
```

**Patterns:**
```javascript
opacity: Math.random() * 0.3 + 0.1, // Opacity range
// First number (0.3) = opacity range
// Second number (0.1) = minimum opacity
```

## 🎯 Quick Examples

### Example 1: Brand Logo Particles
```javascript
// Use your logo as floating particles
const particleImagePaths = [
    'images/logo-white.png',
    'images/logo-color.png',
];
```

### Example 2: Mix Images and Shapes
```javascript
// Leave one array empty to keep geometric shapes
const particleImagePaths = [
    'images/star.png',
    'images/sparkle.png',
];

const patternImagePaths = [
    // Empty = will use geometric shapes
];
```

### Example 3: Single Image Repeated
```javascript
// Use the same image multiple times
const particleImagePaths = [
    'images/icon.png',
];
```

## 🐛 Troubleshooting

### Images Not Showing?
1. **Check file paths**: Make sure the path is correct relative to `index.html`
2. **Check file names**: Paths are case-sensitive on some systems
3. **Check browser console**: Press F12 and look for errors
4. **Check image format**: Must be PNG, JPG, or GIF

### Images Too Big/Small?
Adjust the `size` property in the class constructors (see Step 3 above)

### Too Many/Few Elements?
Adjust `maxParticles` and `numShapes` (see Step 3 above)

### Performance Issues?
- Reduce `maxParticles` number
- Reduce `numShapes` number
- Use smaller image file sizes
- Optimize your PNG files (compress them)

## 🎨 Design Tips

1. **Use transparent PNGs** for best results
2. **Keep file sizes small** (under 50KB each) for performance
3. **Use white or colored elements** - they'll show well against the dark background
4. **Mix different sizes** for visual variety
5. **Test with different opacity values** to find what looks best

## 📝 Notes

- The system will automatically fall back to geometric shapes if images fail to load
- Images are randomly selected from the arrays you provide
- Each element (particle/pattern) picks a random image on creation
- Images are preloaded before animation starts for smooth performance

## 🚀 After Making Changes

1. Save `script.js`
2. Refresh your browser (Ctrl+R or Cmd+R)
3. Check browser console for any errors (F12)
4. Adjust settings as needed

---

Need more help? Check the comments in `script.js` for additional customization options!
