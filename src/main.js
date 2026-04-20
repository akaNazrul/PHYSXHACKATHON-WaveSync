import { initRenderer, paintFrame } from './renderer.js';
import { initControls, updateSlidersFromState } from './controls.js';
import { attachPresets } from './presets.js';
import { attachExporter } from './exporter.js';
import { resetState } from './state.js';

function boot() {
  console.log('[WaveSync] Bootstrapping...');
  
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
  });

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
