#!/usr/bin/env node
/**
 * Playwright-based GA4 home scraper — fallback when GA Data API isn't set up yet.
 *
 * Setup:
 *   cd analytics && npm install playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   node ga_scraper.mjs                       # uses GA4_HOME_URL env or default
 *   GA4_HOME_URL=https://analytics.google.com/analytics/web/#/p123456789/reports/intelligenthome \
 *     node ga_scraper.mjs
 *
 * Login: on first run, the launched browser pauses for manual Google login.
 * After login, a persistent context is saved to analytics/.playwright-profile so
 * subsequent runs are non-interactive.
 *
 * Output: analytics/daily/YYYY-MM-DD-scraped.json + screenshot.
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME_URL = process.env.GA4_HOME_URL
  || 'https://analytics.google.com/analytics/web/#/analytics/intelligenthome';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch (err) {
  console.error('Playwright not installed. Run: cd analytics && npm install playwright && npx playwright install chromium');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const outDir = path.join(__dirname, 'daily');
await fs.mkdir(outDir, { recursive: true });

const userDataDir = path.join(__dirname, '.playwright-profile');
const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  viewport: { width: 1440, height: 900 },
});

const page = await ctx.newPage();
await page.goto(HOME_URL, { waitUntil: 'domcontentloaded' });
console.log('[ga_scraper] If a login screen appears, sign in. The window will save your session.');

await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(5000);

const screenshotPath = path.join(outDir, `${today}-ga-home.png`);
await page.screenshot({ path: screenshotPath, fullPage: true });
console.log(`[ga_scraper] Screenshot saved: ${screenshotPath}`);

// Best-effort DOM scrape of the home overview cards. GA's DOM changes; if these
// selectors stop working, swap to OCR on the screenshot or migrate to ga_client.mjs.
const data = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('div[role="figure"], div.value-card'));
  return cards.map((c) => c.innerText).slice(0, 12);
});

const snapshot = {
  scraped_at: new Date().toISOString(),
  url: HOME_URL,
  screenshot: path.basename(screenshotPath),
  raw_cards: data,
  note: 'Manual review required. Prefer ga_client.mjs for structured data.',
};

const jsonPath = path.join(outDir, `${today}-scraped.json`);
await fs.writeFile(jsonPath, JSON.stringify(snapshot, null, 2));
console.log(`[ga_scraper] Wrote ${jsonPath}`);

await ctx.close();
