export function attachExporter() {
  const btn = document.getElementById('btn-export');
  const canvas = document.getElementById('canvas-main');
  
  if (btn && canvas) {
    btn.addEventListener('click', () => {
      // Get data URL of HTML Canvas object 
      const dataURL = canvas.toDataURL('image/png');
      
      // Construct dynamic filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `wavesync-export-${timestamp}.png`;
      
      // Auto-trigger synthetic download interaction 
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
