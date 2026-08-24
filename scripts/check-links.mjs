/**
 * Link and anchor check over the built output.
 *
 * Vercel's cleanUrls serves /lead-agent from lead-agent.html, so an internal
 * link is valid if dist/<path>.html exists. In-page anchors must resolve to a
 * real id on the page they point at.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const htmlFiles = readdirSync(DIST).filter((f) => f.endsWith('.html'));
const pages = new Map(htmlFiles.map((f) => [f.replace(/\.html$/, ''), readFileSync(join(DIST, f), 'utf8')]));

const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const ids = new Map([...pages].map(([name, html]) => [name, idsOf(html)]));

const problems = [];
let checked = 0;

for (const [name, html] of pages) {
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    /* Static assets are files, not routes. */
    if (/\.(svg|png|jpe?g|webp|avif|gif|css|js|xml|txt|ico|mp4|webm)$/i.test(href)) continue;
    checked++;

    const [rawPath, hash] = href.split('#');
    const target = rawPath === '' ? name : rawPath.replace(/^\//, '').replace(/\.html$/, '') || 'index';

    if (!pages.has(target)) {
      problems.push(`${name}.html -> ${href} (no such page)`);
      continue;
    }
    if (hash && !ids.get(target).has(hash)) {
      problems.push(`${name}.html -> ${href} (no #${hash} on ${target})`);
    }
  }
}

/* Every image needs an alt attribute, even an empty one. */
for (const [name, html] of pages) {
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    /* alt="" and a bare alt both count. Only a missing attribute is a fault. */
    if (!/\salt(=|[\s/>])/.test(img[0])) problems.push(`${name}.html: <img> with no alt: ${img[0].slice(0, 90)}`);
  }
}

console.log(`Checked ${checked} internal links across ${pages.size} pages.`);
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'All internal links and anchors resolve. Every image has alt text.');
