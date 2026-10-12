const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function createIcon(size, filename) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const radius = size * 0.42;
  const sunRadius = size * 0.18;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded rectangle for the app icon background (Royal Blue #1e3a8a)
      const cornerR = size * 0.22;
      const innerX = Math.max(0, Math.abs(dx) - (center - cornerR - size * 0.04));
      const innerY = Math.max(0, Math.abs(dy) - (center - cornerR - size * 0.04));
      const cornerDist = Math.sqrt(innerX * innerX + innerY * innerY);

      if (cornerDist <= cornerR) {
        // Inside rounded icon
        // Subtle gradient from #2563eb to #1e3a8a
        const gradRatio = y / size;
        let r = Math.round(37 * (1 - gradRatio) + 30 * gradRatio);
        let g = Math.round(99 * (1 - gradRatio) + 58 * gradRatio);
        let b = Math.round(235 * (1 - gradRatio) + 138 * gradRatio);

        // Center golden circle (Sun) #fbbf24
        const sunDy = y - (center + size * 0.04);
        const sunDist = Math.sqrt(dx * dx + sunDy * sunDy);
        if (sunDist <= sunRadius) {
          r = 251;
          g = 191;
          b = 36;
        }

        // Star arch circle ring (10 stars approximate halo)
        const haloDist = Math.abs(dist - size * 0.28);
        if (haloDist < size * 0.015 && y < center + size * 0.1) {
          r = 251;
          g = 191;
          b = 36;
        }

        // Icon border ring
        if (cornerDist >= cornerR - 2) {
          r = 147;
          g = 197;
          b = 253; // subtle light blue border
        }

        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255;
      } else {
        // Transparent outside
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      }
    }
  }

  const outPath = path.join(__dirname, filename);
  png.pack().pipe(fs.createWriteStream(outPath));
  console.log(`Generated ${filename} (${size}x${size})`);
}

createIcon(192, 'icon-192.png');
createIcon(512, 'icon-512.png');
