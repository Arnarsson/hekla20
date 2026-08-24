/**
 * Drop unreferenced originals from the build.
 *
 * Importing an image in a data file makes Vite emit the original file into
 * dist/_astro alongside the optimised WebP derivatives, even though nothing
 * in the built HTML ever points at it. That is roughly 2.5 MB of files that
 * ship to the edge and are never requested.
 *
 * This walks every built HTML, CSS and JS file, collects the asset names they
 * actually reference, and deletes the image files in dist/_astro that no one
 * asked for. It only ever removes image files, and only from _astro.
 */
import { readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const DIST = 'dist';
const ASSETS = join(DIST, '_astro');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const referenced = new Set();
for (const file of walk(DIST)) {
  if (!['.html', '.css', '.js', '.xml'].includes(extname(file))) continue;
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif|gif|svg)/g)) {
    referenced.add(match[0]);
  }
}

let removed = 0;
let bytes = 0;
for (const file of readdirSync(ASSETS)) {
  if (!IMAGE_EXT.has(extname(file))) continue;
  if (referenced.has(basename(file))) continue;
  bytes += statSync(join(ASSETS, file)).size;
  unlinkSync(join(ASSETS, file));
  removed++;
}

console.log(
  removed
    ? `[prune] Removed ${removed} unreferenced image file(s), ${(bytes / 1024 / 1024).toFixed(2)} MB.`
    : '[prune] Nothing unreferenced to remove.',
);
