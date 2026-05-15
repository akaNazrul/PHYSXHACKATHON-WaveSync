# 🌊 WaveSync
---

## 🎯 Mission Statement
**WaveSync helps students, educators, and engineers develop intuition for wave interference — the physics behind Wi-Fi, noise cancellation, and medical ultrasound.**

---

## 📋 Overview

**WaveSync** is a real-time wave interference simulator that brings the superposition principle of physics to life. Built for the National PhysXHackathon 2026, WaveSync visualizes complex wave interactions with stunning precision and interactivity. Watch as two coherent wave sources interfere, creating vivid interference patterns in real-time that perfect for physics education, exploration, and curiosity.

**[🚀 Launch Live App](https://akanazrul.github.io/PHYSXHACKATHON-WaveSync/)**

---

## 🔬 Scientific Validation & Performance
- **Live Numerical Validation:** Real-time calculation of analytical expected values. Compares simulated fringe spacing in the Young's preset ($y = \lambda L / d$) and phase differences to textbook formulas.
- **60 FPS Rendering:** Highly optimized Javascript loops over 160,000 spatial pixels every 16ms guaranteeing 60 fps limit natively in browser.

## ⚠️ Assumptions & Limitations
To run natively in the browser without massive overhead:
- **2D Slice:** The model computes in a flat 2D topological plane (real waves expand spherically in 3D).
- **Ideal Medium:** Assumes an ideal medium devoid of resistance or boundary absorption.
- **Simplified Diffraction:** Young's preset includes a finite-slit diffraction approximation; reflections and full boundary diffraction are simplified.

---
***
Updated README describing the current physics implementation, renderer behavior, and available presets. Includes links to code references and developer notes.
***

# 🌊 WaveSync — Wave Interference Explorer

**WaveSync** is a compact, zero-dependency browser app that simulates real-time 2D wave interference. It is designed for teaching and experimentation: change wavelengths, amplitudes, phases, and slit geometry, then observe the resulting interference heatmap.

## What’s new in this repo
- Documentation updated to reflect the current implementation in `src/physics.js`, `src/renderer.js`, and `src/presets.js`.
- The renderer uses a fixed simulation grid (400×400) and an amplitude-normalized color mapping for visual clarity.

## Quick Links
- Live demo: https://akanazrul.github.io/PHYSXHACKATHON-WaveSync/
- Source: the core logic is in [src/physics.js](src/physics.js#L15-L18) and the renderer in [src/renderer.js](src/renderer.js#L1-L4).

---

## Physics & Equations

WaveSync implements the superposition of scalar waves. The code computes the instantaneous scalar field at each point using the familiar form:

$$
\\Psi(\\mathbf{r},t) = \\sum_{i} A_i \\sin\\big(k r_i - \\omega t + \\phi_i\\big)
$$

Definitions used in code:
- Wavelength: $\\lambda = v / f$ (where `SPEED_OF_WAVE` is the model speed and `f` is `source.frequency`). See [src/physics.js](src/physics.js#L33-L36).
- Wave number: $k = 2\\pi / \\lambda$.
- Angular frequency: $\\omega = 2\\pi f$.
- Phase: code converts degrees to radians via `phi = (phase * Math.PI) / 180`.

Diffraction (Young's finite slit approximation): a sinc envelope is applied to model single-slit diffraction when the active preset uses a slit. The helper `sinc()` and the envelope construction live in [src/physics.js](src/physics.js#L8-L11) and the slit-envelope code is in [src/physics.js](src/physics.js#L45-L51).

Attenuation: Wave contributions include an empirical distance fade `distanceFade = 50 / (r + 50)` so that distant contributions visually diminish. The per-source contribution is computed as:

$$
\\psi_i = A_i \\cdot D(r_i) \\cdot E_{\\text{diffraction}}(\\theta_i) \\cdot \\sin(k r_i - \\omega t + \\phi_i)
$$

where the code assembles the total field as `sum(psi_i)`. See implementation in [src/physics.js](src/physics.js#L52-L59).

Note on intensity vs amplitude: the renderer normalizes the summed amplitude for color mapping (see [src/renderer.js](src/renderer.js#L64-L67)). Physically, intensity is proportional to $|\\Psi|^2$; this app uses normalized amplitude for visual contrast and education. If you prefer a strict intensity visualization, switch the mapping to use squared amplitude in the renderer (developer note below).

---

## Presets (what’s available)

- **Young’s Double-Slit** — two coherent sources arranged as a slit pair with a diffraction envelope. (See `applyYoungsSlit` in [src/presets.js](src/presets.js#L40-L46)).
  - Typical parameters in code: `frequency: 4.0`, `amplitude: 1.0`, `phase: 0`, `slitWidth`, and `slitSeparation` from `state` (see [src/state.js](src/state.js#L1-L18)).

- **Noise Cancellation (Destructive Interference)** — two equal-amplitude sources with 180° phase difference to produce cancellation (see `applyNoiseCancellation` in [src/presets.js](src/presets.js#L51-L54)).

Note: The README and design notes historically referenced a "Wi‑Fi Array / phased-array" demo; that idea is described in [idea-refine.md](idea-refine.md#L960-L967) and [TODO.md](TODO.md#L1-L4) but is not currently wired as an active preset in [src/presets.js](src/presets.js#L1-L8).

---

## Rendering & Performance

- Canvas internal resolution: 400 × 400 pixels (see [src/renderer.js](src/renderer.js#L1-L4)).
- Rendering loop: `requestAnimationFrame` drives the paint loop; simulation time is advanced by a small step per frame (`state.time += 0.05`) for deterministic visual motion (see time-stepping in [src/renderer.js](src/renderer.js#L56-L58) and `main.js` loop at [src/main.js](src/main.js#L63-L69]).
- Image buffer: the renderer uses a single `ImageData` buffer and reuses it every frame to reduce GC pressure ([src/renderer.js](src/renderer.js#L41-L45)).
- Color mapping: amplitude is normalized by total source amplitude for stable color ranges ([src/renderer.js](src/renderer.js#L64-L67)).

Performance tips:
- Increase `CANVAS_WIDTH`/`CANVAS_HEIGHT` in [src/renderer.js](src/renderer.js#L1-L4) to raise resolution (performance cost scales with N²).
- To run at lower CPU, reduce the canvas resolution or throttle `state.time` increments.

---

## Developer Notes & Extending

- Core physics implementation: `computeSuperposition(x, y, t)` in [src/physics.js](src/physics.js#L15-L18).
- To add a preset: follow the `applyYoungsSlit` pattern in [src/presets.js](src/presets.js#L40-L46) and register it via `attachPresets()`.
- To switch to physical intensity mapping, replace the renderer's normalization step with a squared-amplitude mapping (use `I = \\Psi^2`) in [src/renderer.js](src/renderer.js#L64-L67).
- Export snapshots using the UI export button (implementation in [src/exporter.js](src/exporter.js#L1-L14)).

---

## Run locally

Open `index.html` directly in a browser, or run a simple local server:

```bash
# Node: (if you have Node.js)
npx serve .

# Python 3:
python -m http.server 8000

# Then open http://localhost:8000
```

---

## Limitations & Assumptions

- 2D slice model — does not model full 3D spherical wave propagation.
- Attenuation is an empirical visual fade (not a rigorous energy-loss model).
- Diffraction uses a sinc-like envelope based on pixel slit width — this is an approximation for educational visuals.

---

## Contributing

If you'd like the phased-array Wi‑Fi demo reintroduced, or an explicit physical intensity mode added, I can implement those changes and update the UI. Tell me which you'd prefer and I will:

1. Add a `phasedArray` preset (practical implementation).
2. Add an `intensityMode` toggle (maps colors to $|\\Psi|^2$).

---

Enjoy exploring wave interference — and let me know which enhancement you'd like next.

**— The WaveSync Team**
For better development experience with live reload:
