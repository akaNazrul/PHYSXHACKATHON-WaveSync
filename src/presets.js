import { state } from './state.js';
import { updateSlidersFromState } from './controls.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './renderer.js';

export function attachPresets() {
  document.getElementById('preset-youngs')?.addEventListener('click', applyYoungsSlit);
  document.getElementById('preset-noise')?.addEventListener('click', applyNoiseCancellation);
  document.getElementById('preset-wifi')?.addEventListener('click', applyWiFiBeamforming);
}

function applyYoungsSlit() {
  // Young's double slit: Two point sources close to each other, identical phase and frequency
  state.sources[0] = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 20, frequency: 4.0, amplitude: 1.0, phase: 0 };
  state.sources[1] = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 20, frequency: 4.0, amplitude: 1.0, phase: 0 };
  state.ui.activePreset = 'youngs';
  updateSlidersFromState();
}

function applyNoiseCancellation() {
  // Noise cancellation: Two sources overlapping exactly (or very close), exactly 180deg out of phase
  state.sources[0] = { x: CANVAS_WIDTH / 2 - 5, y: CANVAS_HEIGHT / 2, frequency: 2.0, amplitude: 1.0, phase: 0 };
  state.sources[1] = { x: CANVAS_WIDTH / 2 + 5, y: CANVAS_HEIGHT / 2, frequency: 2.0, amplitude: 1.0, phase: 180 };
  state.ui.activePreset = 'noise';
  updateSlidersFromState();
}

function applyWiFiBeamforming() {
  // Wi-Fi phased array: Two antennas separated by half a wavelength to create a directional beam 
  // Let lambda = V / f => 50 / 2 = 25 pixels
  // Separation ~ 12.5 pixels
  state.sources[0] = { x: CANVAS_WIDTH / 2 - 12.5, y: CANVAS_HEIGHT / 2, frequency: 2.0, amplitude: 1.0, phase: 0 };
  state.sources[1] = { x: CANVAS_WIDTH / 2 + 12.5, y: CANVAS_HEIGHT / 2, frequency: 2.0, amplitude: 1.0, phase: 90 };
  state.ui.activePreset = 'wifi';
  updateSlidersFromState();
}
