/**
 * Scroll reveal. One fade and rise, 200ms, once per element.
 *
 * Content is visible in the HTML and stays visible if this file never runs.
 * The hidden state is only ever added here, and only to elements that are
 * currently below the fold, so a script error or a slow bundle can never
 * leave a section blank.
 */
export function initReveal(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window) || items.length === 0) return;

  const show = (el: HTMLElement) => {
    el.classList.remove('is-pending');
    el.classList.add('is-in');
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.05, rootMargin: '0px 0px 120px 0px' },
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
        if (el.getBoundingClientRect().top < window.innerHeight + 120) show(el);
      }
    },
    { passive: true },
  );
}
