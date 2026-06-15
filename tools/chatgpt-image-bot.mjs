#!/usr/bin/env node
/**
 * ChatGPT 웹앱(chatgpt.com)을 시스템 Chrome + CDP attach로 자동 조작해서
 * 이미지를 일괄 생성·다운로드하는 봇.
 *
 * Playwright 자체 Chromium은 OpenAI 봇 감지로 차단됨 → 시스템 Chrome을
 * --remote-debugging-port로 띄우고 connectOverCDP로 attach 하는 패턴
 * (naver_blog_automation/scripts/chatgpt_web_image.py 검증).
 *
 * 정책:
 *   - 회의 결정: 실인물 사진·AI 닮음 절대 금지 (meetings/2026-06-09-image-strategy.md)
 *   - 큐: tools/image_queue.json (seed_image_queue.mjs로 생성)
 *
 * Usage:
 *   node tools/chatgpt-image-bot.mjs
 *   node tools/chatgpt-image-bot.mjs --only=p0
 *   node tools/chatgpt-image-bot.mjs --only=hero
 *   node tools/chatgpt-image-bot.mjs --resume
 *
 * 환경변수:
 *   CHATGPT_CDP_PORT  (기본 9223 — naver의 9222와 충돌 회피)
 *   CHROME_PATH       (기본 macOS 표준 경로)
 */

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import net from 'node:net';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(__dirname, 'image_queue.json');
const PROFILE_DIR = path.join(__dirname, '.chrome-chatgpt-profile');

const CDP_PORT = parseInt(process.env.CHATGPT_CDP_PORT || '9333', 10);
const CHROME_PATH = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHATGPT_URL = 'https://chatgpt.com/';

// --- Selectors (naver 검증본 + fallback). UI 변경 시 여기만 손대면 됨. ---
const SELECTORS = {
  composer: [
    '#prompt-textarea',
    'div[contenteditable="true"][id="prompt-textarea"]',
    'div#prompt-textarea',
    '[placeholder="Ask anything"]',
    '[placeholder="Message ChatGPT"]',
    'div[contenteditable="true"].ProseMirror',
    'div[contenteditable="true"]',
  ],
  sendBtn: [
    'button[data-testid="send-button"]',
    'button[aria-label="Send prompt"]',
    'button[aria-label="전송"]',
    'button[type="submit"]',
  ],
  stopBtn: [
    'button[data-testid="stop-button"]',
    'button[aria-label="Stop generating"]',
    'button[aria-label="생성 중단"]',
    '[aria-label="Stop streaming"]',
  ],
  newChatBtn: [
    'button[aria-label="New chat"]',
    'a[aria-label="New chat"]',
    '[data-testid="new-chat-button"]',
    'button[data-testid="create-new-chat-button"]',
    'nav button:has-text("New chat")',
    '[aria-label="새 채팅"]',
  ],
};

const args = parseArgs(process.argv.slice(2));

await ensurePlaywright();
const { chromium } = await import('playwright');

await fs.mkdir(PROFILE_DIR, { recursive: true });

// 1) 시스템 Chrome을 CDP 디버그 모드로 (이미 떠 있으면 skip)
const chromeProc = await ensureChrome();

// 2) Playwright이 CDP로 attach
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
const context = browser.contexts()[0] || await browser.newContext();

let shuttingDown = false;
process.on('SIGINT', () => {
  if (shuttingDown) process.exit(1);
  shuttingDown = true;
  console.log('\n[bot] 중단 신호 받음. 현재 작업 완료 후 종료.');
});

const page = (context.pages().find((p) => p.url().includes('chatgpt.com')))
  || await context.newPage();

console.log('[bot] chatgpt.com 여는 중. 로그인이 필요하면 열린 브라우저 창에서 직접 로그인하세요.');
await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await waitForComposer(page, 5 * 60 * 1000);
console.log('✅ 로그인 감지. 이미지 생성 큐 시작합니다.');

const queue0 = await readQueue();
const filtered = filterQueue(queue0, args);
const filterIds = new Set(filtered.map((e) => e.id));
console.log(`[bot] 처리 대상 ${filtered.length}건 (전체 ${queue0.length}건). 동시 워커 ${args.concurrent}개.`);

// 큐 락 (atomic claim / mark)
let queueMutex = Promise.resolve();
async function withQueue(fn) {
  const prev = queueMutex;
  let release;
  queueMutex = new Promise((r) => { release = r; });
  await prev;
  try { return await fn(); } finally { release(); }
}

