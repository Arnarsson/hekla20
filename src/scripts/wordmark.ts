/**
 * The wordmark tear.
 *
 * The masthead mark is sliced into seven horizontal bands and torn briefly,
 * roughly every twenty seconds, then snapped back perfectly whole. Offsets
 * are one to three pixels at a 26px mark: any larger and a wordmark at nav
 * size stops reading as a wordmark.
 *
 * One glitching element per screen is the rule, so this holds a shared lock
 * on window. If another effect is ever added it takes the same lock and the
 * two can never tear at the same moment.
 *
 * Nothing here runs under prefers-reduced-motion.
 */

const EVERY = 20_000; // ms between tears
const JITTER = 4_000; // plus or minus
const BANDS = 7;
const DUR_MIN = 220;
const DUR_MAX = 380;

interface GlitchLock {
  busy: boolean;
}

declare global {
  interface Window {
    __heklaGlitch?: GlitchLock;
  }
}

export function initWordmark(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const el = document.querySelector<HTMLElement>('.site-header .wordmark');
  if (!el) return;

  const text = el.textContent?.trim();
  if (!text) return;

  const lock: GlitchLock = (window.__heklaGlitch ??= { busy: false });

  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.display = 'inline-block';
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);

  /* Seven stacked copies, each clipped to one horizontal slice. The first is
     in normal flow so the element keeps its size; the rest are absolute. */
  el.innerHTML = Array.from({ length: BANDS }, (_, i) => {
    const top = ((i * 100) / BANDS).toFixed(3);
    const bottom = (((BANDS - 1 - i) * 100) / BANDS).toFixed(3);
    const position = i === 0 ? 'position:static' : 'position:absolute;inset:0;user-select:none';
    return `<span class="wm-band" aria-hidden="true" style="${position};display:block;will-change:transform;clip-path:inset(${top}% -10% ${bottom}% -10%)">${text}</span>`;
  }).join('');

  const bands = Array.from(el.querySelectorAll<HTMLElement>('.wm-band'));
  let timer: number | undefined;

  const settle = () => {
    for (const band of bands) {
      band.style.transition = 'transform .16s cubic-bezier(.05,.9,.1,1)';
      band.style.transform = 'translateX(0)';
    }
    window.setTimeout(() => {
      for (const band of bands) band.style.transition = 'none';
      lock.busy = false;
    }, 170);
  };

  /* Two to three of the seven bands move at a time. */
  const pick = (): number[] => {
    const chosen = new Set<number>();
    const count = 2 + Math.floor(Math.random() * 2);
    while (chosen.size < count) chosen.add(Math.floor(Math.random() * BANDS));
    return [...chosen];
  };

  const tear = () => {
    /* If something else holds the lock, take the next opening rather than
       losing this turn and going quiet for another twenty seconds. */
    if (lock.busy || document.hidden) {
      window.clearTimeout(timer);
      timer = window.setTimeout(tear, 300 + Math.random() * 500);
      return;
    }
    lock.busy = true;

    const ends = performance.now() + DUR_MIN + Math.random() * (DUR_MAX - DUR_MIN);
    let last = 0;
    let active = pick();

    const frame = (now: number) => {
      if (now >= ends) {
        settle();
        schedule();
        return;
      }
      if (now - last > 40 + Math.random() * 20) {
        last = now;
        if (Math.random() < 0.3) active = pick();
        bands.forEach((band, i) => {
          band.style.transition = 'none';
          band.style.transform = active.includes(i)
            ? `translateX(${Math.trunc((Math.random() * 2 - 1) * 3)}px)`
            : 'translateX(0)';
        });
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
