import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const pages = ['index', 'lead-agent', 'workshops', 'build-agent', 'custom', 'undo', 'privacy'];
const out = process.argv[2] ?? 'shots';
mkdirSync(out, { recursive: true });

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? '/usr/sbin/chromium';
const browser = await chromium.launch({ executablePath });
const problems = [];

for (const [label, viewport] of [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  /* Google Fonts is not reachable from the build sandbox; let it fail fast
     instead of hanging the run. Inter is not installed here either way, so
     these shots show the fallback face. */
  const isBlockedFont = (url) => /\/\/fonts\.(googleapis|gstatic)\.com\//.test(url);
  await page.route('**://fonts.googleapis.com/**', (r) => r.abort());
  await page.route('**://fonts.gstatic.com/**', (r) => r.abort());

  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().startsWith('Failed to load resource: net::ERR_FAILED')) {
      problems.push(`console: ${m.text()}`);
    }
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    if (!isBlockedFont(r.url())) problems.push(`request failed: ${r.url()}`);
  });
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });

  for (const name of pages) {
    await page.goto(`http://localhost:4321/${name}.html`, { waitUntil: 'load', timeout: 15000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${label}-${name}.png`, fullPage: true });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) problems.push(`${label}/${name}: page scrolls sideways by ${overflow}px`);
  }
  await ctx.close();
}

await browser.close();
console.log(problems.length ? 'PROBLEMS:\n' + [...new Set(problems)].join('\n') : 'Clean: no console errors, no failed requests, no horizontal overflow.');
if (problems.length) process.exitCode = 1;
