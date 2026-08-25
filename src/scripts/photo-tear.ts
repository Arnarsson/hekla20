/**
 * The photograph tear.
 *
 * The same gesture the masthead wordmark makes, on the one photograph that
 * declares `tear: true`. Seven horizontal bands, two or three of them shifted
 * a couple of pixels, for a quarter of a second every twenty seconds or so,
 * then whole again.
 *
 * A single element cannot be torn into independently moving bands, so the
 * tear is painted onto a canvas laid over the image and the canvas is shown
 * only while it lasts. The photograph underneath is never touched, which is
 * why it snaps back perfectly: there is nothing to snap back.
 *
 * One glitching element per screen is the rule. This takes the same lock the
 * wordmark holds, so the masthead and the photograph can never tear at the
 * same moment.
 *
 * Nothing here runs under prefers-reduced-motion, and nothing runs while the
 * mat is off screen or the tab is in the background.
 */

const EVERY = 21_000; // ms between tears, offset from the wordmark's twenty
const JITTER = 5_000; // plus or minus
const BANDS = 7;
const DUR_MIN = 180;
const DUR_MAX = 280;
/* Seven pixels at the size the mat paints. Twenty slices faces off and reads
   as a broken image; two is not there at all on a photograph, where there is
   no crisp letterform for the eye to catch the break against. */
const SHIFT = 7;
/* Never less than half of it. A displacement drawn uniformly from the whole
   range lands near zero half the time, and a band that does not move is a
   band that was not torn. */
const SHIFT_MIN = 0.5;
const MAX_DPR = 2;

interface GlitchLock {
  busy: boolean;
}

declare global {
  interface Window {
    __heklaGlitch?: GlitchLock;
  }
}

type Source = HTMLVideoElement | HTMLImageElement;

/** Whether this source has pixels to draw yet. */
function isReady(source: Source): boolean {
  return source instanceof HTMLVideoElement ? source.readyState >= 2 : source.complete && source.naturalWidth > 0;
}

function intrinsic(source: Source): { width: number; height: number } {
  return source instanceof HTMLVideoElement
    ? { width: source.videoWidth, height: source.videoHeight }
    : { width: source.naturalWidth, height: source.naturalHeight };
}

export function initPhotoTear(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.querySelector<HTMLCanvasElement>('.mat__tear');
  const source = canvas?.parentElement?.querySelector<Source>('.mat__media');
  if (!canvas || !source) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const lock: GlitchLock = (window.__heklaGlitch ??= { busy: false });

  let onScreen = false;
  let timer: number | undefined;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: '0px' },
    ).observe(canvas.parentElement as Element);
  } else {
    onScreen = true;
  }

  /* Lay the canvas exactly over the image. The mat's padding differs by
     variant, so this is measured rather than assumed. */
  const place = (): { width: number; height: number } => {
    const width = source.clientWidth;
    const height = source.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    canvas.style.left = `${source.offsetLeft}px`;
    canvas.style.top = `${source.offsetTop}px`;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { width, height };
  };

  /* object-fit: cover, worked out by hand, because canvas has no such thing. */
  const cover = (box: { width: number; height: number }) => {
    const { width: sw, height: sh } = intrinsic(source);
    const scale = Math.max(box.width / sw, box.height / sh);
    const w = sw * scale;
    const h = sh * scale;
    return { x: (box.width - w) / 2, y: (box.height - h) / 2, w, h };
  };

  /* How far one band goes, in either direction. */
  const shift = (): number =>
    (Math.random() < 0.5 ? -1 : 1) * SHIFT * (SHIFT_MIN + Math.random() * (1 - SHIFT_MIN));

  /* Two to three of the seven bands move at a time. */
  const pick = (): number[] => {
    const chosen = new Set<number>();
    const count = 2 + Math.floor(Math.random() * 2);
    while (chosen.size < count) chosen.add(Math.floor(Math.random() * BANDS));
    return [...chosen];
  };

  const tear = () => {
    /* If something else holds the lock, or there is nothing to draw yet, take
       the next opening rather than going quiet for another twenty seconds. */
    if (lock.busy || document.hidden || !onScreen || !isReady(source)) {
      window.clearTimeout(timer);
      timer = window.setTimeout(tear, 300 + Math.random() * 500);
      return;
    }
    lock.busy = true;

    const box = place();
    const fit = cover(box);
    const band = box.height / BANDS;
    const ends = performance.now() + DUR_MIN + Math.random() * (DUR_MAX - DUR_MIN);

    canvas.style.visibility = 'visible';

    let last = 0;
    let active = pick();
    let offsets = active.map(shift);

    const frame = (now: number) => {
      if (now >= ends) {
        canvas.style.visibility = 'hidden';
        ctx.clearRect(0, 0, box.width, box.height);
        lock.busy = false;
        schedule();
        return;
      }

      if (now - last > 40 + Math.random() * 20) {
        last = now;
        if (Math.random() < 0.3) active = pick();
        offsets = active.map(shift);
      }

      ctx.clearRect(0, 0, box.width, box.height);
      for (let i = 0; i < BANDS; i += 1) {
        const at = active.indexOf(i);
        const shift = at === -1 ? 0 : offsets[at];
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, i * band, box.width, band);
        ctx.clip();
        ctx.drawImage(source, fit.x + shift, fit.y, fit.w, fit.h);
        ctx.restore();
      }

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(tear, EVERY + (Math.random() * JITTER * 2 - JITTER));
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(timer);
    else schedule();
  });

  schedule();
}
