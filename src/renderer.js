import { state } from './state.js';
import { computeSuperposition } from './physics.js';

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 400;

let canvas, ctx, imageData, data;
let isReady = false;

// Optimization: precalculating variables to prevent gc thrashing 
let r, g, b, totalMaxAmplitude;

export function initRenderer() {
  canvas = document.getElementById('canvas-main');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  ctx = canvas.getContext('2d', { alpha: false });
  
  // Creates standard buffer of 400x400x4 size
  imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
  data = imageData.data;
  
  isReady = true;
  canvas.classList.add('ready');
}

/**
 * Main 60 fps paint loop processing the internal resolution buffer.
 */
export function paintFrame() {
  if (!isReady) return;

  // Find theoretic max amplitude limit per frame calculation bounds (-2 to 2 typically if two 1 amp waves max out)
  totalMaxAmplitude = state.sources.reduce((sum, s) => sum + s.amplitude, 0);

  // Fallback to avoid div by zero coloring if no amp 
  if (totalMaxAmplitude === 0) totalMaxAmplitude = 1;

  let offset = 0;
  // Compute across 400x400 grid representing superposition
  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      
      const amp = computeSuperposition(x, y, state.time);
      
      // Normalize amplitude between -1 to 1 regardless of amplitudes inputs for generic coloring mapping
      let normalized = amp / totalMaxAmplitude; 
      
      // Apply color ramp based on resulting normalization
      // Constructive positive (amber-ish)
      // Destructive/Null (void/dark blue)
      // Constructive negative (cyan/blue)
      
      if (normalized > 0) {
        // Map to constructive (#f59e0b) = rgb(245, 158, 11)
        r = 17 + (normalized * (245 - 17)); // Baseline color is void: rgb(17, 21, 32)
        g = 21 + (normalized * (158 - 21));
        b = 32 + (normalized * (11 - 32));
      } else {
        // Map to destructive negative (#0d3b6e) = rgb(13, 59, 110)
        let n = Math.abs(normalized);
        r = 17 + (n * (13 - 17));
        g = 21 + (n * (59 - 21));
        b = 32 + (n * (110 - 32));
      }

      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = 255; // Alpha
      
      offset += 4;
    }
  }

  // Paint the final assembled bitmap object 
  ctx.putImageData(imageData, 0, 0);
  
  // Advance deterministic app time (arbitrary speed constant dt = 0.05 per frame)
  state.time += 0.05; 
}
