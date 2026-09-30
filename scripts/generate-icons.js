import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create a valid PNG buffer of width x height with solid color / design
function createPngBuffer(width, height, r = 37, g = 99, b = 235) { // #2563eb Academic Blue
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type 2 (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw Image Data (Filter byte + RGB per pixel)
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 3);
    row[0] = 0; // None filter
    for (let x = 0; x < width; x++) {
      // Draw border framing for crisp icon appearance
      const isBorder = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      const isAccent = (x >= Math.floor(width * 0.25) && x <= Math.floor(width * 0.75)) &&
                       (y >= Math.floor(height * 0.4) && y <= Math.floor(height * 0.6));
      
      const pxOffset = 1 + x * 3;
      if (isBorder) {
        row[pxOffset] = 30;     // R
        row[pxOffset + 1] = 64; // G
        row[pxOffset + 2] = 175;// B
      } else if (isAccent) {
        row[pxOffset] = 255;    // R (White emblem)
        row[pxOffset + 1] = 255;// G
        row[pxOffset + 2] = 255;// B
      } else {
        row[pxOffset] = r;
        row[pxOffset + 1] = g;
        row[pxOffset + 2] = b;
      }
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Simple CRC32 implementation for PNG chunks
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach((size) => {
  const pngBuffer = createPngBuffer(size, size);
  const filePath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated ${filePath} (${size}x${size})`);
});
