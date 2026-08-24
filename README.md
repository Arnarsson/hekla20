# hekla.cc

The HEKLA marketing site. Astro, static output, deployed on Vercel.

Rebuilt from the `hekla-dist` design handoff. Same pages, same copy, same
visual register, with the duplication taken out and the assets made sane.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output into dist/
npm run preview  # serve the built output
```

Node 20 or newer.

---

## Where things live

```
src/
  data/          All copy and structure. Start here.
    site.ts      Navigation, footer, ticker, company details.
    products.ts  Every product: card copy, page copy, diagrams, facts.
    home.ts      Front page copy.
  components/    One job each. PhotoMat, FlowDiagram, ProductCard, ...
  layouts/       BaseLayout (the shell) and ProductLayout (every product page).
  pages/         Routes. [product].astro generates all five product pages.
  scripts/       Client-side behaviour, one file per behaviour.
  styles/        tokens.css, base.css, utilities.css. Imported once, by BaseLayout.
  assets/photos/ Still photography. Optimised at build time by astro:assets.
media-src/       Animated GIF masters. Encoded to video by `npm run media`.
public/          Served as-is: favicon, og image, robots.txt, encoded video.
```

### Adding or editing a product

Everything a product needs is one entry in `src/data/products.ts`. The front
page card, the crumb number, the route, the page and the sitemap entry are all
derived from it.

- Give it a `page` object and it gets a detail page at `/<slug>`.
- Give it `page: null` and it appears in the rail but links to the contact form.
- Set `railHidden: true` to keep it off the front page, as UNDO is.

The `→ 04 / 06` crumb is computed from the rail, so the numerator and the
denominator cannot disagree with what the front page actually shows.

### Adding a flow diagram

Write the steps, not the coordinates:

```ts
diagram: {
  summary: 'A sentence describing the whole flow, for screen readers.',
  tag: 'Flow · Something',
  meta: 'from 75.000 kr',
  steps: [
    { stamp: 'WEEK 1', label: 'Process mapped', sub: 'as it actually runs' },
    { stamp: 'WEEK 2', label: 'Agent built', sub: 'fixed scope', accent: true },
  ],
}
```

`FlowDiagram.astro` computes the geometry from the number of steps. One step
per diagram gets `accent: true` and turns violet. `dashedIn: true` draws the
arrow into that step as dashed, which is how handover is drawn.

---

## Photography and motion

Still photographs go in `src/assets/photos/` and are imported in the data
files. Astro emits WebP at several widths and writes the `srcset`.

Animated clips are different. The handoff shipped 16.6 MB of animated GIF,
which is most of what the old site weighed. The masters live in `media-src/`
and `npm run media` encodes each one to MP4, WebM and a poster frame:

```
16.2 MB of GIF  ->  1.6 MB of video and posters (90% smaller)
```

A browser downloads one of the two video formats, so the real saving is closer
to 95%. To add a clip, drop the GIF in `media-src/`, run `npm run media`, and
reference it as `{ kind: 'motion', name: '<filename without extension>' }`.

Clips never autoplay on load. They start when they scroll into view, pause
when they leave, and never play at all under `prefers-reduced-motion`, where
the poster frame stands in as a still photograph.

Each media entry declares `monogram: 'paper'` when the top-left corner of the
image is dark enough that a black H would disappear into it.

---

## The contact form

With `PUBLIC_FORM_ENDPOINT` set, the form POSTs JSON to it:

```json
{ "name": "...", "email": "...", "company": "...", "message": "..." }
```

With no endpoint set, it opens the visitor's mail client with every field
filled in. It never claims to have sent something it did not send. Copy
`.env.example` to `.env` to set it locally; on Vercel it is an environment
variable on the project.

---

## Deployment

Vercel, static. `vercel.json` holds `cleanUrls` and the redirects from the
retired `/consultancy`, `/ventures`, `/rally`, `/flint` and `/jobefterjob`
routes. Astro builds with `format: 'file'`, so `/lead-agent` is served from
`lead-agent.html` with no redirect hop.

`npm run build` is the build command, `dist` is the output directory. Vercel
detects both from the framework.

---

## House rules the code follows

From the HEKLA design system, in case a future change is tempted to break one:

- One accent at a time. Violet is the eruption, around 10% of a composition
  and never more than three uses on a landing page. Moss is live states only,
  never a text colour on light grounds, never a headline.
- Five fixed weight roles, never mixed: 200 display, 400 body, 600 structure,
  900 emphasis, 900 italic for wordmarks only. `.brandname` is the wordmark
  register and never sets a sentence.
- The 10 degree slant appears three to six times per composition, and never on
  type that has to be read.
- The arrow is the only ornament. It points at actions. It is not a bullet.
- Flat backgrounds. No gradients, no glassmorphism, no shadows on cards.
- Square corners, 1px borders.
- No em dashes or en dashes anywhere, in copy or in code comments.
- No emoji.
