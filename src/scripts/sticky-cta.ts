/**
 * Tucks the phone CTA bar away while something on screen already offers the
 * same step: an element marked data-cta-watch (the facts box CTA, the closing
 * band) or the footer. Transform only, so nothing on the page moves.
 */
export function initStickyCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  if (!bar || !('IntersectionObserver' in window)) return;

  const watched = Array.from(document.querySelectorAll<HTMLElement>('[data-cta-watch], .site-footer'));
  const visible = new Set<Element>();

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      bar.classList.toggle('is-tucked', visible.size > 0);
    },
    { threshold: 0.01 },
  );

  watched.forEach((el) => io.observe(el));
}
