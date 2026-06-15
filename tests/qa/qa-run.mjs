// QA verification script for kpopnamegenerator.com
// Usage: node tests/qa/qa-run.mjs
// Produces JSON report at tests/qa/results.json and screenshots under tests/qa/screenshots/{pc|mobile}

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

// Pages to verify (full list of /[group]-name-generator/ slugs verified earlier)
const GROUP_SLUGS = [
  'aespa', 'ateez', 'blackpink', 'bts', 'enhypen', 'exo',
  'g-idle', 'huntrix', 'illit', 'itzy', 'ive', 'katseye',
  'le-sserafim', 'nct127', 'newjeans', 'plave', 'red-velvet',
  'riize', 'sajaboys', 'seventeen', 'stray-kids', 'twice',
  'txt', 'zerobaseone'
];

// Sample groups to do deeper checks (interactive + member sub-page)
const SAMPLE_GROUPS = ['bts', 'blackpink', 'zerobaseone', 'aespa', 'twice'];

const PAGES = [
  { path: '/', slug: 'index' },
  { path: '/about/', slug: 'about' },
  { path: '/contact/', slug: 'contact' },
  { path: '/privacy/', slug: 'privacy' },
  { path: '/terms/', slug: 'terms' },
  { path: '/blog/', slug: 'blog-index' },
];

// Add all generator pages
for (const g of GROUP_SLUGS) {
  PAGES.push({ path: `/${g}-name-generator/`, slug: `gen-${g}`, group: g });
}

const report = {
  ts: new Date().toISOString(),
  pcResults: [],
  mobileResults: [],
  gaEvents: { pc: {}, mobile: {} }, // pageSlug -> [eventName, params]
  consoleAll: [],
};

async function instrumentPage(page, viewport, slug) {
  const result = {
    slug, viewport,
    url: null,
    status: null,
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: [],
    failedRequests: [],
    title: null,
    metaDescription: null,
    canonical: null,
    ogImage: null,
    hreflang: [],
    imagesWithoutAlt: 0,
    hasGenerateBtn: false,
    horizontalScroll: false,
    bodyScrollWidth: null,
    bodyClientWidth: null,
    gaEvents: [],
    notes: [],
  };

  // Capture GA events by stubbing gtag/dataLayer
  await page.addInitScript(() => {
    window.__GA_EVENTS__ = [];
    const original = window.gtag;
    window.gtag = function(...args) {
      try {
        if (args[0] === 'event') {
          window.__GA_EVENTS__.push({ name: args[1], params: args[2] || {} });
        }
      } catch {}
      if (typeof original === 'function') return original.apply(this, args);
    };
    // dataLayer interception
    const origDL = window.dataLayer;
    window.dataLayer = origDL || [];
    const origPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function(obj) {
      try {
        if (obj && obj[0] === 'event') {
          window.__GA_EVENTS__.push({ name: obj[1], params: obj[2] || {} });
        } else if (obj && obj.event) {
          window.__GA_EVENTS__.push({ name: obj.event, params: obj });
        }
      } catch {}
      return origPush(obj);
    };
  });

  page.on('console', (msg) => {
    const t = msg.type();
    if (t === 'error') result.consoleErrors.push(msg.text());
    else if (t === 'warning') result.consoleWarnings.push(msg.text());
  });
  page.on('pageerror', (err) => result.pageErrors.push(err.message));
  page.on('requestfailed', (req) => {
    const url = req.url();
    // ignore noisy adsense/google noise that fails in headless
    if (/doubleclick|googlesyndication|google-analytics|googletagservices|googletagmanager|adservice|pagead2|adtrafficquality|fundingchoicesmessages/.test(url)) return;
    result.failedRequests.push({ url, failure: req.failure()?.errorText });
  });
  return result;
}

async function checkPage(page, pageInfo, viewport, screenDir) {
  const result = await instrumentPage(page, viewport, pageInfo.slug);
  const url = BASE + pageInfo.path;
  result.url = url;
  let resp;
  try {
    resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    result.status = resp ? resp.status() : null;
  } catch (e) {
    result.notes.push('NAV_FAIL: ' + e.message);
    return result;
  }

  try {
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  } catch {}

  // basic meta
  result.title = await page.title().catch(() => null);
  result.metaDescription = await page.locator('meta[name="description"]').first().getAttribute('content').catch(() => null);
  result.canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href').catch(() => null);
  result.ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content').catch(() => null);
  const hreflangs = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(els => els.map(e => ({ lang: e.getAttribute('hreflang'), href: e.getAttribute('href') }))).catch(() => []);
  result.hreflang = hreflangs;

  // alt missing on imgs
  result.imagesWithoutAlt = await page.locator('img:not([alt])').count().catch(() => 0);

  // horizontal overflow
  const dims = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body ? document.body.scrollWidth : 0,
  }));
  result.bodyScrollWidth = dims.scrollWidth;
  result.bodyClientWidth = dims.clientWidth;
  result.horizontalScroll = dims.scrollWidth > dims.clientWidth + 1;

  // detect generate button
  result.hasGenerateBtn = await page.getByRole('button', { name: /Generate Name/i }).count().catch(() => 0) > 0;

  // screenshot
  try {
    await page.screenshot({ path: join(screenDir, `${pageInfo.slug}.png`), fullPage: false });
  } catch {}

  return result;
}

