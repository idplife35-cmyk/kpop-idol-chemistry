// Find what 400 responses come on a generator page (mobile)
import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();
const errs = [];
page.on('response', r => {
  const u = r.url(); const s = r.status();
  if (s >= 400) errs.push({ status: s, url: u });
});
await page.goto('https://kpopnamegenerator.com/bts-name-generator/', { waitUntil: 'networkidle', timeout: 30000 });
console.log('all 4xx/5xx:');
for (const e of errs) console.log(e.status, e.url);
await browser.close();
