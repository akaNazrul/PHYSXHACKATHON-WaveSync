import { state } from './state.js';
import { updateSlidersFromState } from './controls.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './renderer.js';

export function attachPresets() {
  document.getElementById('preset-youngs')?.addEventListener('click', applyYoungsSlit);
  document.getElementById('preset-noise')?.addEventListener('click', applyNoiseCancellation);
  document.getElementById('preset-wifi')?.addEventListener('click', applyWiFiBeamforming);
}

export function updateOverlays(activeId) {
  ['youngs', 'noise', 'wifi'].forEach(id => {
    const el = document.getElementById(`overlay-${id}`);
    if (el) {
      if (id === activeId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  const slitControls = document.getElementById('slit-controls');
  if (slitControls) {
    slitControls.style.display = activeId === 'youngs' ? 'block' : 'none';
  }

  const phoneEl = document.getElementById('phone-indicator');
  if (phoneEl) {
    if (activeId === 'wifi') {
      phoneEl.classList.add('visible');
    } else {
      phoneEl.classList.remove('visible');
    }
  }
}

function applyYoungsSlit() {
  // Young's double slit: Two point sources close to each other, identical phase and frequency
  // Use current slit separation
  const sep = state.ui.slitSeparation;
  state.sources[0] = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - sep/2, frequency: 4.0, amplitude: 1.0, phase: 0 };
  state.sources[1] = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + sep/2, frequency: 4.0, amplitude: 1.0, phase: 0 };
  state.ui.activePreset = 'youngs';
  updateSlidersFromState();
  updateOverlays('youngs');
}

function applyNoiseCancellation() {
  // Noise cancellation: Two sources overlapping exactly (or very close), exactly 180deg out of phase
  state.sources[0] = { x: CANVAS_WIDTH / 2 - 60, y: CANVAS_HEIGHT / 2 + 10, frequency: 2.0, amplitude: 1.0, phase: 0 };
  state.sources[1] = { x: CANVAS_WIDTH / 2 + 60, y: CANVAS_HEIGHT / 2 + 10, frequency: 2.0, amplitude: 1.0, phase: 180 };
  state.ui.activePreset = 'noise';
  updateSlidersFromState();
  updateOverlays('noise');
}

function applyWiFiBeamforming() {
  // Wi-Fi phased array: Two antennas separated by half a wavelength to create a directional beam 
  state.sources[0] = { x: CANVAS_WIDTH / 2 - 12.5, y: CANVAS_HEIGHT / 2, frequency: 2.0, amplitude: 1.0, phase: 0 };
  state.sources[1] = { x: CANVAS_WIDTH / 2 + 12.5, y: CANVAS_HEIGHT / 2, frequency: 2.0, amplitude: 1.0, phase: 90 };
  state.ui.phone = { x: 300, y: 100 }; // Ensure phone is positioned nicely
  state.ui.activePreset = 'wifi';
  updateSlidersFromState();
  updateOverlays('wifi');
}
