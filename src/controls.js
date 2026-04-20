import { state } from './state.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './renderer.js';

let isDragging = false;
let activeSourceIndex = -1;

export function initControls() {
  // Map sliders to state attributes
  const bindings = [
    { id: 'freq-a', src: 0, prop: 'frequency', display: 'val-freq-a' },
    { id: 'amp-a', src: 0, prop: 'amplitude', display: 'val-amp-a' },
    { id: 'phase-a', src: 0, prop: 'phase', display: 'val-phase-a' },
    { id: 'freq-b', src: 1, prop: 'frequency', display: 'val-freq-b' },
    { id: 'amp-b', src: 1, prop: 'amplitude', display: 'val-amp-b' },
    { id: 'phase-b', src: 1, prop: 'phase', display: 'val-phase-b' }
  ];

  bindings.forEach(b => {
    const el = document.getElementById(b.id);
    const disp = document.getElementById(b.display);
    
    if (el && disp) {
      // Init visual state on load based on default config
      el.value = state.sources[b.src][b.prop];
      disp.textContent = state.sources[b.src][b.prop];

      el.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        state.sources[b.src][b.prop] = val;
        disp.textContent = val;
        updateEquationDisplay();
      });
    }
  });

  // Source Drag Interactions setup
  setupDrag('source-a-indicator', 0);
  setupDrag('source-b-indicator', 1);

  // Position DOM nodes exactly relative to the canvas internal geometry matching
  syncDOMIndicators();

  // Resize window handler to update mapping
  window.addEventListener('resize', syncDOMIndicators);

  // Info Button Toggle
  const infoBtn = document.getElementById('btn-info');
  infoBtn.addEventListener('click', () => {
    state.ui.showEquations = !state.ui.showEquations;
    document.getElementById('equation-display').classList.toggle('visible', state.ui.showEquations);
  });
  
  // Initial equation render
  updateEquationDisplay();
}

function setupDrag(id, index) {
  const el = document.getElementById(id);
  if (!el) return;

  const canvasContainer = document.getElementById('canvas-container');

  el.addEventListener('mousedown', startDrag(index));
  el.addEventListener('touchstart', startDrag(index), { passive: false });

  // Add listeners to document to handle fast outward dragging 
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  function startDrag(idx) {
    return (e) => {
      e.preventDefault();
      isDragging = true;
      activeSourceIndex = idx;
    };
  }

  function drag(e) {
    if (!isDragging || activeSourceIndex === -1) return;
    
    // Abstract pointer touch or mouse event coordinates
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = canvasContainer.getBoundingClientRect();
    
    // Scale DOM bounding rect to internal pixel dimensions (400x400 limit)
    let x = (clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    let y = (clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
    
    // Clamp to canvas boundaries to avoid rendering NaN or out of bounds artifacts
    x = Math.max(0, Math.min(x, CANVAS_WIDTH));
    y = Math.max(0, Math.min(y, CANVAS_HEIGHT));

    state.sources[activeSourceIndex].x = x;
    state.sources[activeSourceIndex].y = y;

    syncDOMIndicators();
  }

  function endDrag() {
    isDragging = false;
    activeSourceIndex = -1;
  }
}

/**
 * Align DOM visual nodes precisely mapped to the underlying Canvas layout
 */
export function syncDOMIndicators() {
  const container = document.getElementById('canvas-container');
  if(!container) return;

  const rect = container.getBoundingClientRect();
  
  const srcA = document.getElementById('source-a-indicator');
  const srcB = document.getElementById('source-b-indicator');

  if (srcA) {
    const pX = (state.sources[0].x / CANVAS_WIDTH) * rect.width;
    const pY = (state.sources[0].y / CANVAS_HEIGHT) * rect.height;
    srcA.style.left = `${pX}px`;
    srcA.style.top = `${pY}px`;
  }
  
  if (srcB) {
    const pX = (state.sources[1].x / CANVAS_WIDTH) * rect.width;
    const pY = (state.sources[1].y / CANVAS_HEIGHT) * rect.height;
    srcB.style.left = `${pX}px`;
    srcB.style.top = `${pY}px`;
  }
}

/**
 * Format string variables directly mapped to the equation block template.
 */
function updateEquationDisplay() {
  const eqv = document.getElementById('eq-values');
  if (!eqv) return;

  const s0 = state.sources[0];
  const s1 = state.sources[1];

  eqv.innerHTML = `
    <span class="equation-var-a">${s0.amplitude}</span>sin(k·r₁ - 
    ${(2 * Math.PI * s0.frequency).toFixed(1)}t + ${s0.phase}°) + <br>
    <span class="equation-var-b">${s1.amplitude}</span>sin(k·r₂ - 
    ${(2 * Math.PI * s1.frequency).toFixed(1)}t + ${s1. phase}°)
  `;
}

// Function utilized by preset manager to reset UI inputs when underlying object state mutates
export function updateSlidersFromState() {
  const bindings = [
    { id: 'freq-a', src: 0, prop: 'frequency', display: 'val-freq-a' },
    { id: 'amp-a', src: 0, prop: 'amplitude', display: 'val-amp-a' },
    { id: 'phase-a', src: 0, prop: 'phase', display: 'val-phase-a' },
    { id: 'freq-b', src: 1, prop: 'frequency', display: 'val-freq-b' },
    { id: 'amp-b', src: 1, prop: 'amplitude', display: 'val-amp-b' },
    { id: 'phase-b', src: 1, prop: 'phase', display: 'val-phase-b' }
  ];

  bindings.forEach(b => {
    const el = document.getElementById(b.id);
    const disp = document.getElementById(b.display);
    if (el && disp) {
      el.value = state.sources[b.src][b.prop];
      disp.textContent = state.sources[b.src][b.prop];
    }
  });

  syncDOMIndicators();
  updateEquationDisplay();
}
