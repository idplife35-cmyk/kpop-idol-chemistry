#!/usr/bin/env node
/**
 * Trend signal collector for tribe-intel.
 *
 * Pulls 4 signal axes daily (see tribe/trend-monitoring-plan.md):
 *   1. Reddit r/kpop top week     — RSS, free, no auth
 *   2. Wikipedia K-pop releases   — wiki API, free, no auth
 *   3. YouTube Music KR trending  — Data API v3 (optional, requires YOUTUBE_API_KEY)
 *   4. Twitter trends             — Playwright scrape (optional, ga_scraper pattern)
 *
 * Output: analytics/trends/YYYY-MM-DD.json — consumed by daily_brief.mjs.
 *
 * Usage:
 *   node trend_pull.mjs
 *   YOUTUBE_API_KEY=… node trend_pull.mjs
 *   node trend_pull.mjs --no-twitter      # skip Playwright path
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = new Set(process.argv.slice(2));
const SKIP_TWITTER = args.has('--no-twitter');

const today = new Date().toISOString().slice(0, 10);

// Groups we care about — must stay aligned with tribe/worldview-v1.md
const FOCUS_GROUPS_TIER1 = [
  // 4·5세대 메가 팬덤 (70% weight)
  'NewJeans', 'IVE', 'aespa', 'RIIZE', 'ZEROBASEONE', 'PLAVE',
  'Stray Kids', 'LE SSERAFIM', 'TXT', 'ENHYPEN', 'BABYMONSTER',
];
const FOCUS_GROUPS_TIER2 = [
  // 1세대 (30% weight)
  'BTS', 'BLACKPINK', 'TWICE', 'SEVENTEEN', 'NCT',
];
const ALL_FOCUS = [...FOCUS_GROUPS_TIER1, ...FOCUS_GROUPS_TIER2];

const trends = {
  pulled_at: new Date().toISOString(),
  sources: {},
};

// --- Axis 1: Reddit RSS ---
trends.sources.reddit = await pullReddit().catch((e) => ({ error: String(e.message ?? e) }));

// --- Axis 2: Wikipedia comeback list ---
trends.sources.wikipedia = await pullWikipedia().catch((e) => ({ error: String(e.message ?? e) }));

// --- Axis 3: YouTube Music KR trending (optional) ---
if (process.env.YOUTUBE_API_KEY) {
  trends.sources.youtube = await pullYouTube(process.env.YOUTUBE_API_KEY)
    .catch((e) => ({ error: String(e.message ?? e) }));
} else {
  trends.sources.youtube = { skipped: 'no YOUTUBE_API_KEY set' };
}

// --- Axis 4: Twitter/X trends (Playwright, optional) ---
if (!SKIP_TWITTER) {
  trends.sources.twitter = await pullTwitter().catch((e) => ({ error: String(e.message ?? e) }));
} else {
  trends.sources.twitter = { skipped: '--no-twitter flag' };
}

// --- Group mentions roll-up across all axes ---
trends.group_signal = aggregateGroupSignals(trends.sources);

// --- Write output ---
const outDir = path.join(__dirname, 'trends');
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `${today}.json`);
await fs.writeFile(outPath, JSON.stringify(trends, null, 2));
console.log(`[trend_pull] Wrote ${outPath}`);

// =====================================================================

async function pullReddit() {
  // RSS is XML; parse minimally — we only need titles + permalinks
  const res = await fetch('https://www.reddit.com/r/kpop/top/.rss?t=week', {
    headers: { 'user-agent': 'kpop-pdca-bot/0.1 (contact: paycis)' },
  });
  if (!res.ok) throw new Error(`Reddit RSS HTTP ${res.status}`);
  const xml = await res.text();
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml))) {
    const block = m[1];
    const title = (block.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
    const link = (block.match(/<link[^>]*href="([^"]+)"/) || [, ''])[1];
    const updated = (block.match(/<updated>([^<]+)<\/updated>/) || [, ''])[1];
    if (title) entries.push({ title: decodeEntities(title), link, updated });
  }
  return {
    window: 'top this week',
    fetched_at: new Date().toISOString(),
    count: entries.length,
    entries: entries.slice(0, 25),
  };
}

async function pullWikipedia() {
  const year = new Date().getUTCFullYear();
  const titles = [`List_of_${year}_in_K-pop`, `List_of_${year + 1}_in_K-pop`];
  const out = [];
  for (const title of titles) {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&prop=text&disabletoc=true&disableeditsection=true`;
    const res = await fetch(url, {
      headers: { 'user-agent': 'kpop-pdca-bot/0.1' },
    });
    if (!res.ok) continue;
    const json = await res.json();
    const html = json.parse?.text?.['*'] ?? '';
    // Strip HTML to find which focus groups appear and how often
    const text = html
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ');
    const mentions = {};
    for (const g of ALL_FOCUS) {
      const re = new RegExp(`\\b${escapeRegExp(g)}\\b`, 'gi');
      const matches = text.match(re);
      mentions[g] = matches ? matches.length : 0;
    }
    out.push({ page: title, group_mentions: mentions, text_length: text.length });
  }
  return { pages: out };
}

async function pullYouTube(apiKey) {
  // Music category id is 10; KR region
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&videoCategoryId=10&maxResults=25&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API HTTP ${res.status}`);
  const json = await res.json();
  return {
    region: 'KR',
    category: 'Music',
    count: json.items?.length ?? 0,
    items: (json.items ?? []).map((v) => ({
      title: v.snippet?.title,
      channel: v.snippet?.channelTitle,
      published_at: v.snippet?.publishedAt,
      view_count: Number(v.statistics?.viewCount ?? 0),
      like_count: Number(v.statistics?.likeCount ?? 0),
      url: `https://youtube.com/watch?v=${v.id}`,
    })),
  };
}

async function pullTwitter() {
  // Playwright is optional — only loaded if requested and installed.
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    return { skipped: 'playwright not installed (cd analytics && npm install playwright)' };
  }
  const userDataDir = path.join(__dirname, '.playwright-profile');
  await fs.mkdir(userDataDir, { recursive: true });
  const ctx = await chromium.launchPersistentContext(userDataDir, { headless: true });
  const page = await ctx.newPage();
  try {
    // trends24.in needs no login and aggregates Twitter trends
    await page.goto('https://trends24.in/united-states/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForTimeout(3000);
    const trendsList = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.trend-card ol li a')).slice(0, 40);
      return items.map((a) => a.textContent?.trim()).filter(Boolean);
    });
    return { region: 'United States', source: 'trends24.in', count: trendsList.length, trends: trendsList };
  } finally {
    await ctx.close();
  }
}

function aggregateGroupSignals(sources) {
  const tally = Object.fromEntries(ALL_FOCUS.map((g) => [g, 0]));
  // Reddit titles
  for (const e of sources.reddit?.entries ?? []) {
    for (const g of ALL_FOCUS) {
      if (new RegExp(`\\b${escapeRegExp(g)}\\b`, 'i').test(e.title || '')) tally[g] += 3;
    }
  }
  // Wikipedia mentions
  for (const page of sources.wikipedia?.pages ?? []) {
    for (const [g, count] of Object.entries(page.group_mentions ?? {})) {
      tally[g] = (tally[g] ?? 0) + Math.min(count, 10);
    }
  }
  // YouTube titles
  for (const v of sources.youtube?.items ?? []) {
    for (const g of ALL_FOCUS) {
      if (new RegExp(`\\b${escapeRegExp(g)}\\b`, 'i').test(v.title || '')) {
        tally[g] += 2 + Math.floor((v.view_count || 0) / 1_000_000);
      }
    }
  }
  // Twitter trends
  for (const t of sources.twitter?.trends ?? []) {
    for (const g of ALL_FOCUS) {
      if (new RegExp(`\\b${escapeRegExp(g)}\\b`, 'i').test(t)) tally[g] += 5;
    }
  }
  const ranked = Object.entries(tally)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([group, score]) => ({ group, score, tier: FOCUS_GROUPS_TIER1.includes(group) ? 1 : 2 }));
  return { ranked, total_signals: ranked.reduce((s, x) => s + x.score, 0) };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
