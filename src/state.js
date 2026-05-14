/**
 * Default internal application state
 */
export const DEFAULT_STATE = {
  sources: [
    { x: 100, y: 200, frequency: 2.0, amplitude: 1.0, phase: 0 },   // Source A (index 0)
    { x: 300, y: 200, frequency: 2.0, amplitude: 1.0, phase: 0 }    // Source B (index 1)
  ],
  ui: {
    showEquations: true,
    activePreset: null,
    phone: { x: 200, y: 50 },
    displayMode: 'waves',
    slitWidth: 12,
    slitSeparation: 40
  },
  time: 0
};

// Deep copy to prevent mutating the original fallback
export const state = JSON.parse(JSON.stringify(DEFAULT_STATE));

export function resetState() {
  const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
  state.sources = fresh.sources;
  state.ui = fresh.ui;
  state.time = 0;
}
