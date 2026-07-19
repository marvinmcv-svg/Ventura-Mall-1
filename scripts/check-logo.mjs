import sharp from "sharp";
const raw = await sharp("public/ventura-logo.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = raw;
const { width, height, channels } = info;
let transparent = 0, opaque = 0, blackOpaque = 0, colored = 0;
for (let i = 0; i < data.length; i += channels) {
  const a = data[i + 3];
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (a === 0) transparent++;
  else {
    opaque++;
    if (r < 30 && g < 30 && b < 30) blackOpaque++;
    else colored++;
  }
}
const total = width * height;
console.log(`dims: ${width}x${height}, total: ${total}`);
console.log(`transparent: ${transparent} (${(transparent/total*100).toFixed(1)}%)`);
console.log(`opaque: ${opaque} (${(opaque/total*100).toFixed(1)}%)`);
console.log(`  opaque-black (should be ~0): ${blackOpaque}`);
console.log(`  opaque-colored (logo): ${colored}`);
