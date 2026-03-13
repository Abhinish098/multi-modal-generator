export const ICONS = {
  image: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
  ),
  video: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  object3d: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  random: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16,3 21,3 21,8"/><line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21,16 21,21 16,21"/><line x1="15" y1="15" x2="21" y2="21"/>
    </svg>
  ),
  generate: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
  ),
};

export const SAMPLERS = ["Euler a", "Euler", "DPM++ 2M", "DPM++ SDE", "DDIM", "PLMS"];
export const VIDEO_STYLES = ["Cinematic", "Anime", "Documentary", "Slow Motion", "Time-lapse", "Cartoon"];
export const MESH_STYLES = ["Low Poly", "Realistic", "Stylized", "Sculpted", "Wireframe", "Voxel"];
export const FORMATS = ["GLB", "OBJ", "FBX", "STL", "USDZ"];
export const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "9:16", "3:2", "2:3"];
export const VIDEO_RESOLUTIONS = ["480p", "720p", "1080p", "4K"];