async function claimNext() {
  return withQueue(async () => {
    const q = await readQueue();
    for (let i = 0; i < q.length; i++) {
      const e = q[i];
      if (!filterIds.has(e.id)) continue;
      const claimable = args.resume ? e.status === 'pending' : (e.status === 'pending' || e.status === 'failed');
      if (!claimable) continue;
      e.status = 'in_progress';
      e.attempts = (e.attempts || 0) + 1;
      await writeQueue(q);
      return e;
    }
    return null;
  });
}

async function markEntry(id, patch) {
  return withQueue(async () => {
    const q = await readQueue();
    const idx = q.findIndex((e) => e.id === id);
    if (idx < 0) return;
    Object.assign(q[idx], patch);
    await writeQueue(q);
  });
}

let processed = 0;
async function workerLoop(workerId) {
  // 첫 페이지(메인)는 워커 1이 그대로 사용, 나머지는 새 탭
  const p = workerId === 1 ? page : await context.newPage();
  if (workerId !== 1) {
    try { await p.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 }); } catch {}
  }
  while (!shuttingDown) {
    const entry = await claimNext();
    if (!entry) break;
    processed++;
    const idx = processed;
    console.log(`\n[bot W${workerId}] (${idx}/${filtered.length}) ${entry.id} — ${entry.group} (${entry.type})`);
    try {
      await processEntry(p, entry);
      await markEntry(entry.id, { status: 'done', actualPath: entry.actualPath || entry.outputPath, error: undefined });
      console.log(`[bot W${workerId}] ✅ ${entry.id}`);
    } catch (err) {
      const msg = String(err && err.message || err);
      await markEntry(entry.id, { status: 'failed', error: msg });
      console.error(`[bot W${workerId}] ❌ ${entry.id}: ${msg}`);
    }
    if (args.pause > 0 && !shuttingDown) {
      await new Promise((r) => setTimeout(r, args.pause * 1000));
    }
  }
  if (workerId !== 1) {
    await p.close().catch(() => {});
  }
}

const workers = [];
for (let i = 1; i <= args.concurrent; i++) {
  workers.push(workerLoop(i));
  // 동시 시작 시 ChatGPT가 봇으로 감지하지 않도록 시차 (rate limit 회피)
  await new Promise((r) => setTimeout(r, 5000));
}
await Promise.all(workers);

console.log(`\n[bot] 큐 처리 완료. ${processed}건 시도. 브라우저는 직접 닫으세요.`);
// Chrome 프로세스는 사용자가 결과 확인 가능하도록 유지

// ──────────────────────────────────────────────
// 헬퍼들
// ──────────────────────────────────────────────

function parseArgs(arr) {
  const out = { only: null, resume: false, concurrent: 3, pause: 0 };
  for (const a of arr) {
    if (a === '--resume') out.resume = true;
    else if (a.startsWith('--only=')) out.only = a.slice('--only='.length).toLowerCase();
    else if (a.startsWith('--concurrent=')) out.concurrent = Math.max(1, parseInt(a.slice('--concurrent='.length), 10) || 1);
    else if (a.startsWith('--pause=')) out.pause = Math.max(0, parseInt(a.slice('--pause='.length), 10) || 0);
  }
  return out;
}

async function ensurePlaywright() {
  const require = createRequire(import.meta.url);
  try { require.resolve('playwright'); return; } catch {}
  console.log('[bot] playwright 미설치 → npm install --no-save playwright');
  await runCmd('npm', ['install', '--no-save', 'playwright'], { cwd: REPO_ROOT });
  // 시스템 Chrome을 쓰므로 chromium 바이너리는 다운로드 불필요
}

function runCmd(cmd, argv, opts) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: 'inherit', ...opts });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
    p.on('error', reject);
  });
}

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let done = false;
    const finish = (v) => { if (!done) { done = true; sock.destroy(); resolve(v); } };
    sock.setTimeout(800);
    sock.once('connect', () => finish(true));
    sock.once('error', () => finish(false));
    sock.once('timeout', () => finish(false));
    sock.connect(port, host);
  });
}

