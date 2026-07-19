import sharp from "sharp";
import fs from "fs";

const inPath = process.argv[2] || "public/ventura-logo.png";
const outPath = process.argv[3] || inPath;

const raw = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { data, info } = raw;
const { width, height, channels } = info;

let removed = 0;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b);
  if (max < 12) {
    data[i + 3] = 0;
    removed++;
  } else if (max < 40) {
    const a = Math.round(((max - 12) / 28) * 255);
    data[i + 3] = Math.min(data[i + 3], a);
    removed++;
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log(`Removed bg from ${removed} of ${width * height} pixels -> ${outPath} (${fs.statSync(outPath).size} bytes)`);
