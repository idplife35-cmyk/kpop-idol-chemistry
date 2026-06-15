// Debug: capture full pageerror stack and any 4xx/5xx responses on a single generator page
import { chromium, devices } from 'playwright';

const targets = ['/', '/bts-name-generator/', '/aespa-name-generator/'];
const BASE = 'https://kpopnamegenerator.com';

const browser = await chromium.launch({ headless: true });
for (const viewportName of ['pc', 'mobile']) {
  console.log('\n##### viewport:', viewportName);
  const ctx = await browser.newContext(
    viewportName === 'mobile' ? { ...devices['iPhone 14'] } : { viewport: { width: 1440, height: 900 } }
  );
  for (const t of targets) {
    const page = await ctx.newPage();
    const errors = [];
    const responses = [];
    page.on('pageerror', e => {
      errors.push({ message: e.message, stack: (e.stack || '').slice(0, 600) });
    });
    page.on('console', m => {
      if (m.type() === 'error') errors.push({ console: m.text() });
    });
    page.on('response', r => {
      const s = r.status();
      const u = r.url();
      if (s >= 400 && !/google|doubleclick|adservice|fundingchoices|adtrafficquality|pagead2|adsbygoogle/.test(u)) {
        responses.push({ status: s, url: u });
      }
    });
    try {
      await page.goto(BASE + t, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
    } catch (e) { errors.push({ nav: e.message }); }
    console.log('\n--- target:', t);
    console.log('pageerrors:');
    for (const e of errors) console.log(JSON.stringify(e).slice(0, 700));
    console.log('non-ad 4xx/5xx responses:');
    for (const r of responses) console.log(' ', r.status, r.url);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
