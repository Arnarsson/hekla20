/**
 * The product rail.
 *
 * A horizontal scroll-snap track with dots and arrows. Everything works
 * without this file: the track is a native scroller and keyboard-focusable.
 * The controls are added here rather than in the markup, because a control
 * that cannot work without JavaScript should not exist before it can.
 */
export function initRail(): void {
  const track = document.querySelector<HTMLElement>('[data-rail-track]');
  const dots = document.querySelector<HTMLElement>('[data-rail-dots]');
  const prev = document.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = document.querySelector<HTMLButtonElement>('[data-rail-next]');
  if (!track || !dots || !prev || !next) return;

  const cards = Array.from(track.children) as HTMLElement[];
  if (cards.length < 2) return;

  const scrollToCard = (i: number) => {
    track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
  };

  cards.forEach((card, i) => {
    const name = card.querySelector('h3')?.textContent?.trim() ?? `item ${i + 1}`;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'rail__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Show ${name}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dots.appendChild(dot);
  });

  const cardStride = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);

  /* Wraps at both ends, so the arrows never dead-end on a rail this short. */
  const step = (direction: 1 | -1) => {
    const max = track.scrollWidth - track.clientWidth;
    let to = track.scrollLeft + direction * cardStride();
    if (direction > 0 && track.scrollLeft >= max - 8) to = 0;
    else if (direction < 0 && track.scrollLeft <= 8) to = max;
    track.scrollTo({ left: to, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));

  const sync = () => {
    const i = Math.round(track.scrollLeft / cardStride());
    Array.from(dots.children).forEach((dot, n) => {
      dot.setAttribute('aria-selected', n === i ? 'true' : 'false');
    });
  };

  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync);
  sync();
}
