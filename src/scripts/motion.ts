/**
 * Motion clips.
 *
 * Every <video data-motion> ships with preload="none" and a poster frame, so
 * nothing but the poster is fetched until the clip is actually on screen.
 * When it scrolls in, it plays; when it scrolls out, it pauses and stops
 * costing anything. Under prefers-reduced-motion nothing ever plays and the
 * poster stands in as a still photograph.
 */
export function initMotion(): void {
  const clips = document.querySelectorAll<HTMLVideoElement>('video[data-motion]');
  if (clips.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!('IntersectionObserver' in window)) {
    for (const clip of clips) void clip.play().catch(() => {});
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const clip = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          /* Autoplay can still be refused (low power mode, for one). The
             poster stays on screen if it is, which is an acceptable still. */
          void clip.play().catch(() => {});
        } else if (!clip.paused) {
          clip.pause();
        }
      }
    },
    { rootMargin: '200px 0px' },
  );

  for (const clip of clips) observer.observe(clip);
}
