import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { ulid } from "ulid";
import axios from "axios";

// root directory for storing uploaded images
const UPLOAD_ROOT = path.join(process.cwd(), "server", "public", "uploads");

/**
 * Save an image from a Buffer (Node.js binary container):
 * - Auto-rotate based on EXIF
 * - Resize to max 1600px (keep aspect ratio, no upscaling)
 * - Compress and convert to JPG (quality = 80, mozjpeg enabled)
 * - Save to disk with a ULID filename
 * - Return relative URL (e.g. /uploads/products/01J...ABC.jpg)
 */
export async function saveImageFromBuffer(buffer, subdir) {
  const dir = path.join(UPLOAD_ROOT, subdir);
  await fs.mkdir(dir, { recursive: true });

  const id = ulid();
  const filename = `${id}.jpg`;
  const filepath = path.join(dir, filename);

  await sharp(buffer)
    .rotate() //auto-orient based on EXIF
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(filepath);

  // returns a relative path that can be accessed by the front end
  return `/uploads/${subdir}/${filename}`;
}

/**
 * Save an image from a remote URL:
 * - Fetch image via axios (as ArrayBuffer)
 * - Convert to Buffer and reuse saveImageFromBuffer()
 */
export async function saveImageFromUrl(url, subdir) {
  // fetch remote image as raw binary data (ArrayBuffer)
  const res = await axios.get(url, { responseType: "arraybuffer" });

  // convert to Node.js Buffer and save with sharp processing
  return saveImageFromBuffer(Buffer.from(res.data), subdir);
}
