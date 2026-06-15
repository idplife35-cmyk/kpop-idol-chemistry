// Focused interactive verification: GeneratorForm + ShareCard + PWA banner
import { chromium, devices } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREEN_PC = join(__dirname, 'screenshots', 'pc');
const SCREEN_MB = join(__dirname, 'screenshots', 'mobile');
mkdirSync(SCREEN_PC, { recursive: true });
mkdirSync(SCREEN_MB, { recursive: true });

const BASE = 'https://kpopnamegenerator.com';
const SAMPLE = ['bts', 'blackpink', 'zerobaseone', 'aespa', 'twice'];

async function runFlow(page, slug, screenDir) {
  const r = { slug, gaEvents: [], notes: [], steps: {} };

  // Capture GA on init via addInitScript - already done by caller. Just verify queue exists.
  await page.evaluate(() => { window.__GA_EVENTS__ = window.__GA_EVENTS__ || []; });

  // Step 1: fill name
  try {
    const nameInput = page.locator('input#myName, input[name="myName"], input[type="text"]').first();
    await nameInput.fill('Alex', { timeout: 5000 });
    r.steps.fillName = 'ok';
  } catch (e) { r.steps.fillName = 'fail: ' + e.message; }

  // Step 2: select first idol member button — use IdolSelector module CSS class fragment
  try {
    let clicked = false;
    // The IdolSelector module class will hash like _memberButton_xxxxx_n
    const candidates = await page.locator('button[class*="memberButton"]').elementHandles();
    if (candidates.length) {
      try { await candidates[0].click({ timeout: 3000 }); clicked = true; } catch {}
    }
    if (!clicked) {
      // fallback: look for any button having both EN+KR spans
      const all = await page.locator('button:has(span):not([disabled])').elementHandles();
      for (const h of all.slice(0, 50)) {
        const txt = ((await h.innerText()) || '').trim();
        if (/[가-힣]/.test(txt) && /^[A-Z]/.test(txt)) {
          try { await h.click({ timeout: 1500 }); clicked = true; break; } catch {}
        }
      }
    }
    r.steps.selectIdol = clicked ? 'ok' : 'no-member-button-found';
  } catch (e) { r.steps.selectIdol = 'fail: ' + e.message; }

  // Step 3: click Generate
  try {
    const btn = page.getByRole('button', { name: /Generate Name/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 3000 });
    // Wait until enabled
    await page.waitForFunction(() => {
      const el = document.querySelector('.generate-btn');
      return el && !el.disabled;
    }, { timeout: 5000 }).catch(() => {});
    await btn.click({ timeout: 5000 });
    r.steps.clickGenerate = 'ok';
  } catch (e) { r.steps.clickGenerate = 'fail: ' + e.message; }

  await page.waitForTimeout(2000);
  try { await page.screenshot({ path: join(screenDir, `${slug}-result.png`), fullPage: false }); } catch {}

  // Collect GA events for name_generated
  const evts = await page.evaluate(() => window.__GA_EVENTS__ || []);
  r.gaEvents = evts;
  r.gaEventNames = evts.map(e => e.name);

  // Wait for PWA banner (4s timer)
  await page.waitForTimeout(4500);
  r.pwaBannerVisible = await page.locator('#pwa-install-banner:not([hidden])').count() > 0;
  r.pwaBannerHiddenAttr = await page.evaluate(() => {
    const el = document.getElementById('pwa-install-banner');
    return el ? el.hasAttribute('hidden') : null;
  });

  // Try to click Share button if visible to trigger result_shared event
  try {
    const shareCandidates = page.getByRole('button', { name: /share|copy|kakao|twitter/i });
    if (await shareCandidates.count()) {
      await shareCandidates.first().click({ timeout: 3000 });
      r.steps.clickShare = 'ok';
    } else {
      r.steps.clickShare = 'no-share-button';
    }
  } catch (e) { r.steps.clickShare = 'fail: ' + e.message; }
  await page.waitForTimeout(800);

  // Try VS challenge if button exists
  try {
    const vs = page.getByRole('button', { name: /challenge|vs/i });
    if (await vs.count()) {
      await vs.first().click({ timeout: 3000 });
      r.steps.clickVS = 'ok';
    } else {
      r.steps.clickVS = 'no-vs-button';
    }
  } catch (e) { r.steps.clickVS = 'fail: ' + e.message; }
  await page.waitForTimeout(500);

  // Try favorite toggle
  try {
    const fav = page.locator('button[aria-label*="favorite" i], button[aria-label*="즐겨찾기"], .favorite-btn');
    if (await fav.count()) {
      await fav.first().click({ timeout: 2000 });
      r.steps.clickFavorite = 'ok';
    } else {
      r.steps.clickFavorite = 'no-favorite-button';
    }
  } catch (e) { r.steps.clickFavorite = 'fail: ' + e.message; }

  // Final GA events snapshot
  const evts2 = await page.evaluate(() => window.__GA_EVENTS__ || []);
  r.gaEventsFinal = evts2.map(e => e.name);

  return r;
}

async function runViewport(viewport) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(
    viewport === 'mobile' ? { ...devices['iPhone 14'] } : { viewport: { width: 1440, height: 900 } }
  );
  // Install GA stub for every page
  await ctx.addInitScript(() => {
    window.__GA_EVENTS__ = [];
    const origGtag = window.gtag;
    window.gtag = function(...args) {
      try {
        if (args[0] === 'event') window.__GA_EVENTS__.push({ name: args[1], params: args[2] || {} });
      } catch {}
      if (typeof origGtag === 'function') return origGtag.apply(this, args);
    };
    if (!window.dataLayer) window.dataLayer = [];
    const origPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function(obj) {
      try {
        if (obj && obj[0] === 'event') window.__GA_EVENTS__.push({ name: obj[1], params: obj[2] || {} });
        else if (obj && obj.event) window.__GA_EVENTS__.push({ name: obj.event, params: obj });
      } catch {}
      return origPush(obj);
    };
  });
  const screenDir = viewport === 'mobile' ? SCREEN_MB : SCREEN_PC;

  const out = [];
  for (const g of SAMPLE) {
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
    try {
      await page.goto(BASE + `/${g}-name-generator/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      const r = await runFlow(page, `gen-${g}`, screenDir);
      r.consoleErrors = consoleErrors;
      out.push(r);
    } catch (e) {
      out.push({ slug: `gen-${g}`, notes: ['NAV_FAIL: ' + e.message], consoleErrors });
    } finally {
      await page.close();
    }
  }

  await ctx.close();
  await browser.close();
  return out;
}

console.log('PC interactive…');
const pc = await runViewport('pc');
console.log('Mobile interactive…');
const mb = await runViewport('mobile');

const report = { ts: new Date().toISOString(), pc, mobile: mb };
writeFileSync(join(__dirname, 'interactive.json'), JSON.stringify(report, null, 2));
console.log('Done.');
