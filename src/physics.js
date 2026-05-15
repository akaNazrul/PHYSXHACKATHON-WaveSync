import { state } from './state.js';

// velocity, v of wave
const SPEED_OF_WAVE = 50; // Pixels per second relative velocity parameter in simulation

const EPSILON = 1e-6;

function sinc(beta) {
  if (Math.abs(beta) < EPSILON) return 1;
  return Math.sin(beta) / beta;
}

/**
 * Calculates the amplitude mapped to an individual point in 2D space based on superposition.
 * Function signature intentionally isolated as per PRD for physics compute logic.
 * 
 * Psi = A1*sin(k*r1 - wt + phi1) + A2*sin(k*r2 - wt + phi2)
 *
 * @param {number} x - Pixel X coordinate on the grid
 * @param {number} y - Pixel Y coordinate on the grid
 * @param {number} t - Time parameter in seconds passed
 * @returns {number} Float representing superposition amplitude at that given point (-2 to 2)
 */
export function computeSuperposition(x, y, t) {
  let totalAmplitude = 0;
  const useYoungDiffraction = state.ui.activePreset === 'youngs';
  const apertureWidth = Math.max(1, state.ui.slitWidth || 1);
  
  for (let i = 0; i < state.sources.length; i++) {
    const source = state.sources[i];
    
    // Wave parameters
    // k = wave number = 2*pi/wavelength. w = angular frequency = 2*pi*f
    // V = f * lambda -> wavelength = V / f
    const wavelength = SPEED_OF_WAVE / source.frequency;
    const k = (2 * Math.PI) / wavelength;
    const w = 2 * Math.PI * source.frequency;
    const phi = (source.phase * Math.PI) / 180; // conversion to radians
    
    // Distance from point to source
    const dx = x - source.x;
    const dy = y - source.y;
    const r = Math.sqrt(dx * dx + dy * dy);

    // Young's mode: finite slit width creates a diffraction envelope.
    // beta = pi * a * sin(theta) / lambda, with slit width directly in pixels.
    let diffractionEnvelope = 1;
    if (useYoungDiffraction) {
      const sinTheta = dy / Math.max(r, EPSILON);
      const beta = (Math.PI * apertureWidth * sinTheta) / wavelength;
      diffractionEnvelope = sinc(beta);
    }
    
    // Attenuation over distance: makes it look like real water ripples
    // The decay multiplier ensures the main rings stay bright but fade naturally as they expand,
    // which prevents the harsh checkerboard interference pattern everywhere on screen.
    const distanceFade = 50 / (r + 50); 
    const psi = source.amplitude * distanceFade * diffractionEnvelope * Math.sin(k * r - (w * t) + phi);
    totalAmplitude += psi;
  }
  
  return totalAmplitude;
}
