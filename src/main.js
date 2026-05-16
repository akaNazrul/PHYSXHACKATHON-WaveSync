import { initRenderer, paintFrame } from './renderer.js';
import { initControls, updateSlidersFromState, syncDOMIndicators } from './controls.js';
import { attachPresets, updateOverlays } from './presets.js';
import { attachExporter } from './exporter.js';
import { resetState, state } from './state.js';
import { computeSuperposition } from './physics.js';

function boot() {
  console.log('[OmbakSim] Bootstrapping...');
  
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup contexts
  initRenderer();
  initControls();
  
  // Feature attachments
  attachPresets();
  attachExporter();

  // Reset listener
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    resetState();
    updateSlidersFromState();
    syncDOMIndicators();
    updateOverlays(null);
  });

  // Onboarding Modal listener
  const btnStart = document.getElementById('btn-start');
  const modal = document.getElementById('onboarding-modal');
  if (btnStart && modal) {
    btnStart.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Interactive Probe (Tier D-02)
  const canvasMain = document.getElementById('canvas-main');
  const probeValueDOM = document.getElementById('probe-value');
  if (canvasMain && probeValueDOM) {
    canvasMain.addEventListener('mousemove', (e) => {
      const rect = canvasMain.getBoundingClientRect();
      const scaleX = 400 / rect.width;
      const scaleY = 400 / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      
      const amp = computeSuperposition(mx, my, state.time);
      probeValueDOM.innerText = `Probe at (${Math.round(mx)}, ${Math.round(my)}): ${amp.toFixed(2)}`;
    });
    
    // Clear probe on mouseleave
    canvasMain.addEventListener('mouseleave', () => {
      probeValueDOM.innerText = `Amplitude: -`;
    });
  }

  // Start logic loop
  requestAnimationFrame(loop);
}

function loop() {
  paintFrame();
  requestAnimationFrame(loop);
}

// Ensure DOM parses entirely before running JS bindings
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
