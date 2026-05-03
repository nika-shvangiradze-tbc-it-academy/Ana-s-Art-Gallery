/**
 * 1) Re-compress JPEGs in place (bounded max width) — massively cuts Lighthouse payloads.
 * 2) Generates WebP variants alongside:
 *    - ana-gallery/: {name}-thumb.webp + {name}.webp
 *    - landing/: {name}.webp
 *    - dolls/: {name}-thumb.webp + {name}.webp
 *
 * Run: npm run optimize-images
 */
import { readdir } from 'node:fs/promises';
import { rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const QUALITY_WEBP = 82;
const QUALITY_JPEG = 82;
const DOLLS_FULL = 900;
const DOLLS_THUMB = 560;
const GALLERY_FULL = 1280;
const GALLERY_THUMB = 520;
const LANDING_MAX = 1920;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}

/** Max width stored in JPG + webp-full use same bounds */
function planFor(relPath) {
  const n = relPath.replace(/\\/g, '/').toLowerCase();
  if (n.includes('/ana-gallery/'))
    return { thumb: GALLERY_THUMB, full: GALLERY_FULL, thumbFile: true };
  if (n.includes('/dolls/')) return { thumb: DOLLS_THUMB, full: DOLLS_FULL, thumbFile: true };
  if (n.includes('/landing/')) return { full: LANDING_MAX, thumbFile: false };
  return { thumb: GALLERY_THUMB, full: 1600, thumbFile: true };
}

async function writeWebp(pipeline, absOut, label) {
  await pipeline.webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(absOut);
  console.log(`OK  ${label} → ${path.basename(absOut)}`);
}

/** Overwrite JPG with resized + mozjpeg compressed file */
async function overwriteOptimizedJpeg(abs, rel, maxWidth) {
  const tmp = `${abs}.optimize-tmp.${process.pid}.jpg`;
  await sharp(abs)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({
      quality: QUALITY_JPEG,
      mozjpeg: true,
    })
    .toFile(tmp);
  await unlink(abs);
  await rename(tmp, abs);
  console.log(`OK  JPEG recompressed ${rel} (≤${maxWidth}px, q=${QUALITY_JPEG})`);
}

async function main() {
  const all = await walk(publicDir);
  const jpgs = all.filter((f) => /\.jpe?g$/i.test(f) && !/-thumb\b/i.test(path.basename(f)));

  for (const abs of jpgs) {
    const rel = path.relative(publicDir, abs);
    const plan = planFor(rel);
    const stem = abs.replace(/\.jpe?g$/i, '');

    await overwriteOptimizedJpeg(abs, rel, plan.full);

    const base = sharp(abs).rotate();
    await writeWebp(
      base.clone().resize({
        width: plan.full,
        withoutEnlargement: true,
      }),
      `${stem}.webp`,
      `${rel} (full ≤${plan.full}px WebP)`,
    );

    if (plan.thumbFile && plan.thumb) {
      await writeWebp(
        sharp(abs).rotate().resize({
          width: plan.thumb,
          withoutEnlargement: true,
        }),
        `${stem}-thumb.webp`,
        `${rel} (thumb ${plan.thumb}px WebP)`,
      );
    }
  }

  if (!jpgs.length) console.log('No JPEG files found under public/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
