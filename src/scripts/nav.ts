/**
 * The phone menu.
 *
 * Without this file the nav is a sideways-scrolling row under the masthead,
 * which works everywhere. With it, phones get a toggle and a drop-down panel.
 * Desktop CSS ignores the attributes set here, so nothing changes there.
 */
export function initNav(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const toggle = header?.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.getElementById('site-menu');
  if (!header || !toggle || !nav) return;

  header.setAttribute('data-menu', '');

  const setOpen = (open: boolean) => {
    header.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));

  /* In-page links (#products on the front page) must close the panel too. */
  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.hasAttribute('data-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (header.hasAttribute('data-open') && !header.contains(event.target as Node)) setOpen(false);
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