async function ensureChrome() {
  if (await isPortOpen(CDP_PORT)) {
    console.log(`[bot] CDP ${CDP_PORT} 이미 열림 — 기존 Chrome attach.`);
    return null;
  }
  console.log(`[bot] 시스템 Chrome 디버그 모드로 실행 (port ${CDP_PORT}, profile ${PROFILE_DIR})`);
  const proc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${PROFILE_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-blink-features=AutomationControlled',
  ], { stdio: 'ignore', detached: true });
  proc.unref();
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await isPortOpen(CDP_PORT)) {
      console.log(`[bot] ✅ Chrome CDP 연결 가능 (pid ${proc.pid}).`);
      return proc;
    }
  }
  throw new Error('Chrome 디버그 모드 실행 실패 (30초 타임아웃)');
}

async function readQueue() {
  const raw = await fs.readFile(QUEUE_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeQueue(queue) {
  const tmp = QUEUE_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(queue, null, 2) + '\n');
  await fs.rename(tmp, QUEUE_PATH);
}

function filterQueue(queue, args) {
  return queue.filter((e) => {
    if (args.resume && e.status !== 'pending') return false;
    if (!args.only) return true;
    const only = args.only;
    if (only === 'hero' || only === 'logo') return e.type === only;
    if (only === 'p0' || only === 'p1' || only === 'p2') return e.priority === only;
    return true;
  });
}

async function locateFirst(page, list, timeoutMsEach = 2000) {
  for (const sel of list) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ state: 'visible', timeout: timeoutMsEach });
      return el;
    } catch {}
  }
  return null;
}

async function waitForComposer(page, timeoutMs) {
  const start = Date.now();
  let warned = false;
  while (Date.now() - start < timeoutMs) {
    const url = page.url();
    if (url.includes('auth.openai.com') || url.includes('login')) {
      await page.waitForTimeout(2000);
      continue;
    }
    // 사용자가 다른 탭에서 로그인한 후 돌아오는 경우 대비 — 같은 탭을 chatgpt.com으로 reload
    if (!page.url().includes('chatgpt.com')) {
      try { await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 }); } catch {}
    }

    const el = await locateFirst(page, SELECTORS.composer, 1500);
    if (el) {
      const isAnon = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('button, a'));
        const txt = (n) => (n.textContent || '').trim();
        const anonRegex = /^(log\s*in|sign\s*up|로그인|회원가입)$/i;
        return all.some((n) => anonRegex.test(txt(n)));
      });
      if (!isAnon) return;
      if (!warned) {
        console.log('[bot] ⏳ 로그인 안 됨 감지. 열린 Chrome 창에서 ChatGPT 로그인해주세요.');
        console.log('[bot]    로그인하면 자동으로 진행됩니다.');
        warned = true;
      }
      // 로그인 진행 중 — 페이지 reload로 상태 갱신 시도 (10초마다)
      if ((Date.now() - start) % 20_000 < 2500) {
        try { await page.reload({ waitUntil: 'domcontentloaded', timeout: 15_000 }); } catch {}
      }
    }
    await page.waitForTimeout(2500);
  }
  throw new Error('로그인 대기 5분 초과 — 익명 상태 또는 composer 미발견');
}

async function processEntry(page, entry) {
  await openNewChat(page);
  await fillComposer(page, entry.prompt);
  await sendPrompt(page);
  console.log('[bot] 이미지 생성 대기 중 (최대 5분)…');
  const { buffer, contentType } = await waitAndDownloadImage(page, 5 * 60 * 1000);
  if (!buffer || buffer.length === 0) throw new Error('이미지 다운로드 결과 비어 있음');

  // outputPath가 .webp인데 실제는 png/jpeg일 수 있다 → 원본 확장자로도 저장
  const outAbs = path.isAbsolute(entry.outputPath)
    ? entry.outputPath
    : path.join(REPO_ROOT, entry.outputPath);
  await fs.mkdir(path.dirname(outAbs), { recursive: true });

  // ChatGPT 원본은 보통 PNG. outputPath 확장자가 .webp/.png 등 어떤 것이든 우선 원본 그대로 저장.
  // 후처리(WebP 변환·압축)는 별도 파이프라인.
  const ext = pickExt(contentType, outAbs);
  const finalPath = outAbs.replace(/\.[^.]+$/, ext);
  await fs.writeFile(finalPath, buffer);
  entry.actualPath = path.relative(REPO_ROOT, finalPath);
  console.log(`[bot]   저장: ${entry.actualPath} (${contentType || 'unknown'}, ${(buffer.length / 1024).toFixed(0)}KB)`);
}

