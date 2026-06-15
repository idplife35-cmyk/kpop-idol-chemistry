// Verify PWA banner condition: should only show after a result is generated
import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true });

// Fresh context (no shared storage)
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();
await page.goto('https://kpopnamegenerator.com/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(6000);
const visible = await page.locator('#pwa-install-banner:not([hidden])').count();
const hiddenAttr = await page.evaluate(() => {
  const el = document.getElementById('pwa-install-banner');
  return el ? { exists: true, hidden: el.hasAttribute('hidden'), html: el.outerHTML.slice(0, 200) } : { exists: false };
});
console.log('After visiting index with NO result generated:');
console.log(' visible:', visible, ' attr:', hiddenAttr);
await ctx.close();
await browser.close();
