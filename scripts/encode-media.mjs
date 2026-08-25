/**
 * Encode the masters in media-src/ into web video.
 *
 * Two kinds of master live there and both come out the same shape.
 *
 * An animated GIF is transcoded frame for frame. Animated GIFs are the single
 * heaviest thing on the old site: five of them weigh 16.6 MB. The same frames
 * as H.264 and VP9 weigh a fraction of that and decode on the GPU instead of
 * the main thread.
 *
 * A still photograph is given the slow push instead: the frame creeps in by
 * PUSH over PUSH_SECONDS, then creeps back out again. The clips this site
 * inherited animate exactly that way, and playing it out and back means the
 * loop closes on itself rather than snapping at the seam.
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
import { join, parse, extname } from 'node:path';
import sharp from 'sharp';

const SRC = 'media-src';
const OUT = join('public', 'media');

/* The push, for still masters. Ten percent over three seconds is the drift the
   inherited clips have. More reads as a zoom, which is a different gesture.

   The ceiling on it is the master, not taste: a push crops from every edge,
   and on a portrait the edge that matters is the top. Measure where the top
   of the highest head sits before raising this, because the crop line at full
   push lands at (1 - 1/(1 + PUSH)) / 2 of the height, plus the drift. */
const PUSH = 0.1;
const PUSH_SECONDS = 3;
/* The push travels rather than sitting in the middle of the frame, and it
   travels along the house angle: the same ten degrees the mat's bottom edge
   is cut at, rising to the right. DRIFT is how far, as a fraction of the
   master's width. Two percent is felt rather than seen, which is the point. */
const DRIFT = 0.02;
const SLANT = Math.tan((10 * Math.PI) / 180);
const FPS = 20;
/* Painted at 380 CSS pixels wide at most, so this is the two times asset. */
const WIDTH = 760;

const run = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
const kb = (p) => (statSync(p).size / 1024).toFixed(0).padStart(6) + ' KB';
const even = (n) => Math.round(n / 2) * 2;

if (!existsSync(SRC)) {
  console.error(`[media] No ${SRC}/ directory. Nothing to encode.`);
  process.exit(0);
}
mkdirSync(OUT, { recursive: true });

const STILLS = new Set(['.jpg', '.jpeg', '.png']);
const masters = readdirSync(SRC)
  .filter((f) => extname(f).toLowerCase() === '.gif' || STILLS.has(extname(f).toLowerCase()))
  .sort();

if (!masters.length) {
  console.error(`[media] No .gif or .jpg masters in ${SRC}/.`);
  process.exit(0);
}

console.log(`[media] Encoding ${masters.length} master(s) from ${SRC}/ into ${OUT}/\n`);

/**
 * The push, as a filtergraph.
 *
 * zoompan works in whole source pixels, so a 760 pixel wide crop would step
 * the frame across in visible jumps. Scaling the master up first makes each
 * step a quarter of a pixel at the output size, which reads as smooth.
 *
 * The graph then plays itself backwards and joins the two halves. The reverse
 * drops its own first frame, which is the forward half's last, so the turn
 * does not sit on a doubled frame.
 *
 * The crop travels left and down over the push, which is the frame travelling
 * up and to the right: the house angle. Left and down is also the safe
 * direction on a group photograph, since it eats into empty ceiling and open
 * space rather than into whoever stands at the edge.
 */
function pushGraph(width, height) {
  const frames = PUSH_SECONDS * FPS;
  const step = `on/${frames - 1}`;
  return [
    `[0:v]scale=${width * 4}:-1,`,
    `zoompan=z='1+${PUSH}*${step}':d=1`,
    `:x='iw/2-(iw/zoom/2)-iw*${DRIFT}*${step}'`,
    `:y='ih/2-(ih/zoom/2)+iw*${(DRIFT * SLANT).toFixed(6)}*${step}'`,
    `:s=${width}x${height}:fps=${FPS}[v];`,
    `[v]split[a][b];`,
    `[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];`,
    `[a][r]concat=n=2:v=1:a=0[out]`,
  ].join('');
}

/* The savings line only means something for the GIF masters, which is what it
   was written to justify. A still master weighs less than the clip made from
   it, and always will. */
let gifBefore = 0;
let gifAfter = 0;
let emitted = 0;

for (const master of masters) {
  const src = join(SRC, master);
  const { name } = parse(master);
  const mp4 = join(OUT, `${name}.mp4`);
  const webm = join(OUT, `${name}.webm`);
  const poster = join(OUT, `${name}.jpg`);
  const isStill = STILLS.has(extname(master).toLowerCase());

  if (isStill) {
    const { width, height } = await sharp(src).metadata();
    const w = WIDTH;
    const h = even((height / width) * WIDTH);
    const graph = pushGraph(w, h);
    const input = ['-loop', '1', '-framerate', String(FPS), '-t', String(PUSH_SECONDS), '-i', src];

    run([...input, '-filter_complex', graph, '-map', '[out]', '-movflags', '+faststart',
         '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-an', mp4]);

    run([...input, '-filter_complex', graph, '-map', '[out]', '-c:v', 'libvpx-vp9',
         '-crf', '36', '-b:v', '0', '-row-mt', '1', '-an', webm]);

    /* The poster is the frame the push starts from, so a visitor who never
       sees it move sees the photograph itself. */
    run(['-i', src, '-vframes', '1', '-vf', `scale=${w}:${h}`, '-q:v', '4', poster]);
  } else {
    // Even dimensions are required by yuv420p. Scale rounds each side down to even.
    const evenScale = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

    run(['-i', src, '-movflags', '+faststart', '-pix_fmt', 'yuv420p',
         '-vf', evenScale, '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-an', mp4]);

    run(['-i', src, '-vf', evenScale, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0',
         '-row-mt', '1', '-an', webm]);

    run(['-i', src, '-vframes', '1', '-vf', evenScale, '-q:v', '4', poster]);
  }

  const out = statSync(mp4).size + statSync(webm).size + statSync(poster).size;
  emitted += out;
  if (!isStill) {
    gifBefore += statSync(src).size;
    gifAfter += out;
  }

  const kind = isStill ? 'still' : '  gif';
  console.log(`  ${name.padEnd(20)} ${kind} ${kb(src)}  ->  mp4 ${kb(mp4)}  webm ${kb(webm)}  poster ${kb(poster)}`);
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(`\n[media] ${mb(emitted)} MB of video and posters in ${OUT}/.`);
if (gifBefore) {
  const pct = (100 - (gifAfter / gifBefore) * 100).toFixed(1);
  console.log(`[media] ${mb(gifBefore)} MB of GIF -> ${mb(gifAfter)} MB (${pct}% smaller).`);
}
