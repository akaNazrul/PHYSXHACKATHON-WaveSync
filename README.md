# WaveSync

**Real-Time Wave Interference Simulator**

Built for the National PhysXHackathon 2026. WaveSync visualizes the superposition principle of waves instantly using pure ES2022 JavaScript and HTML Canvas.

## Features
- **Live 60fps Heatmap**: Maps $O(n^2)$ interference across 400x400 cells dynamically.
- **Dual Constraints**: Total control of wavelength (frequency), amplitude, and phase offset.
- **Direct Interaction**: Pointer and touch drag logic allows instantly moving spatial origins.
- **Physics Equations**: Direct variable substitution overlay linking maths to visual response.
- **Scenarios**: Presets for Acoustic Noise Cancellation, Wi-Fi Array Beamforming, and Young's double-slit experiment.
- **Static Exporter**: 1-click snapshot to PNG artifact.

## Local Execution
Zero build tools, zero dependencies.
Simply double-click `index.html` locally or serve with:
\`\`\`bash
npx serve .
\`\`\`

## Architecture
- Vanilla JS Modules
- No state management libraries or UI packages
- Isolated `requestAnimationFrame` loop isolating rendering layers from math calculations.

## Deployment
Automatically deployed to GitHub Pages via Actions. No backend databases required. Fully functional offline.