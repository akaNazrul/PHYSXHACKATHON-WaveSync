# 🌊 WaveSync — Wave Interference Explorer

**WaveSync** is a compact, zero-dependency browser app that simulates **real-time 2D wave interference** for education and experimentation.

**Launch Live App:** https://akanazrul.github.io/PHYSXHACKATHON-WaveSync/

---

## Mission

WaveSync helps students and engineers build intuition for wave interference (superposition), connecting directly to real-world phenomena like **noise cancellation** and other coherent-wave applications.

---

## What WaveSync simulates (current functionality)

The simulation renders an amplitude field over a **fixed 2D grid (400×400)**. It models waves as a sum of contributions from a small set of moving/placed coherent sources.

Current preset scenarios are:
- **Young’s Double-Slit** (`activePreset: 'youngs'`)
- **Noise Cancellation (Destructive Interference)** (`activePreset: 'noise'`)

---

## Physics & Equations

WaveSync computes the total **scalar wave amplitude** at each grid point (x, y) and time t:

$$
\\Psi(x,y,t)=\\sum_i \\psi_i(x,y,t)
$$

### 1) Per-source wave term (amplitude)
For each source `i`, the code uses:

- Model wave speed (simulation units):  
  $$v = \\text{SPEED\_OF\_WAVE} = 50$$

- Wavelength:
  $$\\lambda_i = \\frac{v}{f_i}$$

- Wave number:
  $$k_i = \\frac{2\\pi}{\\lambda_i}$$

- Angular frequency:
  $$\\omega_i = 2\\pi f_i$$

- Phase (source stores phase in degrees; converted to radians):
  $$\\phi_i = \\text{phaseDeg}_i\\cdot \\frac{\\pi}{180}$$

Distance from grid point to the source:
$$
r_i = \\sqrt{(x-x_i)^2+(y-y_i)^2}
$$

The basic oscillatory part is:
$$
\\sin\\big(k_i r_i-\\omega_i t+\\phi_i\\big)
$$

### 2) Empirical distance attenuation (visual fade)
Each source contribution is attenuated for visual clarity using:
$$
D(r_i)=\\frac{50}{r_i+50}
$$

### 3) Young’s finite-slit diffraction envelope (only in `youngs` preset)

When `state.ui.activePreset === 'youngs'`, WaveSync applies a **sinc diffraction envelope** based on the finite slit width `a = state.ui.slitWidth` (measured in pixels in the sim).

The code approximates the geometry factor using:
$$
\\sin\\theta \\approx \\frac{dy}{r_i}
$$
where `dy = y - source.y` and `r_i = max(EPSILON, sqrt(dx^2+dy^2))` in practice to avoid division by zero.

Define the sinc argument:
$$
\\beta = \\frac{\\pi a\\sin\\theta}{\\lambda_i}
$$

and the envelope:
$$
E_{\\text{diffraction}}(\\theta)=\\operatorname{sinc}(\\beta)=\\frac{\\sin(\\beta)}{\\beta}
$$

(When $|\\beta|$ is tiny, the code returns `1` to avoid numerical instability.)

### 4) Final per-source contribution (matches `src/physics.js`)
Putting it together, the per-source amplitude term is:

$$
\\psi_i(x,y,t)=A_i\\cdot D(r_i)\\cdot E_{\\text{diffraction}}\\cdot \\sin\\big(k_i r_i-\\omega_i t+\\phi_i\\big)
$$

- In presets other than `youngs`, `E_{diffraction}=1` (envelope disabled).
- The renderer then sums all sources to get $\\Psi$.

---

## Rendering & What the colors mean

The renderer computes $\\Psi$ at each pixel and then maps the **normalized amplitude** (not physical intensity) to color.

### Color normalization (matches `src/renderer.js`)
For the whole frame:

- TotalMaxAmplitude:
  $$
  A_{\\max}=\\sum_i A_i
  $$
- Normalized amplitude at each pixel:
  $$
  \\text{normalized} = \\frac{\\Psi}{A_{\\max}}
  $$

Then:
- Positive normalized amplitudes map to a “constructive” color palette.
- Negative amplitudes map to a “destructive” palette.
- The readouts/graphs probe the same amplitude field (via `computeSuperposition`).

### Note on intensity vs amplitude
In physics, intensity is often proportional to $|\\Psi|^2$.
WaveSync’s current visualization instead uses **amplitude normalization** for clarity and teaching. (If you want a strict intensity mode, the change would be in the renderer’s mapping step.)

---

## Presets (current)

### 1) Young’s Double-Slit (`applyYoungsSlit`)
- Creates two coherent sources with identical frequency and amplitude.
- Keeps `phase = 0` for both sources.
- Uses UI slit geometry (`slitSeparation`, `slitWidth`) to affect the envelope while rendering.

### 2) Noise Cancellation (`applyNoiseCancellation`)
- Creates two sources with the same frequency and amplitude.
- Sets a 180° phase offset (`phase: 180` for one source).
- Interference patterns can form destructive regions consistent with cancellation intuition.

---

## Run locally

Open `index.html` directly, or run a simple local server:

```bash
# Python 3:
python -m http.server 8000
# Then open http://localhost:8000
```
---

## Developer Notes & Extending

- Core physics function: `computeSuperposition(x, y, t)` in `src/physics.js`.
- Preset wiring: `attachPresets()` and the preset functions in `src/presets.js`.
- Rendering color logic: amplitude normalization and palette mapping in `src/renderer.js`.

If you add new presets, ensure they update `state.ui.activePreset` so the diffraction/envelope logic matches the intended physics mode.
