/**
 * Encode the animated GIF masters in media-src/ into web video.
 *
 * Animated GIFs are the single heaviest thing on the old site: five of them
 * weigh 16.6 MB. The same frames as H.264 and VP9 weigh a fraction of that
 * and decode on the GPU instead of the main thread.
 *
 * Output, per master, into public/media/:
 *   <name>.mp4     H.264, yuv420p, faststart  (Safari, everything)
 *   <name>.webm    VP9                        (Chrome, Firefox)
 *   <name>.jpg     first frame                (poster, LCP candidate)
 *
 * Run: npm run media
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'media-src';
const OUT = join('public', 'media');

const run = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
const kb = (p) => (statSync(p).size / 1024).toFixed(0).padStart(6) + ' KB';

if (!existsSync(SRC)) {
  console.error(`[media] No ${SRC}/ directory. Nothing to encode.`);
  process.exit(0);
}
mkdirSync(OUT, { recursive: true });

const gifs = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.gif')).sort();
if (!gifs.length) {
  console.error(`[media] No .gif files in ${SRC}/.`);
  process.exit(0);
}

console.log(`[media] Encoding ${gifs.length} master(s) from ${SRC}/ into ${OUT}/\n`);

let before = 0;
let after = 0;

for (const gif of gifs) {
  const src = join(SRC, gif);
  const { name } = parse(gif);
  const mp4 = join(OUT, `${name}.mp4`);
  const webm = join(OUT, `${name}.webm`);
  const poster = join(OUT, `${name}.jpg`);

  // Even dimensions are required by yuv420p. Scale rounds each side down to even.
  const evenScale = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

  run(['-i', src, '-movflags', '+faststart', '-pix_fmt', 'yuv420p',
       '-vf', evenScale, '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-an', mp4]);

  run(['-i', src, '-vf', evenScale, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0',
       '-row-mt', '1', '-an', webm]);

  run(['-i', src, '-vframes', '1', '-vf', evenScale, '-q:v', '4', poster]);

  before += statSync(src).size;
  after += statSync(mp4).size + statSync(webm).size + statSync(poster).size;

  console.log(`  ${name.padEnd(20)} gif ${kb(src)}  ->  mp4 ${kb(mp4)}  webm ${kb(webm)}  poster ${kb(poster)}`);
}

const pct = (100 - (after / before) * 100).toFixed(1);
console.log(`\n[media] ${(before / 1024 / 1024).toFixed(1)} MB of GIF -> ${(after / 1024 / 1024).toFixed(1)} MB of video and posters (${pct}% smaller).`);
