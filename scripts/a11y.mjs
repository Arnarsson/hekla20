import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const pages = ['index', 'lead-agent', 'workshops', 'build-agent', 'custom', 'undo', 'privacy'];
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? '/usr/sbin/chromium';
const browser = await chromium.launch({ executablePath });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
await page.route('**://fonts.g*/**', (r) => r.abort());

let total = 0;
for (const name of pages) {
  await page.goto(`http://localhost:4321/${name}.html`, { waitUntil: 'load' });
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  total += violations.length;
  if (violations.length) {
    console.log(`\n${name}.html`);
    for (const v of violations) {
      console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes) {
        console.log(`      ${node.target.join(' ')}: ${node.failureSummary}`);
        console.log(`      ${node.html.slice(0, 180)}`);
      }
    }
  }
}
await browser.close();
console.log(total === 0 ? '\nNo WCAG 2.1 AA violations found by axe on any page.' : `\n${total} violation type(s) across the site.`);
if (total > 0) process.exitCode = 1;
