#!/usr/bin/env node
/**
 * ChatGPT-driven image generation via Playwright.
 *
 * Usage:
 *   node image_gen.mjs --prompt "..." --out ../../public/og/blog/foo.png
 *   node image_gen.mjs --queue queue            # batch process queue/*.json
 *   node image_gen.mjs --queue queue/blog-comeback-2026.json
 *
 * Queue file shape (queue/whatever.json):
 *   {
 *     "id": "blog-comeback-2026",
 *     "prompt": "K-Pop concert stage, neon lights, ...",
 *     "out": "public/og/blog/comeback-2026.png",
 *     "size": "1792x1024",
 *     "notes": "OG image for the 2026 comeback calendar blog"
 *   }
 *
 * Login: first run pops the browser; sign into ChatGPT once. The session is
 * stored in tools/image_gen/.profile and reused.
 *
 * Selectors below target the current ChatGPT UI as of 2026-06. They will drift.
 * On drift, run with --headed and patch the selectors at the top of the file.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

// --- Selectors (update when ChatGPT UI changes) ---
const SELECTORS = {
  composer: 'div#prompt-textarea, textarea[data-id], textarea[placeholder*="Message"]',
  sendBtn: 'button[data-testid="send-button"], button[aria-label="Send prompt"]',
  generatedImg: 'main img[alt*="Generated"], main img[src*="oaiusercontent"], main img[src*="dalle"]',
  newChat: 'a[href="/"], button:has-text("New chat")',
};

const args = parseArgs(process.argv.slice(2));

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error('Playwright not installed. Run:');
    console.error('  cd tools/image_gen && npm install && npx playwright install chromium');
    process.exit(1);
  }
}

const { chromium } = await loadPlaywright();

const userDataDir = path.join(__dirname, '.profile');
await fs.mkdir(userDataDir, { recursive: true });

const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: args.headed ? false : false,  // ChatGPT routinely blocks headless; force visible
  viewport: { width: 1280, height: 900 },
  acceptDownloads: true,
});

const page = ctx.pages()[0] || (await ctx.newPage());
await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

if (await needsLogin(page)) {
  console.log('[image_gen] Sign into ChatGPT in the open browser. Press Enter here when done.');
  await new Promise((resolve) => process.stdin.once('data', resolve));
}

const jobs = await collectJobs(args);
if (jobs.length === 0) {
  console.error('No jobs. Pass --prompt + --out or --queue <dir|file>.');
  process.exit(1);
}

for (const job of jobs) {
  console.log(`[image_gen] Generating: ${job.id ?? job.out}`);
  try {
    await generateOne(page, job);
    if (job.queueFile) await markDone(job.queueFile);
  } catch (err) {
    console.error(`[image_gen] FAILED on ${job.id ?? job.out}:`, err.message);
  }
}

console.log('[image_gen] Done. Close the browser when ready.');
// keep open so the user can verify; ctx not closed intentionally

// --- helpers ---

function parseArgs(arr) {
  const out = {};
  for (let i = 0; i < arr.length; i++) {
    const k = arr[i];
    if (!k.startsWith('--')) continue;
    const key = k.replace(/^--/, '');
    const v = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[++i] : true;
    out[key] = v;
  }
  return out;
}

async function needsLogin(page) {
  // The composer is only present after login. Wait a beat for it.
  for (let i = 0; i < 8; i++) {
    const composer = await page.$(SELECTORS.composer);
    if (composer) return false;
    if (await page.$('a[href*="/auth/login"], button:has-text("Log in")')) return true;
    await page.waitForTimeout(750);
  }
  return false;
}

async function collectJobs(args) {
  if (args.prompt && args.out) {
    return [{
      prompt: String(args.prompt),
      out: String(args.out),
      size: args.size ? String(args.size) : undefined,
    }];
  }
  if (!args.queue) return [];
  const queuePath = path.resolve(args.queue);
  const stat = await fs.stat(queuePath);
  const files = stat.isDirectory()
    ? (await fs.readdir(queuePath))
        .filter((f) => f.endsWith('.json'))
        .map((f) => path.join(queuePath, f))
    : [queuePath];
  const jobs = [];
  for (const f of files) {
    const job = JSON.parse(await fs.readFile(f, 'utf8'));
    job.queueFile = f;
    jobs.push(job);
  }
  return jobs;
}

async function generateOne(page, job) {
  await openNewChat(page);

  const promptText = composePrompt(job);
  await page.fill(SELECTORS.composer, promptText);
  await page.waitForTimeout(300);

  const sendBtn = await page.$(SELECTORS.sendBtn);
  if (sendBtn) {
    await sendBtn.click();
  } else {
    await page.keyboard.press('Enter');
  }

  console.log(`[image_gen] Waiting for image (up to 4 minutes)…`);
  await page.waitForSelector(SELECTORS.generatedImg, { timeout: 240_000 });

  // The last <img> in the conversation is the freshest
  const imgHandles = await page.$$(SELECTORS.generatedImg);
  const lastImg = imgHandles[imgHandles.length - 1];
  const src = await lastImg.getAttribute('src');
  if (!src) throw new Error('Generated image has no src');

  const buf = await downloadImage(page, src);
  const outAbs = path.isAbsolute(job.out) ? job.out : path.join(REPO_ROOT, job.out);
  await fs.mkdir(path.dirname(outAbs), { recursive: true });
  await fs.writeFile(outAbs, buf);
  console.log(`[image_gen] Saved ${outAbs} (${buf.length} bytes)`);
}

function composePrompt(job) {
  const size = job.size ? ` (target dimensions: ${job.size})` : '';
  const note = job.style ? `\nStyle: ${job.style}` : '';
  return `Generate a single image based on this prompt${size}. Do not add text overlays unless requested.\n\nPrompt:\n${job.prompt}${note}`;
}

async function downloadImage(page, src) {
  if (src.startsWith('data:')) {
    const base64 = src.split(',', 2)[1];
    return Buffer.from(base64, 'base64');
  }
  const res = await page.request.get(src);
  if (!res.ok()) throw new Error(`Image fetch failed: ${res.status()}`);
  return Buffer.from(await res.body());
}

async function openNewChat(page) {
  try {
    const link = await page.$(SELECTORS.newChat);
    if (link) await link.click();
  } catch {}
  await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(SELECTORS.composer, { timeout: 30_000 });
}

async function markDone(queueFile) {
  const doneDir = path.join(path.dirname(queueFile), 'done');
  await fs.mkdir(doneDir, { recursive: true });
  const dest = path.join(doneDir, path.basename(queueFile));
  await fs.rename(queueFile, dest);
  console.log(`[image_gen] Queue: marked done -> ${dest}`);
}
