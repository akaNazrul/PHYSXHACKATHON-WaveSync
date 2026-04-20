# 🌊 WaveSync
---

## 📋 Overview

**WaveSync** is a real-time wave interference simulator that brings the superposition principle of physics to life. Built for the National PhysXHackathon 2026, WaveSync visualizes complex wave interactions with stunning precision and interactivity. Watch as two coherent wave sources interfere, creating vivid interference patterns in real-time—perfect for physics education, exploration, and curiosity.

**[🚀 Launch Live App](https://akanazrul.github.io/PHYSXHACKATHON-WaveSync/)**

---

## ✨ Core Features

### 🎨 **Real-Time Visualization**
- **60 FPS Heatmap Rendering**: Compute interference patterns across 400×400 cells dynamically
- **Color-Mapped Intensity**: Intuitive visualization of constructive (bright) and destructive (dark) interference zones
- **Smooth Animation**: Canvas-based rendering optimized for performance

### 🎛️ **Interactive Controls**
- **Wavelength Adjustment**: Tune frequency to see cascading pattern changes
- **Amplitude Control**: Adjust wave intensity for both sources independently
- **Phase Offset**: Shift the phase relationship to explore interference variations
- **Drag-to-Position**: Click and drag wave sources directly on the canvas
- **Touch Support**: Full mobile gesture support for all interactions

### 📚 **Pre-Configured Scenarios**
- **Acoustic Noise Cancellation**: Destructive interference demonstrating phase cancellation
- **Wi-Fi Array Beamforming**: Constructive interference with spatial alignment
- **Young's Double-Slit Experiment**: Classic physics demo with interference fringes

### 📤 **Export & Share**
- **One-Click PNG Export**: Snapshot your interference patterns instantly
- **Shareable Results**: Perfect for reports, presentations, or social media

### 📐 **Educational Overlay**
- **Live Physics Equations**: See the math equations used to compute each frame
- **Direct Variable Mapping**: Watch how wavelength, amplitude, and phase directly affect the visual output

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Language** | ES2022 JavaScript |
| **Rendering** | HTML5 Canvas |
| **Styling** | CSS3 with CSS Variables |
| **Architecture** | Vanilla JS Modules (Zero Dependencies) |
| **Deployment** | GitHub Pages with GitHub Actions |
| **Physics** | Direct wave equation computation |

**Why Vanilla JS?** Zero bloat, instant load times, and pure physics computation without the overhead of frameworks.

---

## 📁 Project Structure

```
PHYSXHACKATHON-WaveSync/
├── index.html                    # Main entry point (HTML structure)
├── README.md                     # This file
├── wavesync-prd.html            # Product requirements document
│
├── src/                          # Core JavaScript modules
│   ├── main.js                  # Application bootstrap & event loop
│   ├── physics.js               # Wave equations & interference math
│   ├── renderer.js              # Canvas rendering engine
│   ├── controls.js              # UI interaction handlers
│   ├── state.js                 # Application state management
│   ├── presets.js               # Pre-configured scenarios
│   └── exporter.js              # PNG export functionality
│
├── styles/                       # CSS styling
│   ├── main.css                 # Core layout & components
│   └── variables.css            # Theme & design tokens
│
└── .github/
    └── workflows/
        └── deploy.yml            # GitHub Pages auto-deployment
```

**Key Modules:**

| File | Purpose |
|------|---------|
| `main.js` | Initialize app, manage `requestAnimationFrame` loop, coordinate modules |
| `physics.js` | Core wave equation math: $y = A \sin(kx - \omega t + \phi)$ for dual sources |
| `renderer.js` | Compute heatmap, draw canvas, handle color mapping |
| `controls.js` | Handle slider inputs, mouse/touch events, UI responses |
| `state.js` | Centralized state store for wavelength, amplitude, phase, positions |
| `presets.js` | Pre-defined scenario configurations |
| `exporter.js` | Canvas-to-PNG download functionality |

---

## 🚀 Local Setup & Development

### Prerequisites
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Text Editor** (VS Code recommended)
- **Optional**: Node.js for local server (not required)

### Option 1: Direct Execution (Fastest)
1. **Clone the repository**
   ```bash
   git clone https://github.com/akanazrul/PHYSXHACKATHON-WaveSync.git
   cd PHYSXHACKATHON-WaveSync
   ```

2. **Open in Browser**
   - Double-click `index.html` directly, OR
   - Drag `index.html` into your browser window

3. **Start experimenting!**
   - Adjust controls to see wave interference
   - Load presets for demonstrations
   - Export snapshots

### Option 2: Local Server (Recommended for Development)
For better development experience with live reload:

```bash
# Using Node.js (if installed)
npx serve .
# Then open http://localhost:3000
```

Or use any Python-based server:
```bash
# Python 3
python -m http.server 8000
# Open http://localhost:8000
```

### Option 3: VS Code Live Server
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"
- Browser auto-refreshes on file changes

---

## 🎓 How It Works

### Physics Engine
WaveSync computes real-time interference using the **superposition principle**:

For two coherent wave sources with equal frequency:

$$y_{total}(x,t) = A_1 \sin(kx - \omega t + \phi_1) + A_2 \sin(kx - \omega t + \phi_2)$$

Where:
- $A$ = Amplitude (wave height)
- $k$ = Wave number (related to wavelength)
- $\omega$ = Angular frequency
- $\phi$ = Phase offset
- Interference intensity: $I = |A_1 + A_2|^2$ (constructive at peaks, destructive at troughs)

### Rendering Pipeline
1. **Input**: Wavelength, amplitudes, phase, source positions
2. **Compute**: Wave values at each (x, y) cell
3. **Map**: Intensity values → color gradient (dark = destructive, bright = constructive)
4. **Render**: Draw heatmap to canvas at 60 FPS
5. **Display**: Update physics equations on overlay

---

## 📱 Browser Compatibility

| Browser | Support | Min Version |
|---------|---------|------------|
| Chrome/Chromium | ✅ Full | 90+ |
| Firefox | ✅ Full | 88+ |
| Safari | ✅ Full | 14+ |
| Edge | ✅ Full | 90+ |
| Mobile (iOS/Android) | ✅ Full | Native browsers |

---

## 🏠 Offline-First

WaveSync is fully functional offline:
- ✅ No internet required after first load
- ✅ No backend server needed
- ✅ All computation happens in-browser
- ✅ Perfect for classrooms, labs, or anywhere

---

## 📝 License & Attribution

Built for the **National PhysXHackathon 2026**

---

## 🎯 Quick Tips

- **Explore Presets**: Click scenario buttons to instantly see different interference patterns
- **Fine-Tune**: Use sliders for precise wavelength and amplitude control
- **Drag Sources**: Click and drag the wave source origins to reposition them
- **Export Work**: Capture interesting patterns as PNG images
- **Learn Physics**: Read the equation overlay to connect math to visualization

---

**Enjoy exploring the beautiful physics of wave interference! 🌊**