function pickExt(contentType, fallbackPath) {
  if (contentType) {
    if (contentType.includes('webp')) return '.webp';
    if (contentType.includes('png')) return '.png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  }
  return path.extname(fallbackPath) || '.png';
}

async function openNewChat(page) {
  // 가장 안정적: 홈으로 직접 이동
  try {
    await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  } catch (err) {
    console.warn('[bot] 신규 채팅 이동 실패, 셀렉터 시도:', err.message);
    const btn = await locateFirst(page, SELECTORS.newChatBtn, 2000);
    if (btn) await btn.click().catch(() => {});
  }
  await page.waitForTimeout(1500);
  const composer = await locateFirst(page, SELECTORS.composer, 30_000);
  if (!composer) throw new Error('새 채팅 composer 미발견');
}

async function fillComposer(page, text) {
  const el = await locateFirst(page, SELECTORS.composer, 5000);
  if (!el) throw new Error('composer를 찾을 수 없음');
  await el.click();
  await page.waitForTimeout(300);

  // contenteditable / textarea 양쪽 대응
  const tag = await el.evaluate((node) => node.tagName.toLowerCase()).catch(() => '');
  if (tag === 'textarea') {
    await el.fill(text);
  } else {
    // contenteditable: keyboard.type
    await page.keyboard.type(text, { delay: 0 });
  }
  await page.waitForTimeout(500);
}

async function sendPrompt(page) {
  const btn = await locateFirst(page, SELECTORS.sendBtn, 2000);
  if (btn) {
    const disabled = await btn.isDisabled().catch(() => false);
    if (!disabled) { await btn.click(); return; }
  }
  await page.keyboard.press('Enter');
}

async function isGenerating(page) {
  const btn = await locateFirst(page, SELECTORS.stopBtn, 500);
  return !!btn;
}

async function waitAndDownloadImage(page, timeoutMs) {
  const start = Date.now();

  // Stop 버튼 등장 대기 (최대 30초) — 실제 생성이 시작됐는지 신호
  while (Date.now() - start < 30_000) {
    if (await isGenerating(page)) break;
    await page.waitForTimeout(1000);
  }

  // 생성 완료 + 이미지 등장 폴링
  let lastSrc = null;
  while (Date.now() - start < timeoutMs) {
    const stillGenerating = await isGenerating(page);

    const info = await page.evaluate(() => {
      // 마지막 assistant 메시지에서 가장 큰 이미지 찾기
      const roleSelectors = [
        '[data-message-author-role="assistant"]',
        '[data-testid*="conversation-turn-"] .agent-turn',
        '.agent-turn',
      ];
      let lastMsg = null;
      for (const sel of roleSelectors) {
        const msgs = document.querySelectorAll(sel);
        if (msgs.length > 0) { lastMsg = msgs[msgs.length - 1]; break; }
      }
      if (!lastMsg) lastMsg = document.body;

      const imgs = lastMsg.querySelectorAll('img');
      let best = null;
      let bestArea = 0;
      for (const img of imgs) {
        if (img.naturalWidth < 200 || img.naturalHeight < 200) continue;
        const isGenerated = img.src.includes('oaiusercontent')
          || img.src.includes('oaidall')
          || img.src.includes('files.openai')
          || img.src.includes('sdmntpr')
          || (img.naturalWidth >= 300 && img.naturalHeight >= 300);
        if (!isGenerated) continue;
        const area = img.naturalWidth * img.naturalHeight;
        if (area > bestArea) { best = img; bestArea = area; }
      }
      if (!best) return null;
      return { src: best.src, w: best.naturalWidth, h: best.naturalHeight };
    });

    if (info && info.src && info.src === lastSrc && !stillGenerating) {
      // src 안정 + 생성 종료 → 다운로드
      const { src } = info;
      let buffer = null;
      let contentType = null;
      if (src.startsWith('data:')) {
        const [meta, b64] = src.split(',', 2);
        buffer = Buffer.from(b64, 'base64');
        const m = meta.match(/data:([^;]+)/);
        contentType = m ? m[1] : null;
      } else {
        const res = await page.request.get(src);
        if (!res.ok()) throw new Error(`이미지 HTTP ${res.status()}`);
        buffer = Buffer.from(await res.body());
        contentType = res.headers()['content-type'] || null;
      }
      return { buffer, contentType };
    }

    if (info) lastSrc = info.src;
    await page.waitForTimeout(2500);
  }

  throw new Error('이미지 생성/다운로드 5분 초과');
}
