import * as THREE from 'three';

// Generates a clean, realistic deep-slate Earth texture with natural landmasses, coastlines, and soft ambient lights
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Slate Ocean Base (#0F172A / #1E293B)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0f172a');
  oceanGrad.addColorStop(0.5, '#1e293b');
  oceanGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle natural latitude/longitude lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Coordinate projections
  const toX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const toY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  // 2. Continental Landmasses (Soft slate green/grey #334155 / #475569)
  ctx.fillStyle = '#293548'; // Landmass tone
  ctx.strokeStyle = '#475569'; // Natural coastline
  ctx.lineWidth = 2.5;

  const landmasses = [
    // Indian Subcontinent (Clear & prominent)
    [
      [68, 24], [72, 32], [76, 35], [80, 31], [88, 27], [92, 25],
      [90, 22], [85, 20], [80, 15], [77, 8], [75, 12], [72, 18], [68, 24]
    ],
    // Eurasia & East Asia
    [
      [30, 65], [60, 68], [90, 72], [125, 70], [140, 60], [130, 45],
      [120, 32], [105, 20], [100, 10], [95, 22], [80, 30], [60, 35],
      [45, 40], [30, 42], [20, 50], [10, 60], [30, 65]
    ],
    // Africa
    [
      [-15, 30], [10, 37], [32, 31], [42, 12], [50, 10], [40, -10],
      [32, -30], [20, -35], [15, -25], [10, -5], [-5, 5], [-17, 15], [-15, 30]
    ],
    // North America
    [
      [-165, 65], [-135, 60], [-100, 50], [-75, 45], [-65, 45],
      [-75, 35], [-80, 25], [-95, 20], [-105, 25], [-120, 35],
      [-125, 48], [-140, 58], [-165, 65]
    ],
    // South America
    [
      [-80, 10], [-50, -5], [-35, -5], [-40, -20], [-55, -35],
      [-65, -55], [-75, -45], [-72, -20], [-80, -5], [-80, 10]
    ],
    // Australia
    [
      [115, -20], [130, -12], [145, -15], [152, -25], [148, -38],
      [135, -35], [115, -32], [113, -25], [115, -20]
    ]
  ];

  landmasses.forEach((polygon) => {
    ctx.beginPath();
    polygon.forEach(([lng, lat], i) => {
      const px = toX(lng);
      const py = toY(lat);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // 3. Warm, subtle population light points (soft gold #fef3c7)
  const cityLights = [
    [77.41, 23.25, 5],  // Bhopal
    [77.20, 28.61, 7],  // Delhi
    [72.87, 19.07, 7],  // Mumbai
    [75.85, 22.71, 4],  // Indore
    [85.82, 20.29, 5],  // Odisha
    [79.06, 30.73, 4],  // Uttarakhand
    [80.27, 13.08, 6],  // Chennai
    [88.36, 22.57, 6],  // Kolkata
    [78.48, 17.38, 6],  // Hyderabad
    [77.59, 12.97, 7],  // Bangalore
    [139.69, 35.68, 5], // Tokyo
    [116.40, 39.90, 5], // Beijing
    [2.35, 48.85, 5],   // Paris
    [-74.00, 40.71, 6], // New York
    [-0.12, 51.50, 5]   // London
  ];

  cityLights.forEach(([lng, lat, radius]) => {
    const cx = toX(lng);
    const cy = toY(lat);
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.5);
    radGrad.addColorStop(0, 'rgba(254, 243, 199, 0.8)');
    radGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
    radGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