async function runGeneratorFlow(page, slug, screenDir) {
  // After page is loaded on a generator page, try to use the form
  const r = { slug, gaEvents: [], notes: [] };
  try {
    // Fill name
    const nameInput = page.locator('input[type="text"], input[placeholder*="name" i]').first();
    await nameInput.fill('Alex', { timeout: 5000 });
    // Click an idol card if visible (group page auto-fills group, just pick first member)
    const memberCard = page.locator('button:has-text("Jungkook"), button:has-text("Jennie"), button:has-text("Han Yujin"), button:has-text("Karina"), button:has-text("Nayeon"), [data-idol], .idol-card, .member-card').first();
    if (await memberCard.count()) {
      try { await memberCard.click({ timeout: 3000 }); } catch {}
    }
    // Click any visible image-only member tile as fallback
    const anyTile = page.locator('button img').first();
    if (await anyTile.count()) {
      try { await anyTile.click({ timeout: 2000 }); } catch {}
    }
    // Click Generate Name
    const btn = page.getByRole('button', { name: /Generate Name/i }).first();
    await btn.click({ timeout: 5000 });
    // Wait for result UI
    await page.waitForTimeout(1500);
    // Screenshot result
    try { await page.screenshot({ path: join(screenDir, `${slug}-result.png`), fullPage: false }); } catch {}
    // Collect GA events
    const evts = await page.evaluate(() => window.__GA_EVENTS__ || []);
    r.gaEvents = evts;
    // Wait for PWA banner timer (4 sec) and capture
    await page.waitForTimeout(4500);
    const bannerVisible = await page.locator('#pwa-install-banner:not([hidden])').count();
    r.pwaBannerVisible = bannerVisible > 0;
    // also check via JS
    r.pwaBannerHiddenAttr = await page.evaluate(() => {
      const el = document.getElementById('pwa-install-banner');
      return el ? el.hasAttribute('hidden') : null;
    });
  } catch (e) {
    r.notes.push('GEN_FLOW_FAIL: ' + e.message);
  }
  return r;
}

async function runViewport(viewport) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(
    viewport === 'mobile' ? { ...devices['iPhone 14'] } : { viewport: { width: 1440, height: 900 } }
  );
  const screenDir = viewport === 'mobile' ? SCREEN_MB : SCREEN_PC;

  const results = [];

  // Visit each page
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const r = await checkPage(page, p, viewport, screenDir);
    results.push(r);
    await page.close();
  }

  // Deep interactive checks for sample groups
  const interactive = [];
  for (const g of SAMPLE_GROUPS) {
    const page = await ctx.newPage();
    const url = BASE + `/${g}-name-generator/`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.addInitScript(() => { window.__GA_EVENTS__ = window.__GA_EVENTS__ || []; });
      // Re-install GA capture (since we navigated)
      await page.evaluate(() => {
        if (!window.__GA_EVENTS__) window.__GA_EVENTS__ = [];
        const origGtag = window.gtag;
        window.gtag = function(...args) {
          try {
            if (args[0] === 'event') window.__GA_EVENTS__.push({ name: args[1], params: args[2] || {} });
          } catch {}
          if (typeof origGtag === 'function') return origGtag.apply(this, args);
        };
      });
      const r = await runGeneratorFlow(page, `gen-${g}`, screenDir);
      interactive.push(r);
    } catch (e) {
      interactive.push({ slug: `gen-${g}`, notes: ['INTERACTIVE_NAV_FAIL: ' + e.message] });
    } finally {
      await page.close();
    }
  }

  // Visit one member page for sampling
  const memberPage = await ctx.newPage();
  try {
    // Pick a known member URL — verify it 404s or renders
    const memberUrls = [
      '/bts-name-generator/jungkook/',
      '/blackpink-name-generator/jennie/',
      '/aespa-name-generator/karina/',
    ];
    for (const m of memberUrls) {
      const r = await checkPage(memberPage, { path: m, slug: 'member-' + m.replace(/\//g, '_') }, viewport, screenDir);
      results.push(r);
    }
  } catch {}
  await memberPage.close();

  // Manifest + service worker check
  const swPage = await ctx.newPage();
  try {
    const manifestResp = await ctx.request.get(BASE + '/manifest.webmanifest');
    const manifestJson = await manifestResp.json().catch(() => null);
    const swResp = await ctx.request.get(BASE + '/sw.js').catch(() => null);
    results.push({
      slug: 'manifest-sw',
      viewport,
      manifestStatus: manifestResp.status(),
      manifest: manifestJson,
      swStatus: swResp ? swResp.status() : null,
    });
  } catch (e) {
    results.push({ slug: 'manifest-sw', viewport, notes: ['MANIFEST_FAIL: ' + e.message] });
  }
  await swPage.close();

  await ctx.close();
  await browser.close();

  return { results, interactive };
}

console.log('=== PC run ===');
const pc = await runViewport('pc');
console.log(`PC pages: ${pc.results.length}, interactive: ${pc.interactive.length}`);

console.log('=== Mobile run ===');
const mb = await runViewport('mobile');
console.log(`Mobile pages: ${mb.results.length}, interactive: ${mb.interactive.length}`);

report.pcResults = pc.results;
report.pcInteractive = pc.interactive;
report.mobileResults = mb.results;
report.mobileInteractive = mb.interactive;

const out = join(__dirname, 'results.json');
writeFileSync(out, JSON.stringify(report, null, 2));
console.log('Wrote', out);
