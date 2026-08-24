import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [label, viewport] of [['desktop', {width:1440,height:900}], ['mobile', {width:390,height:844}]]) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.route('**://fonts.g*/**', r => r.abort());
  await page.goto('http://localhost:4321/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/top-${label}.png` });
  await ctx.close();
}
await browser.close();
console.log('done');
