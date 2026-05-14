import { state } from './state.js';
import { computeSuperposition } from './physics.js';

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 400;

let canvas, ctx, imageData, data;
let graphCanvas, graphCtx;
let isReady = false;

// Optimization: precalculating variables to prevent gc thrashing 
let r, g, b, totalMaxAmplitude;

// Particle System variables
let particles = [];
const NUM_PARTICLES = 400;

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    // Pick a random active source
    const sourceIdx = Math.random() > 0.5 ? 0 : 1;
    const source = state.sources[sourceIdx];
    this.x = source.x;
    this.y = source.y;
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    // Speed proportional to frequency roughly, but just constant for now
    this.speed = Math.random() * 2 + 1;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.life = Math.random() * 100 + 50;
    this.maxLife = this.life;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
    if (this.x < 0 || this.x > CANVAS_WIDTH || this.y < 0 || this.y > CANVAS_HEIGHT || this.life <= 0) {
      this.reset();
    }
  }
}

export function drawSlitSVG() {
  const slitSvg = document.getElementById('slit-svg');
  const path = document.getElementById('slit-path');
  if (!path) return;
  
  const width = state.ui.slitWidth;
  const sep = state.ui.slitSeparation;
  const midY = CANVAS_HEIGHT / 2;

  const y1 = midY - sep/2 - width/2;
  const y2 = midY - sep/2 + width/2;
  const y3 = midY + sep/2 - width/2;
  const y4 = midY + sep/2 + width/2;

  path.setAttribute('d', `
    M 200 0 L 200 ${y1}
    M 200 ${y2} L 200 ${y3}
    M 200 ${y4} L 200 ${CANVAS_HEIGHT}
  `);
}

export function initRenderer() {
  canvas = document.getElementById('canvas-main');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  ctx = canvas.getContext('2d', { alpha: false });
  
  // Creates standard buffer of 400x400x4 size
  imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
  data = imageData.data;
  
  graphCanvas = document.getElementById('graph-canvas');
  if (graphCanvas) {
    graphCtx = graphCanvas.getContext('2d');
  }

  // Initialize Particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }

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
  
  if (state.ui.displayMode === 'waves' || state.ui.displayMode === 'both') {
    // Compute across 400x400 grid representing superposition
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      for (let x = 0; x < CANVAS_WIDTH; x++) {
        
        const amp = computeSuperposition(x, y, state.time);
        
        // Normalize amplitude between -1 to 1 regardless of amplitudes inputs for generic coloring mapping
        let normalized = amp / totalMaxAmplitude; 
        
        // Cinematic Palette
        if (normalized > 0) {
          // Map to constructive Bright Cyan/Gold (#0ea5e9) = rgb(14, 165, 233)
          // Baseline color is void: rgb(9, 14, 23) based on new variables
          r = 9 + (normalized * (14 - 9));
          g = 14 + (normalized * (165 - 14));
          b = 23 + (normalized * (233 - 23));
        } else {
          // Map to destructive Deep Navy (#0d2746) = rgb(13, 39, 70)
          let n = Math.abs(normalized);
          r = 9 + (n * (13 - 9));
          g = 14 + (n * (39 - 14));
          b = 23 + (n * (70 - 23));
        }

        data[offset] = r;
        data[offset + 1] = g;
        data[offset + 2] = b;
        data[offset + 3] = 255; // Alpha
        
        offset += 4;
      }
    }
  } else {
    // Fill with empty void background
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      for (let x = 0; x < CANVAS_WIDTH; x++) {
        data[offset] = 9;
        data[offset + 1] = 14;
        data[offset + 2] = 23;
        data[offset + 3] = 255;
        offset += 4;
      }
    }
  }

  // Paint the final assembled bitmap object 
  ctx.putImageData(imageData, 0, 0);

  // Overlap Particles
  if (state.ui.displayMode === 'particles' || state.ui.displayMode === 'both') {
    ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
    for (let p of particles) {
      p.update();
      // Only show particle strongly if the probability wave is high
      const amp = computeSuperposition(p.x, p.y, state.time);
      const intensity = Math.abs(amp / totalMaxAmplitude);
      
      ctx.beginPath();
      // Radius depends on intensity
      ctx.arc(p.x, p.y, 1 + intensity * 2, 0, Math.PI * 2);
      // Opacity based on intensity
      ctx.fillStyle = `rgba(14, 165, 233, ${intensity})`;
      ctx.fill();
    }
  }  
  
  // Advance deterministic app time (arbitrary speed constant dt = 0.05 per frame)
  state.time += 0.05; 
  
  // Update Live Intensity Readout DOM (A-04) - Using center canvas probe for VU-meter effect
  const centerAmp = computeSuperposition(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, state.time);
  const centerNormalized = centerAmp / Math.max(0.1, totalMaxAmplitude);

  const uiConstructive = document.getElementById('readout-constructive');
  const uiDestructive = document.getElementById('readout-destructive');
  if (uiConstructive && uiDestructive) {
    if (centerNormalized > 0) {
      uiConstructive.style.width = Math.min((centerNormalized * 100), 100) + '%';
      uiDestructive.style.width = '0%';
    } else {
      uiConstructive.style.width = '0%';
      uiDestructive.style.width = Math.min((Math.abs(centerNormalized) * 100), 100) + '%';
    }
  }

  // Update Phone Receiver Signal (B-01/D-03)
  if (state.ui.activePreset === 'wifi' && state.ui.phone) {
    const phoneSignal = document.getElementById('phone-signal-fill');
    if (phoneSignal) {
      const pAmp = computeSuperposition(state.ui.phone.x, state.ui.phone.y, state.time);
      // Normalize against 0 to 2
      let pStrength = Math.abs(pAmp) / Math.max(0.1, totalMaxAmplitude);
      pStrength = Math.min(pStrength * 100, 100);
      phoneSignal.style.width = pStrength + '%';
      
      // Color change on high signal
      if (pStrength > 70) {
        phoneSignal.style.backgroundColor = 'var(--color-source-a)';
      } else if (pStrength > 30) {
        phoneSignal.style.backgroundColor = '#f59e0b';
      } else {
        phoneSignal.style.backgroundColor = 'var(--color-destructive)';
      }
    }
  }

  // Draw 1D Cross-Section Graph (Tier D-02)
  if (graphCtx) {
    const gWidth = graphCanvas.width;
    const gHeight = graphCanvas.height;
    
    graphCtx.clearRect(0, 0, gWidth, gHeight);
    
    // Draw center zero line
    graphCtx.beginPath();
    graphCtx.moveTo(0, gHeight / 2);
    graphCtx.lineTo(gWidth, gHeight / 2);
    graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    graphCtx.lineWidth = 1;
    graphCtx.stroke();

    // Draw wave across midline Y = 200
    graphCtx.beginPath();
    const probeY = CANVAS_HEIGHT / 2;
    for (let x = 0; x < gWidth; x++) {
      const gAmp = computeSuperposition(x, probeY, state.time);
      const gNorm = gAmp / Math.max(0.1, totalMaxAmplitude);
      
      const drawY = (gHeight / 2) - (gNorm * (gHeight / 2) * 0.8);
      if (x === 0) graphCtx.moveTo(x, drawY);
      else graphCtx.lineTo(x, drawY);
    }
    
    graphCtx.strokeStyle = 'var(--color-constructive)';
    graphCtx.lineWidth = 2;
    graphCtx.stroke();
  }
}

