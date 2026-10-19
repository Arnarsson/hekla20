/**
 * Scroll reveal. One fade and rise, once per element.
 *
 * Content is visible in the HTML and stays visible if this file never runs.
 * The hidden state is only ever added here, and only to elements that are
 * currently below the fold, so a script error or a slow bundle can never
 * leave a section blank.
 *
 * It fires a little inside the viewport, so the reader is looking when it
 * moves, and revealed siblings in one list are staggered 60ms apart.
 */
const STAGGER_MS = 60;
const MAX_STEPS = 5;

export function initReveal(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window) || items.length === 0) return;

  const show = (el: HTMLElement) => {
    if (!el.classList.contains('is-pending')) return;
    el.classList.remove('is-pending');
    el.classList.add('is-in');
    // Drop the stagger once it has played, so later transitions are not delayed.
    el.addEventListener('transitionend', () => el.style.removeProperty('--reveal-delay'), { once: true });
  };

  /* Elements that arrive in the same frame share a batch; their order in the
     batch is their order down the page, which sets the stagger. */
  const reveal = (batch: HTMLElement[]) => {
    batch.forEach((el, i) => {
      if (i > 0) el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STEPS) * STAGGER_MS}ms`);
      show(el);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      for (const el of batch) observer.unobserve(el);
      reveal(batch);
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' },
  );

  for (const el of items) {
    if (el.getBoundingClientRect().top <= window.innerHeight) continue;
    el.classList.add('is-pending');
    observer.observe(el);
  }

  /* Safety net. If the observer ever misses one, the next scroll reveals
     anything still pending that has come on screen. */
  window.addEventListener(
    'scroll',
    () => {
      for (const el of document.querySelectorAll<HTMLElement>('[data-reveal].is-pending')) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) show(el);
      }
    },
    { passive: true },
  );
}
